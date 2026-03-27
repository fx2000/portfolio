import type { SiteEffects } from "@/context/SiteEffectsContext";

export interface Command {
  action: string;
  color?: string;
  enabled?: boolean;
  section?: string;
  project?: string;
}

/** Blend a hex color toward black by a given amount (0 = original, 1 = black) */
function blendWithBlack(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = Math.round(parseInt(h.substring(0, 2), 16) * (1 - amount));
  const g = Math.round(parseInt(h.substring(2, 4), 16) * (1 - amount));
  const b = Math.round(parseInt(h.substring(4, 6), 16) * (1 - amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Parse a [COMMAND:{...}] tag from the AI response. Returns { text, command }. */
export function parseCommandFromResponse(raw: string): {
  text: string;
  command: Command | null;
} {
  // Match [COMMAND:{"action":"..."}] — handles optional whitespace and newlines
  const match = raw.match(/\[COMMAND:\s*(\{[^}]+\})\s*\]/);
  if (!match) return { text: raw, command: null };

  const text = raw.replace(/\[COMMAND:\s*\{[^}]+\}\s*\]/g, "").trim();

  try {
    const command = JSON.parse(match[1].trim()) as Command;
    if (!command.action || typeof command.action !== "string") return { text, command: null };
    return { text, command };
  } catch {
    return { text, command: null };
  }
}

type CommandHandler = (
  command: Command,
  setEffects: React.Dispatch<React.SetStateAction<SiteEffects>>,
  resetEffects: () => void,
) => void;

const handlers: Record<string, CommandHandler> = {
  changeBackground(command, setEffects) {
    if (!command.color) return;
    const root = document.documentElement;
    root.style.setProperty("--color-background", command.color);
    // Derive surface variants so the entire page changes cohesively
    root.style.setProperty("--color-surface", blendWithBlack(command.color, 0.15));
    root.style.setProperty("--color-surface-light", blendWithBlack(command.color, 0.25));
    setEffects((prev) => ({ ...prev, background: command.color! }));
  },

  changeAccent(command, setEffects) {
    if (!command.color) return;
    document.documentElement.style.setProperty("--color-accent", command.color);
    setEffects((prev) => ({ ...prev, accent: command.color! }));
  },

  changeText(command, setEffects) {
    if (!command.color) return;
    document.documentElement.style.setProperty("--color-foreground", command.color);
    setEffects((prev) => ({ ...prev, foreground: command.color! }));
  },

  toggleCursor(command, setEffects) {
    const enabled = command.enabled ?? false;
    setEffects((prev) => ({ ...prev, cursorEnabled: enabled }));
  },

  fireworks(_command, setEffects) {
    setEffects((prev) => ({ ...prev, activeEffect: "fireworks" }));
  },

  confetti(_command, setEffects) {
    setEffects((prev) => ({ ...prev, activeEffect: "confetti" }));
  },

  shake() {
    import("gsap").then(({ default: gsap }) => {
      gsap.to("body", {
        x: () => Math.random() * 10 - 5,
        y: () => Math.random() * 6 - 3,
        duration: 0.08,
        repeat: 8,
        yoyo: true,
        ease: "power2.inOut",
        onComplete() { gsap.set("body", { x: 0, y: 0 }); },
      });
    });
  },

  disco(_command, setEffects) {
    setEffects((prev) => ({ ...prev, activeEffect: "disco" }));
  },

  matrix(_command, setEffects) {
    setEffects((prev) => ({ ...prev, activeEffect: "matrix" }));
  },

  snow(_command, setEffects) {
    setEffects((prev) => ({ ...prev, activeEffect: "snow" }));
  },

  scrollTo(command) {
    if (!command.section) return;
    const sectionMap: Record<string, string> = {
      top: "main-content",
      hero: "main-content",
      about: "about",
      work: "work",
      projects: "work",
      testimonials: "testimonials",
      contact: "contact",
    };
    const id = sectionMap[command.section.toLowerCase()];
    const el = id ? document.getElementById(id) : null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  },

  highlight(command) {
    if (!command.project) return;
    const target = command.project.toLowerCase();

    // Search featured project cards and more-work cards by their title text
    const cards = document.querySelectorAll<HTMLElement>(
      "[data-project-title]"
    );

    for (const card of cards) {
      const title = card.dataset.projectTitle?.toLowerCase() ?? "";
      if (title.includes(target) || target.includes(title)) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });

        // Pulse glow effect
        card.style.transition = "box-shadow 0.3s ease, transform 0.3s ease";
        card.style.boxShadow = "0 0 30px 10px rgba(229, 84, 10, 0.4)";
        card.style.transform = "scale(1.02)";
        setTimeout(() => {
          card.style.boxShadow = "";
          card.style.transform = "";
        }, 2000);
        return;
      }
    }
  },

  generatePitch(_command, setEffects) {
    // Trigger confetti as a celebratory moment; the CTA button is handled in ChatWidget
    setEffects((prev) => ({ ...prev, activeEffect: "confetti" }));
  },

  reset(_command, _setEffects, resetEffects) {
    resetEffects();
  },
};

/** Execute a parsed command. Returns true if the command was recognized. */
export function executeCommand(
  command: Command,
  setEffects: React.Dispatch<React.SetStateAction<SiteEffects>>,
  resetEffects: () => void,
): boolean {
  const handler = handlers[command.action];
  if (!handler) return false;
  handler(command, setEffects, resetEffects);
  return true;
}
