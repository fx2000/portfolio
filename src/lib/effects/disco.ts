import gsap from "gsap";

const DISCO_COLORS = [
  "#ff0055", "#00ffaa", "#ffaa00", "#aa00ff",
  "#00aaff", "#ff5500", "#ff00ff", "#00ff55",
];

/** Blend a hex color toward black by a given amount (0 = original, 1 = black) */
function blendWithBlack(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = Math.round(parseInt(h.substring(0, 2), 16) * (1 - amount));
  const g = Math.round(parseInt(h.substring(2, 4), 16) * (1 - amount));
  const b = Math.round(parseInt(h.substring(4, 6), 16) * (1 - amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function setDiscoColor(root: HTMLElement, color: string) {
  root.style.setProperty("--color-background", color);
  root.style.setProperty("--color-surface", blendWithBlack(color, 0.15));
  root.style.setProperty("--color-surface-light", blendWithBlack(color, 0.25));
}

export function runDisco(onComplete: () => void) {
  const root = document.documentElement;
  const origBg = getComputedStyle(root).getPropertyValue("--color-background").trim();
  const origSurface = getComputedStyle(root).getPropertyValue("--color-surface").trim();
  const origSurfaceLight = getComputedStyle(root).getPropertyValue("--color-surface-light").trim();

  const tl = gsap.timeline({ onComplete: finish });

  for (let i = 0; i < 12; i++) {
    tl.call(
      () => setDiscoColor(root, DISCO_COLORS[i % DISCO_COLORS.length]),
      [],
      i * 0.4,
    );
  }

  tl.totalDuration(5);

  function finish() {
    root.style.setProperty("--color-background", origBg);
    root.style.setProperty("--color-surface", origSurface);
    root.style.setProperty("--color-surface-light", origSurfaceLight);
    onComplete();
  }
}
