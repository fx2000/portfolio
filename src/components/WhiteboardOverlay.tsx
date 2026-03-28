"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

interface Stroke {
  points: Array<{ x: number; y: number }>;
  color: string;
  width: number;
}

interface WhiteboardOverlayProps {
  channel: RealtimeChannel;
  myColor: string;
  onlineCount: number;
  onClose: () => void;
}

export default function WhiteboardOverlay({
  channel,
  myColor,
  onlineCount,
  onClose,
}: WhiteboardOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentPointsRef = useRef<Array<{ x: number; y: number }>>([]);
  const allStrokesRef = useRef<Stroke[]>([]);
  const [strokeCount, setStrokeCount] = useState(0);

  // Get normalized coordinates (0-1) from mouse/touch event
  const getNormalized = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / rect.width,
        y: (clientY - rect.top) / rect.height,
      };
    },
    []
  );

  // Render all strokes on the canvas
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution to match display size
    const rect = canvas.getBoundingClientRect();
    if (canvas.width !== rect.width * 2 || canvas.height !== rect.height * 2) {
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    }

    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw all completed strokes
    for (const stroke of allStrokesRef.current) {
      drawStroke(ctx, stroke, rect.width, rect.height);
    }

    // Draw current in-progress stroke
    if (currentPointsRef.current.length > 1) {
      drawStroke(
        ctx,
        { points: currentPointsRef.current, color: myColor, width: 3 },
        rect.width,
        rect.height
      );
    }
  }, [myColor]);

  // Draw a single stroke on the canvas
  function drawStroke(
    ctx: CanvasRenderingContext2D,
    stroke: Stroke,
    w: number,
    h: number
  ) {
    if (stroke.points.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const first = stroke.points[0];
    ctx.moveTo(first.x * w, first.y * h);

    for (let i = 1; i < stroke.points.length; i++) {
      const p = stroke.points[i];
      ctx.lineTo(p.x * w, p.y * h);
    }
    ctx.stroke();
  }

  // Listen for broadcast strokes from other users
  useEffect(() => {
    const subscription = channel.on(
      "broadcast",
      { event: "stroke" },
      (payload) => {
        const stroke = payload.payload as Stroke;
        allStrokesRef.current.push(stroke);
        setStrokeCount((c) => c + 1);
        renderCanvas();
      }
    );

    // Also listen for clear events
    channel.on("broadcast", { event: "clear" }, (payload) => {
      const color = (payload.payload as { color: string }).color;
      allStrokesRef.current = allStrokesRef.current.filter(
        (s) => s.color !== color
      );
      setStrokeCount((c) => c + 1);
      renderCanvas();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [channel, renderCanvas]);

  // Re-render on resize
  useEffect(() => {
    const handleResize = () => renderCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderCanvas]);

  // Re-render when stroke count changes
  useEffect(() => {
    renderCanvas();
  }, [strokeCount, renderCanvas]);

  // Mouse/touch drawing handlers
  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isDrawingRef.current = true;
      const { clientX, clientY } =
        "touches" in e ? e.touches[0] : e.nativeEvent;
      currentPointsRef.current = [getNormalized(clientX, clientY)];
    },
    [getNormalized]
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isDrawingRef.current) return;
      e.preventDefault();
      const { clientX, clientY } =
        "touches" in e ? e.touches[0] : e.nativeEvent;
      currentPointsRef.current.push(getNormalized(clientX, clientY));
      renderCanvas();
    },
    [getNormalized, renderCanvas]
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (currentPointsRef.current.length > 1) {
      const stroke: Stroke = {
        points: [...currentPointsRef.current],
        color: myColor,
        width: 3,
      };
      allStrokesRef.current.push(stroke);
      setStrokeCount((c) => c + 1);

      // Broadcast to other users
      channel.send({
        type: "broadcast",
        event: "stroke",
        payload: stroke,
      });
    }
    currentPointsRef.current = [];
    renderCanvas();
  }, [myColor, channel, renderCanvas]);

  // Clear my strokes
  const clearMyStrokes = useCallback(() => {
    allStrokesRef.current = allStrokesRef.current.filter(
      (s) => s.color !== myColor
    );
    setStrokeCount((c) => c + 1);
    renderCanvas();

    channel.send({
      type: "broadcast",
      event: "clear",
      payload: { color: myColor },
    });
  }, [myColor, channel, renderCanvas]);

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
      <div className="flex items-center justify-between px-3 py-2 bg-[#1a1a1a] border-b border-[#333] shrink-0">
        <div className="flex items-center gap-4">
          {/* My color indicator */}
          <div className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ background: myColor }}
            />
            <span className="text-xs text-[#888] font-mono">Your color</span>
          </div>

          {/* Online count */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span className="text-xs text-[#888] font-mono">
              {onlineCount} online
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearMyStrokes}
            className="px-3 py-1.5 text-xs font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors"
          >
            Clear mine
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-mono text-[#888] hover:text-white hover:bg-[#333] rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-crosshair"
          style={{ background: "#ffffff", touchAction: "none" }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
    </>
  );
}
