"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface SiteEffects {
  /** CSS color override for --background, or null for default */
  background: string | null;
  /** CSS color override for --accent, or null for default */
  accent: string | null;
  /** Whether the fluid cursor is enabled (default true) */
  cursorEnabled: boolean;
  /** Currently playing overlay effect name, or null */
  activeEffect: string | null;
}

interface SiteEffectsContextValue {
  effects: SiteEffects;
  setEffects: React.Dispatch<React.SetStateAction<SiteEffects>>;
  resetEffects: () => void;
}

const DEFAULT_EFFECTS: SiteEffects = {
  background: null,
  accent: null,
  cursorEnabled: true,
  activeEffect: null,
};

const SiteEffectsContext = createContext<SiteEffectsContextValue | null>(null);

export function SiteEffectsProvider({ children }: { children: ReactNode }) {
  const [effects, setEffects] = useState<SiteEffects>(DEFAULT_EFFECTS);

  const resetEffects = useCallback(() => {
    setEffects(DEFAULT_EFFECTS);
    // Restore CSS custom properties
    document.documentElement.style.removeProperty("--background");
    document.documentElement.style.removeProperty("--accent");
  }, []);

  return (
    <SiteEffectsContext.Provider value={{ effects, setEffects, resetEffects }}>
      {children}
    </SiteEffectsContext.Provider>
  );
}

export function useSiteEffects() {
  const ctx = useContext(SiteEffectsContext);
  if (!ctx) throw new Error("useSiteEffects must be used within SiteEffectsProvider");
  return ctx;
}
