import gsap from "gsap";

const DISCO_COLORS = [
  "#ff0055", "#00ffaa", "#ffaa00", "#aa00ff",
  "#00aaff", "#ff5500", "#ff00ff", "#00ff55",
];

export function runDisco(onComplete: () => void) {
  const root = document.documentElement;
  const original = getComputedStyle(root).getPropertyValue("--background").trim();

  const state = { index: 0 };
  const tl = gsap.timeline({ onComplete: finish });

  // Cycle through colors
  for (let i = 0; i < 12; i++) {
    tl.call(
      () => {
        root.style.setProperty("--background", DISCO_COLORS[i % DISCO_COLORS.length]);
      },
      [],
      i * 0.4,
    );
  }

  tl.totalDuration(5);

  function finish() {
    root.style.setProperty("--background", original || "");
    if (!original) root.style.removeProperty("--background");
    onComplete();
  }
}
