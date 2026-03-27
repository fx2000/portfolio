import gsap from "gsap";

interface Snowflake {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  alpha: number;
}

export function runSnow(
  canvas: HTMLCanvasElement,
  onComplete: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);
  const flakes: Snowflake[] = [];

  for (let i = 0; i < 200; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h - h,
      size: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 0.5,
      alpha: 0.5 + Math.random() * 0.5,
    });
  }

  const state = { progress: 0 };

  gsap.to(state, {
    progress: 1,
    duration: 6,
    ease: "none",
    onUpdate() {
      ctx.clearRect(0, 0, w, h);

      const fadeAlpha =
        state.progress > 0.75
          ? Math.max(0, 1 - (state.progress - 0.75) / 0.25)
          : 1;

      for (const f of flakes) {
        f.y += f.speed;
        f.x += f.drift + Math.sin(f.y * 0.01) * 0.5;

        if (f.y > h) {
          f.y = -5;
          f.x = Math.random() * w;
        }

        ctx.globalAlpha = f.alpha * fadeAlpha;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    },
    onComplete() {
      ctx.clearRect(0, 0, w, h);
      onComplete();
    },
  });
}
