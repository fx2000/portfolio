import type { SiteEffects } from "@/context/SiteEffectsContext";

export interface Command {
  action: string;
  color?: string;
  enabled?: boolean;
}

/** Parse a :::command ... ::: block from the AI response. Returns { text, command }. */
export function parseCommandFromResponse(raw: string): {
  text: string;
  command: Command | null;
} {
  const match = raw.match(/:::command\s*\n?([\s\S]*?)\n?\s*:::/);
  if (!match) return { text: raw, command: null };

  const text = raw.replace(/:::command\s*\n?[\s\S]*?\n?\s*:::/g, "").trim();

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
    document.documentElement.style.setProperty("--background", command.color);
    setEffects((prev) => ({ ...prev, background: command.color! }));
  },

  changeAccent(command, setEffects) {
    if (!command.color) return;
    document.documentElement.style.setProperty("--accent", command.color);
    setEffects((prev) => ({ ...prev, accent: command.color! }));
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
