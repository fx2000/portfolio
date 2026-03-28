import { socialLinks } from "@/data/social";

/**
 * Minimal footer with credits and social icon links.
 */
export default function Footer() {
  return (
    <footer className="py-8 px-6 md:px-12 bg-background border-t border-foreground/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} Daniel Duque. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          {socialLinks.map(({ platform, url, ariaLabel }) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className="text-xs text-muted hover:text-foreground transition-colors duration-300 uppercase tracking-wider"
            >
              {platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
