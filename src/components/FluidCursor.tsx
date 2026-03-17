"use client";

import { useEffect } from "react";

/**
 * Renders a WebGL fluid simulation canvas that reacts to cursor movement.
 * Uses the smokey-fluid-cursor library for the effect.
 */
export default function FluidCursor() {
  useEffect(() => {
    import("smokey-fluid-cursor").then((mod) => {
      mod.initFluid({
        id: "fluid-cursor-canvas",
        simResolution: 128,
        dyeResolution: 512,
        densityDissipation: 0.93,
        velocityDissipation: 0.98,
        pressureIteration: 10,
        curl: 30,
        splatRadius: 0.15,
        splatForce: 3000,
        shading: true,
        colorUpdateSpeed: 0.5,
        transparent: true,
      });
    });
  }, []);

  return (
    <canvas
      id="fluid-cursor-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
        opacity: 0.35,
      }}
    />
  );
}
