"use client";

import { useEffect, useState } from "react";
import { useSiteEffects } from "@/context/SiteEffectsContext";

/**
 * Renders a WebGL fluid simulation canvas that reacts to cursor movement.
 * Uses the smokey-fluid-cursor library for the effect.
 * Disabled on touch/mobile devices to preserve native scrolling.
 */
export default function FluidCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const { effects } = useSiteEffects();

  useEffect(() => {
    const pointerMql = window.matchMedia("(pointer: fine)");
    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsDesktop(pointerMql.matches && !motionMql.matches);

    const update = () =>
      setIsDesktop(pointerMql.matches && !motionMql.matches);
    pointerMql.addEventListener("change", update);
    motionMql.addEventListener("change", update);
    return () => {
      pointerMql.removeEventListener("change", update);
      motionMql.removeEventListener("change", update);
    };
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
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,
        opacity: effects.cursorEnabled ? 0.35 : 0,
        transition: "opacity 0.3s ease",
      }}
    />
  );
}
