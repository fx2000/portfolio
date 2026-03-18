"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { testimonials } from "@/data/testimonials";
import { Testimonial } from "@/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Split testimonials into two rows
const row1 = testimonials.slice(0, 3);
const row2 = testimonials.slice(3);

/**
 * Testimonials section with dual-row auto-scrolling marquee.
 * Rows scroll in opposite directions and pause on hover.
 */
export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-24 md:py-32 bg-background overflow-hidden"
    >
      <div ref={headerRef} className="px-6 md:px-12 mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
          What People Say
        </h2>
      </div>

      {/* Row 1 - scrolls left */}
      <MarqueeRow items={row1} direction="left" />

      {/* Row 2 - scrolls right */}
      <div className="mt-6">
        <MarqueeRow items={row2} direction="right" />
      </div>
    </section>
  );
}

/** Renders an infinite scrolling row of testimonial cards */
function MarqueeRow({
  items,
  direction,
}: {
  items: typeof testimonials;
  direction: "left" | "right";
}) {
  const duplicated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative">
      <div
        className={`flex gap-6 ${
          direction === "left" ? "marquee-left" : "marquee-right"
        }`}
        style={{ width: "max-content" }}
      >
        {duplicated.map((t, i) => (
          <div
            key={`${t.id}-${i}`}
            className="w-[300px] sm:w-[400px] md:w-[500px] shrink-0 p-5 sm:p-6 md:p-8 rounded-2xl bg-surface-light border border-white/5 hover:border-white/10 transition-colors duration-300"
            aria-hidden={i >= items.length ? true : undefined}
          >
            <blockquote>
              <p className="text-sm md:text-base text-foreground/80 leading-relaxed italic mb-6 line-clamp-5">
                &ldquo;{t.description}&rdquo;
              </p>
              <footer className="flex items-center gap-3">
                <div>
                  {t.linkedin ? (
                    <a
                      href={t.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={i >= items.length ? -1 : undefined}
                      className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors duration-300"
                    >
                      {t.name}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="opacity-100 text-accent shrink-0"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-foreground">
                      {t.name}
                    </p>
                  )}
                  <p className="text-xs text-muted">
                    {t.position}, {t.company}
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        ))}
      </div>
    </div>
  );
}

// Avatar component removed per design: testimonials now display name, role, company, and a persistent LinkedIn icon when available.
