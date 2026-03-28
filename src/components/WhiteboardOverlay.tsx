"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ── Types ──

type ToolType = "draw" | "rect" | "circle" | "arrow" | "line" | "text" | "select";

interface Shape {
  id: string;
  type: "stroke" | "rect" | "circle" | "arrow" | "line" | "text";
  // Normalized coordinates (0-1)
  points?: Array<{ x: number; y: number }>; // for stroke
  x?: number; y?: number; w?: number; h?: number; // for rect/circle
  x1?: number; y1?: number; x2?: number; y2?: number; // for arrow/line
  text?: string; // for text
  fontSize?: number; // for text (normalized)
  color: string;
  width: number;
  userId: string;
}

interface CursorInfo {
  x: number;
  y: number;
  color: string;
  name: string;
}

interface WhiteboardOverlayProps {
  channel: RealtimeChannel;
  myColor: string;
  myName: string;
  onlineCount: number;
  onClose: () => void;
}

const TOOL_COLORS = [
  "#e5540a", "#3b82f6", "#22c55e", "#a855f7",
  "#ec4899", "#f59e0b", "#ef4444", "#000000",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ── Tool Icons (inline SVGs) ──

function ToolIcon({ tool }: { tool: ToolType }) {
  const s = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (tool) {
    case "draw": return <svg {...s}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
    case "rect": return <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
    case "circle": return <svg {...s}><circle cx="12" cy="12" r="9" /></svg>;
    case "arrow": return <svg {...s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case "line": return <svg {...s}><line x1="4" y1="20" x2="20" y2="4" /></svg>;
    case "text": return <svg {...s}><polyline points="4 7 4 4 20 4 20 7" /><line x1="9.5" y1="20" x2="14.5" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg>;
    case "select": return <svg {...s}><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51Z" /><path d="M13 13l6 6" /></svg>;
  }
}

// ── Component ──

export default function WhiteboardOverlay({
  channel,
  myColor: initialColor,
  myName,
  onlineCount,
  onClose,
}: WhiteboardOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const undoStackRef = useRef<Shape[][]>([]);
  const [activeTool, setActiveTool] = useState<ToolType>("draw");
  const [color, setColor] = useState(initialColor);
  const [, setRenderTick] = useState(0);
  const [copied, setCopied] = useState(false);

  // Drawing state
  const isDrawingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const currentPointsRef = useRef<Array<{ x: number; y: number }>>([]);
  const previewShapeRef = useRef<Shape | null>(null);

  // Selection state
  const selectedIdRef = useRef<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Text input state
  const [textInput, setTextInput] = useState<{ x: number; y: number; clientX: number; clientY: number } | null>(null);
  const [textValue, setTextValue] = useState("");
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Remote cursors
  const remoteCursorsRef = useRef<Map<string, CursorInfo>>(new Map());
  const [, setCursorTick] = useState(0);
  const cursorThrottleRef = useRef(0);

  const userId = useRef(uid()).current;

  const triggerRender = useCallback(() => setRenderTick((t) => t + 1), []);

  // ── Coordinate helpers ──

  const getNorm = useCallback((clientX: number, clientY: number) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    return { x: (clientX - r.left) / r.width, y: (clientY - r.top) / r.height };
  }, []);

  // ── Canvas rendering ──

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * 2 || canvas.height !== rect.height * 2) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    }

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    const allShapes = [...shapesRef.current];
    if (previewShapeRef.current) allShapes.push(previewShapeRef.current);

    // Draw in-progress freehand stroke
    if (currentPointsRef.current.length > 1) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(currentPointsRef.current[0].x * w, currentPointsRef.current[0].y * h);
      for (let i = 1; i < currentPointsRef.current.length; i++) {
        ctx.lineTo(currentPointsRef.current[i].x * w, currentPointsRef.current[i].y * h);
      }
      ctx.stroke();
    }

    for (const shape of allShapes) {
      ctx.strokeStyle = shape.color;
      ctx.lineWidth = shape.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.fillStyle = "transparent";

      const selected = shape.id === selectedIdRef.current;
      if (selected) {
        ctx.setLineDash([6, 4]);
      } else {
        ctx.setLineDash([]);
      }

      switch (shape.type) {
        case "stroke":
          if (shape.points && shape.points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x * w, shape.points[0].y * h);
            for (let i = 1; i < shape.points.length; i++) {
              ctx.lineTo(shape.points[i].x * w, shape.points[i].y * h);
            }
            ctx.stroke();
          }
          break;

        case "rect":
          ctx.strokeRect(shape.x! * w, shape.y! * h, shape.w! * w, shape.h! * h);
          break;

        case "circle": {
          const cx = (shape.x! + shape.w! / 2) * w;
          const cy = (shape.y! + shape.h! / 2) * h;
          const rx = Math.abs(shape.w! / 2) * w;
          const ry = Math.abs(shape.h! / 2) * h;
          ctx.beginPath();
          ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
        }

        case "line":
          ctx.beginPath();
          ctx.moveTo(shape.x1! * w, shape.y1! * h);
          ctx.lineTo(shape.x2! * w, shape.y2! * h);
          ctx.stroke();
          break;

        case "arrow": {
          const ax1 = shape.x1! * w, ay1 = shape.y1! * h;
          const ax2 = shape.x2! * w, ay2 = shape.y2! * h;
          ctx.beginPath();
          ctx.moveTo(ax1, ay1);
          ctx.lineTo(ax2, ay2);
          ctx.stroke();
          // Arrowhead
          const angle = Math.atan2(ay2 - ay1, ax2 - ax1);
          const headLen = 12;
          ctx.beginPath();
          ctx.moveTo(ax2, ay2);
          ctx.lineTo(ax2 - headLen * Math.cos(angle - 0.4), ay2 - headLen * Math.sin(angle - 0.4));
          ctx.moveTo(ax2, ay2);
          ctx.lineTo(ax2 - headLen * Math.cos(angle + 0.4), ay2 - headLen * Math.sin(angle + 0.4));
          ctx.stroke();
          break;
        }

        case "text": {
          if (!shape.text) break;
          const fs = (shape.fontSize ?? 0.025) * h;
          ctx.setLineDash([]);
          ctx.font = `${fs}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = shape.color;
          ctx.textBaseline = "top";
          const lines = shape.text.split("\n");
          for (let li = 0; li < lines.length; li++) {
            ctx.fillText(lines[li], shape.x! * w, shape.y! * h + li * fs * 1.3);
          }
          if (selected) {
            const maxWidth = Math.max(...lines.map((l) => ctx.measureText(l).width));
            const totalH = lines.length * fs * 1.3;
            ctx.strokeStyle = shape.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([4, 3]);
            ctx.strokeRect(shape.x! * w - 2, shape.y! * h - 2, maxWidth + 4, totalH + 4);
          }
          break;
        }
      }

      ctx.setLineDash([]);
    }
  }, [color]);

  // ── Supabase listeners ──

  useEffect(() => {
    channel.on("broadcast", { event: "shape" }, (payload) => {
      const shape = payload.payload as Shape;
      shapesRef.current.push(shape);
      triggerRender();
    });

    channel.on("broadcast", { event: "move" }, (payload) => {
      const { id, x, y, x1, y1, x2, y2 } = payload.payload as Shape & { x: number; y: number };
      const s = shapesRef.current.find((s) => s.id === id);
      if (s) {
        if (s.type === "arrow" || s.type === "line") {
          s.x1 = x1; s.y1 = y1; s.x2 = x2; s.y2 = y2;
        } else if (s.type === "stroke" && s.points) {
          // Not movable for now
        } else {
          s.x = x; s.y = y;
        }
        triggerRender();
      }
    });

    channel.on("broadcast", { event: "delete" }, (payload) => {
      const { id } = payload.payload as { id: string };
      shapesRef.current = shapesRef.current.filter((s) => s.id !== id);
      triggerRender();
    });

    channel.on("broadcast", { event: "clear" }, (payload) => {
      const { userId: uid } = payload.payload as { userId: string };
      shapesRef.current = shapesRef.current.filter((s) => s.userId !== uid);
      triggerRender();
    });

    channel.on("broadcast", { event: "cursor" }, (payload) => {
      const { id, x, y, color: c, name } = payload.payload as { id: string; x: number; y: number; color: string; name: string };
      if (id === userId) return; // ignore own cursor
      remoteCursorsRef.current.set(id, { x, y, color: c, name });
      setCursorTick((t) => t + 1);
      // Auto-remove stale cursors after 5s
      setTimeout(() => {
        const cursor = remoteCursorsRef.current.get(id);
        if (cursor && cursor.x === x && cursor.y === y) {
          remoteCursorsRef.current.delete(id);
          setCursorTick((t) => t + 1);
        }
      }, 5000);
    });
  }, [channel, triggerRender, userId]);

  useEffect(() => { renderCanvas(); });

  useEffect(() => {
    const handleResize = () => renderCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderCanvas]);

  // ── Save undo state ──

  const saveUndo = useCallback(() => {
    undoStackRef.current.push(shapesRef.current.map((s) => ({ ...s, points: s.points ? [...s.points] : undefined })));
    if (undoStackRef.current.length > 50) undoStackRef.current.shift();
  }, []);

  // ── Hit test for selection ──

  const hitTest = useCallback((px: number, py: number): Shape | null => {
    // Iterate in reverse so topmost shapes are selected first
    for (let i = shapesRef.current.length - 1; i >= 0; i--) {
      const s = shapesRef.current[i];
      const t = 0.02; // tolerance
      switch (s.type) {
        case "rect":
          if (px >= s.x! - t && px <= s.x! + s.w! + t && py >= s.y! - t && py <= s.y! + s.h! + t) return s;
          break;
        case "circle": {
          const cx = s.x! + s.w! / 2, cy = s.y! + s.h! / 2;
          const rx = Math.abs(s.w! / 2) + t, ry = Math.abs(s.h! / 2) + t;
          if (((px - cx) ** 2) / (rx ** 2) + ((py - cy) ** 2) / (ry ** 2) <= 1) return s;
          break;
        }
        case "arrow":
        case "line": {
          const dx = s.x2! - s.x1!, dy = s.y2! - s.y1!;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 0.001) break;
          const dot = ((px - s.x1!) * dx + (py - s.y1!) * dy) / (len * len);
          if (dot < 0 || dot > 1) break;
          const closestX = s.x1! + dot * dx, closestY = s.y1! + dot * dy;
          const dist = Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
          if (dist < t) return s;
          break;
        }
        case "stroke":
          if (s.points) {
            for (const p of s.points) {
              if (Math.abs(p.x - px) < t && Math.abs(p.y - py) < t) return s;
            }
          }
          break;
        case "text":
          if (px >= s.x! - t && px <= s.x! + 0.15 && py >= s.y! - t && py <= s.y! + 0.04) return s;
          break;
      }
    }
    return null;
  }, []);

  // ── Mouse/touch handlers ──

  const commitText = useCallback(() => {
    if (!textInput || !textValue.trim()) {
      setTextInput(null);
      setTextValue("");
      return;
    }
    const shape: Shape = {
      id: uid(),
      type: "text",
      x: textInput.x,
      y: textInput.y,
      text: textValue.trim(),
      fontSize: 0.025,
      color,
      width: 1,
      userId,
    };
    saveUndo();
    shapesRef.current.push(shape);
    channel.send({ type: "broadcast", event: "shape", payload: shape });
    triggerRender();
    setTextInput(null);
    setTextValue("");
  }, [textInput, textValue, color, userId, saveUndo, channel, triggerRender]);

  const onStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e.nativeEvent;
    const pos = getNorm(clientX, clientY);
    isDrawingRef.current = true;
    startPosRef.current = pos;

    if (activeTool === "select") {
      const hit = hitTest(pos.x, pos.y);
      selectedIdRef.current = hit?.id ?? null;
      if (hit) {
        if (hit.type === "arrow" || hit.type === "line") {
          dragOffsetRef.current = { x: pos.x - hit.x1!, y: pos.y - hit.y1! };
        } else if (hit.type === "rect" || hit.type === "circle" || hit.type === "text") {
          dragOffsetRef.current = { x: pos.x - hit.x!, y: pos.y - hit.y! };
        }
        saveUndo();
      }
      triggerRender();
      return;
    }

    if (activeTool === "text") {
      isDrawingRef.current = false;
      setTextInput({ x: pos.x, y: pos.y, clientX, clientY });
      setTextValue("");
      setTimeout(() => textInputRef.current?.focus(), 50);
      return;
    }

    if (activeTool === "draw") {
      currentPointsRef.current = [pos];
    }
  }, [activeTool, getNorm, hitTest, saveUndo, triggerRender]);

  // Broadcast cursor position (throttled ~30fps)
  const broadcastCursor = useCallback((pos: { x: number; y: number }) => {
    const now = Date.now();
    if (now - cursorThrottleRef.current < 33) return;
    cursorThrottleRef.current = now;
    channel.send({
      type: "broadcast",
      event: "cursor",
      payload: { id: userId, x: pos.x, y: pos.y, color: color, name: myName },
    });
  }, [channel, color, myName, userId]);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e.nativeEvent;
    const pos = getNorm(clientX, clientY);
    lastPosRef.current = pos;

    // Always broadcast cursor, even when not drawing
    broadcastCursor(pos);

    if (!isDrawingRef.current) return;
    e.preventDefault();

    if (activeTool === "select") {
      const s = shapesRef.current.find((s) => s.id === selectedIdRef.current);
      if (!s) return;
      if (s.type === "arrow" || s.type === "line") {
        const dx = pos.x - dragOffsetRef.current.x - s.x1!;
        const dy = pos.y - dragOffsetRef.current.y - s.y1!;
        s.x1! += dx; s.y1! += dy; s.x2! += dx; s.y2! += dy;
      } else if (s.type === "rect" || s.type === "circle" || s.type === "text") {
        s.x = pos.x - dragOffsetRef.current.x;
        s.y = pos.y - dragOffsetRef.current.y;
      }
      triggerRender();
      return;
    }

    if (activeTool === "draw") {
      currentPointsRef.current.push(pos);
      renderCanvas();
      return;
    }

    // Shape preview
    const start = startPosRef.current;
    const id = "preview";
    if (activeTool === "rect") {
      previewShapeRef.current = { id, type: "rect", x: Math.min(start.x, pos.x), y: Math.min(start.y, pos.y), w: Math.abs(pos.x - start.x), h: Math.abs(pos.y - start.y), color, width: 2, userId };
    } else if (activeTool === "circle") {
      previewShapeRef.current = { id, type: "circle", x: Math.min(start.x, pos.x), y: Math.min(start.y, pos.y), w: Math.abs(pos.x - start.x), h: Math.abs(pos.y - start.y), color, width: 2, userId };
    } else if (activeTool === "arrow") {
      previewShapeRef.current = { id, type: "arrow", x1: start.x, y1: start.y, x2: pos.x, y2: pos.y, color, width: 2, userId };
    } else if (activeTool === "line") {
      previewShapeRef.current = { id, type: "line", x1: start.x, y1: start.y, x2: pos.x, y2: pos.y, color, width: 2, userId };
    }
    renderCanvas();
  }, [activeTool, broadcastCursor, color, getNorm, renderCanvas, triggerRender, userId]);

  const onEnd = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    previewShapeRef.current = null;

    if (activeTool === "select") {
      // Broadcast moved shape
      const s = shapesRef.current.find((s) => s.id === selectedIdRef.current);
      if (s) {
        channel.send({ type: "broadcast", event: "move", payload: s });
      }
      return;
    }

    const pos = startPosRef.current;
    const end = activeTool === "draw"
      ? (currentPointsRef.current.length > 0 ? currentPointsRef.current[currentPointsRef.current.length - 1] : pos)
      : lastPosRef.current;

    let shape: Shape | null = null;

    if (activeTool === "draw" && currentPointsRef.current.length > 1) {
      shape = { id: uid(), type: "stroke", points: [...currentPointsRef.current], color, width: 3, userId };
    } else if (activeTool === "rect") {
      shape = { id: uid(), type: "rect", x: Math.min(pos.x, end.x), y: Math.min(pos.y, end.y), w: Math.abs(end.x - pos.x), h: Math.abs(end.y - pos.y), color, width: 2, userId };
    } else if (activeTool === "circle") {
      shape = { id: uid(), type: "circle", x: Math.min(pos.x, end.x), y: Math.min(pos.y, end.y), w: Math.abs(end.x - pos.x), h: Math.abs(end.y - pos.y), color, width: 2, userId };
    } else if (activeTool === "arrow") {
      shape = { id: uid(), type: "arrow", x1: pos.x, y1: pos.y, x2: end.x, y2: end.y, color, width: 2, userId };
    } else if (activeTool === "line") {
      shape = { id: uid(), type: "line", x1: pos.x, y1: pos.y, x2: end.x, y2: end.y, color, width: 2, userId };
    }

    const isValid = shape && (
      shape.type === "stroke" ||
      (shape.type === "rect" && Math.abs(shape.w!) > 0.005 && Math.abs(shape.h!) > 0.005) ||
      (shape.type === "circle" && Math.abs(shape.w!) > 0.005 && Math.abs(shape.h!) > 0.005) ||
      (shape.type === "line" && (Math.abs(shape.x2! - shape.x1!) > 0.005 || Math.abs(shape.y2! - shape.y1!) > 0.005)) ||
      (shape.type === "arrow" && (Math.abs(shape.x2! - shape.x1!) > 0.005 || Math.abs(shape.y2! - shape.y1!) > 0.005))
    );
    if (isValid && shape) {
      saveUndo();
      shapesRef.current.push(shape);
      channel.send({ type: "broadcast", event: "shape", payload: shape });
      triggerRender();
    }

    currentPointsRef.current = [];
    renderCanvas();
  }, [activeTool, channel, color, renderCanvas, saveUndo, triggerRender, userId]);

  // ── Undo ──

  const undo = useCallback(() => {
    const prev = undoStackRef.current.pop();
    if (prev) {
      shapesRef.current = prev;
      triggerRender();
    }
  }, [triggerRender]);

  // ── Delete selected ──

  const deleteSelected = useCallback(() => {
    if (!selectedIdRef.current) return;
    saveUndo();
    const id = selectedIdRef.current;
    shapesRef.current = shapesRef.current.filter((s) => s.id !== id);
    selectedIdRef.current = null;
    channel.send({ type: "broadcast", event: "delete", payload: { id } });
    triggerRender();
  }, [channel, saveUndo, triggerRender]);

  // ── Clear mine ──

  const clearMine = useCallback(() => {
    saveUndo();
    shapesRef.current = shapesRef.current.filter((s) => s.userId !== userId);
    channel.send({ type: "broadcast", event: "clear", payload: { userId } });
    triggerRender();
  }, [channel, saveUndo, triggerRender, userId]);

  // ── Keyboard shortcuts ──

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") deleteSelected();
      if ((e.metaKey || e.ctrlKey) && e.key === "z") { e.preventDefault(); undo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [deleteSelected, undo]);

  // ── Save as PNG ──

  const savePng = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  // ── Copy to clipboard ──

  const copyToClipboard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback: try data URL
      savePng();
    }
  }, [savePng]);

  // ── Cursor style ──

  const cursor = activeTool === "select" ? "default" : activeTool === "text" ? "text" : "crosshair";

  const tools: ToolType[] = ["select", "draw", "rect", "circle", "line", "arrow", "text"];

  return (
    <>
      {/* Dark backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 10002, background: "rgba(0,0,0,0.6)" }}
        onClick={onClose}
      />

      {/* Whiteboard window */}
      <div
        className="fixed top-1/2 left-1/2 flex flex-col rounded-2xl overflow-hidden border border-[#333]"
        style={{
          zIndex: 10003,
          width: "min(92vw, 1100px)",
          height: "min(85vh, 750px)",
          transform: "translate(-50%, -50%)",
          background: "#0a0a0a",
          boxShadow: "0 0 40px rgba(229, 84, 10, 0.2), 0 0 80px rgba(229, 84, 10, 0.1), 0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1a] border-b border-[#333] shrink-0 gap-2 flex-wrap">
          {/* Left: tools */}
          <div className="flex items-center gap-1">
            {tools.map((t) => (
              <button
                key={t}
                onClick={() => { setActiveTool(t); selectedIdRef.current = null; triggerRender(); }}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeTool === t
                    ? "bg-[#e5540a] text-white"
                    : "text-[#888] hover:text-white hover:bg-[#333]"
                }`}
                title={t.charAt(0).toUpperCase() + t.slice(1)}
              >
                <ToolIcon tool={t} />
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-5 bg-[#333] mx-1" />

            {/* Colors */}
            {TOOL_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  background: c,
                  borderColor: color === c ? "#fff" : "transparent",
                }}
                title={c}
              />
            ))}
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1">
            {/* Online count */}
            <div className="flex items-center gap-1.5 mr-2">
              <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
              <span className="text-[10px] text-[#888] font-mono">{onlineCount}</span>
            </div>

            <button onClick={undo} className="px-2 py-1 text-[10px] font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors" title="Undo (Cmd+Z)">
              Undo
            </button>
            <button onClick={deleteSelected} className="px-2 py-1 text-[10px] font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors" title="Delete selected">
              Delete
            </button>
            <button onClick={clearMine} className="px-2 py-1 text-[10px] font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors">
              Clear mine
            </button>

            <div className="w-px h-5 bg-[#333] mx-1" />

            <button onClick={copyToClipboard} className="px-2 py-1 text-[10px] font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors">
              {copied ? "Copied!" : "Copy"}
            </button>
            <button onClick={savePng} className="px-2 py-1 text-[10px] font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors">
              Save PNG
            </button>

            <div className="w-px h-5 bg-[#333] mx-1" />

            <button onClick={onClose} className="px-2 py-1 text-[10px] font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors">
              Close
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ background: "#ffffff", touchAction: "none", cursor }}
            onMouseDown={onStart}
            onMouseMove={onMove}
            onMouseUp={onEnd}
            onMouseLeave={onEnd}
            onTouchStart={onStart}
            onTouchMove={onMove}
            onTouchEnd={onEnd}
          />

          {/* Remote cursors */}
          {Array.from(remoteCursorsRef.current.entries()).map(([id, cur]) => (
            <div
              key={id}
              className="absolute pointer-events-none"
              style={{
                left: `${cur.x * 100}%`,
                top: `${cur.y * 100}%`,
                transform: "translate(-2px, -2px)",
                transition: "left 0.05s linear, top 0.05s linear",
              }}
            >
              {/* Cursor arrow */}
              <svg width="16" height="20" viewBox="0 0 16 20" fill={cur.color} style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}>
                <path d="M0 0L16 12L8 12L4 20L0 0Z" />
              </svg>
              {/* Name label */}
              <span
                className="absolute left-4 top-3 whitespace-nowrap text-[10px] font-medium px-1.5 py-0.5 rounded shadow-sm"
                style={{ background: cur.color, color: "#fff" }}
              >
                {cur.name}
              </span>
            </div>
          ))}

          {/* Text input overlay */}
          {textInput && (
            <textarea
              ref={textInputRef}
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onBlur={commitText}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commitText(); }
                if (e.key === "Escape") { setTextInput(null); setTextValue(""); }
              }}
              className="absolute bg-transparent outline-none resize-none"
              style={{
                left: textInput.clientX - (canvasRef.current?.getBoundingClientRect().left ?? 0),
                top: textInput.clientY - (canvasRef.current?.getBoundingClientRect().top ?? 0),
                color,
                fontSize: "18px",
                fontFamily: "Inter, system-ui, sans-serif",
                minWidth: "100px",
                minHeight: "28px",
                border: `1px dashed ${color}`,
                padding: "2px 4px",
                lineHeight: 1.3,
              }}
              placeholder="Type..."
            />
          )}
        </div>
      </div>
    </>
  );
}
