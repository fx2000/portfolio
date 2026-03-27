"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSiteEffects } from "@/context/SiteEffectsContext";

/**
 * Full-viewport canvas overlay for visual effects (fireworks, confetti, matrix, snow).
 * Disco is CSS-only and handled directly in its module.
 */
export default function EffectsOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { effects, setEffects } = useSiteEffects();

  const clearEffect = useCallback(() => {
    setEffects((prev) => ({ ...prev, activeEffect: null }));
  }, [setEffects]);

  useEffect(() => {
    const effect = effects.activeEffect;
    if (!effect) return;

    const canvas = canvasRef.current;

    // Canvas-based effects
    if (canvas && (effect === "fireworks" || effect === "confetti" || effect === "matrix" || effect === "snow")) {
      const run = async () => {
        switch (effect) {
          case "fireworks": {
            const { runFireworks } = await import("@/lib/effects/fireworks");
            runFireworks(canvas, clearEffect);
            break;
          }
          case "confetti": {
            const { runConfetti } = await import("@/lib/effects/confetti");
            runConfetti(canvas, clearEffect);
            break;
          }
          case "matrix": {
            const { runMatrix } = await import("@/lib/effects/matrix");
            runMatrix(canvas, clearEffect);
            break;
          }
          case "snow": {
            const { runSnow } = await import("@/lib/effects/snow");
            runSnow(canvas, clearEffect);
            break;
          }
        }
      };
      run();
    }

    // Disco is CSS-only, no canvas needed
    if (effect === "disco") {
      import("@/lib/effects/disco").then(({ runDisco }) => {
        runDisco(clearEffect);
      });
    }
  }, [effects.activeEffect, clearEffect]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 10002,
        display: effects.activeEffect && effects.activeEffect !== "disco" ? "block" : "none",
      }}
    />
  );
}
