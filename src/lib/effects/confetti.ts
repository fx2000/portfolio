import gsap from "gsap";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  alpha: number;
  color: string;
  w: number;
  h: number;
}

const COLORS = ["#e5540a", "#ff6b1a", "#ffae70", "#44ddff", "#ff44ff", "#44ff88", "#ffdd44", "#ff4444"];

export function runConfetti(
  canvas: HTMLCanvasElement,
  onComplete: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cw = (canvas.width = window.innerWidth);
  const ch = (canvas.height = window.innerHeight);
  const pieces: ConfettiPiece[] = [];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * cw,
      y: -20 - Math.random() * ch * 0.5,
      vx: (Math.random() - 0.5) * 4,
      vy: 2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      alpha: 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 4,
    });
  }

  const state = { progress: 0 };

  gsap.to(state, {
    progress: 1,
    duration: 4,
    ease: "none",
    onUpdate() {
      ctx.clearRect(0, 0, cw, ch);

      for (const p of pieces) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.03;
        p.vx += (Math.random() - 0.5) * 0.3;
        p.rotation += p.rotationSpeed;

        // Fade out in the last 25%
        if (state.progress > 0.75) {
          p.alpha = Math.max(0, 1 - (state.progress - 0.75) / 0.25);
        }

        if (p.alpha < 0.01) continue;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
    },
    onComplete() {
      ctx.clearRect(0, 0, cw, ch);
      onComplete();
    },
  });
}
