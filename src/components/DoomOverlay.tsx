"use client";

import { useEffect, useRef, useCallback } from "react";

interface DoomOverlayProps {
  onClose: () => void;
}

export default function DoomOverlay({ onClose }: DoomOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  // Close on Escape key (only when iframe is not focused)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  // Build the iframe srcdoc with js-dos embedded directly
  const srcdoc = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #000; }
    #dos { width: 100%; height: 100%; }
    .loading {
      display: flex; align-items: center; justify-content: center;
      width: 100%; height: 100%; color: #e5540a; font-family: monospace;
      font-size: 16px; flex-direction: column; gap: 12px;
    }
    .loading .spinner {
      width: 32px; height: 32px; border: 3px solid #333;
      border-top: 3px solid #e5540a; border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
  <link rel="stylesheet" href="https://v8.js-dos.com/latest/js-dos.css">
  <script src="https://v8.js-dos.com/latest/js-dos.js"><\/script>
</head>
<body>
  <div id="dos">
    <div class="loading">
      <div class="spinner"></div>
      <div>Loading DOOM...</div>
    </div>
  </div>
  <script>
    Dos(document.getElementById("dos"), {
      url: "https://v8.js-dos.com/bundles/doom.jsdos",
    });
  <\/script>
</body>
</html>`;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 10003, background: "rgba(0,0,0,0.9)" }}
    >
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden border border-[#333333]"
        style={{
          width: "min(90vw, 960px)",
          height: "min(80vh, 640px)",
          boxShadow: "0 0 60px rgba(229, 84, 10, 0.3), 0 0 120px rgba(229, 84, 10, 0.1)",
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#333333]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-[#e5540a] font-bold tracking-wider">
              DOOM
            </span>
            <span className="text-[10px] text-[#888888] font-mono">
              Shareware v1.9 &middot; id Software, 1993
            </span>
          </div>
          <button
            onClick={handleClose}
            className="px-3 py-1 text-xs font-mono text-[#888888] hover:text-white hover:bg-[#333333] rounded transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* js-dos via srcdoc iframe — no third-party embedding restrictions */}
        <iframe
          ref={iframeRef}
          srcDoc={srcdoc}
          className="w-full bg-black"
          style={{ height: "calc(100% - 40px)" }}
          allow="autoplay; pointer-lock"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          title="DOOM - Shareware"
        />
      </div>
    </div>
  );
}
