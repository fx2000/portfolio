"use client";

import { useEffect, useState } from "react";

/**
 * Renders a WebGL fluid simulation canvas that reacts to cursor movement.
 * Uses the smokey-fluid-cursor library for the effect.
 * Disabled on touch/mobile devices to preserve native scrolling.
 */
export default function FluidCursor() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    setIsDesktop(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

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
  }, [isDesktop]);

  if (!isDesktop) return null;

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
