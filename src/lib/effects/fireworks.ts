import gsap from "gsap";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

const COLORS = ["#e5540a", "#ff6b1a", "#ffae70", "#ff4444", "#ffdd44", "#44ddff", "#ff44ff", "#44ff88"];

export function runFireworks(
  canvas: HTMLCanvasElement,
  onComplete: () => void,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);
  const particles: Particle[] = [];
  const bursts = 5;

  // Create bursts at staggered times
  for (let b = 0; b < bursts; b++) {
    const delay = b * 0.4;
    const cx = w * 0.2 + Math.random() * w * 0.6;
    const cy = h * 0.15 + Math.random() * h * 0.4;

    gsap.delayedCall(delay, () => {
      for (let i = 0; i < 80; i++) {
        const angle = (Math.PI * 2 * i) / 80 + (Math.random() - 0.5) * 0.3;
        const speed = 2 + Math.random() * 5;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          size: 2 + Math.random() * 3,
        });
      }
    });
  }

  const state = { progress: 0 };

  gsap.to(state, {
    progress: 1,
    duration: 3.5,
    ease: "none",
    onUpdate() {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.06; // gravity
        p.alpha *= 0.985;
        p.vx *= 0.99;

        if (p.alpha < 0.01) continue;

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
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
