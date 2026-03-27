import gsap from "gsap";

export function runMatrix(
  canvas: HTMLCanvasElement,
  onComplete: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);

  const fontSize = 14;
  const columns = Math.floor(w / fontSize);
  const drops = new Array(columns).fill(1).map(() => Math.random() * -50);
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";

  const state = { progress: 0 };

  gsap.to(state, {
    progress: 1,
    duration: 6,
    ease: "none",
    onUpdate() {
      // Semi-transparent black to create trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "#0f0";
      ctx.font = `${fontSize}px monospace`;

      // Fade out in the last 20%
      if (state.progress > 0.8) {
        ctx.globalAlpha = Math.max(0, 1 - (state.progress - 0.8) / 0.2);
      }

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5;
      }

      ctx.globalAlpha = 1;
    },
    onComplete() {
      ctx.clearRect(0, 0, w, h);
      onComplete();
    },
  });
}
