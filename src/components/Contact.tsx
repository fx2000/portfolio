"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { socialLinks } from "@/data/social";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Contact section with Netlify-compatible form, social links,
 * and resume download CTA.
 */
export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!contentRef.current) return;

      gsap.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /** Handles Netlify form submission via fetch */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
      setSubmitted(true);
      form.reset();
    } catch {
      // Silently fail - Netlify handles errors
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-24 md:py-32 bg-surface px-6 md:px-12"
    >
      <div ref={contentRef} className="max-w-6xl mx-auto">
        {/* Headline */}
        <div className="mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            Contact
          </p>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gradient">
            Let&apos;s work
            <br />
            together.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: info */}
          <div className="space-y-8">
            <p className="text-lg text-foreground/80 leading-relaxed max-w-md">
              Looking for a tech leader who can ship AI-powered products and
              own the full lifecycle from strategy to delivery? Let&apos;s talk.
            </p>

            {/* Social links */}
            <div className="space-y-3">
              {socialLinks.map(({ platform, url, ariaLabel }) => (
                <a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  className="group flex items-center gap-3 text-muted hover:text-foreground transition-colors duration-300"
                >
                  <span className="w-8 h-px bg-muted group-hover:bg-accent group-hover:w-12 transition-all duration-300" />
                  <span className="text-sm tracking-wide">{platform}</span>
                </a>
              ))}
            </div>

            {/* Resume download */}
            <a
              href="/files/DanielDuqueCV.pdf"
              download="DanielDuqueCV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors duration-300"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 2v9M4 8l4 4 4-4M2 14h12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download my resume
            </a>

            <p className="text-xs text-muted/60">
              Your privacy is important to me. Your data will not be shared.
            </p>
          </div>

          {/* Right: form */}
          <div aria-live="polite">
            {submitted ? (
              <div className="h-full flex items-center">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 10l4 4 8-8"
                        stroke="var(--color-accent)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold">Message sent!</h3>
                  <p className="text-muted">
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                </div>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don&apos;t fill this out: <input name="bot-field" />
                  </label>
                </p>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-[0.15em] text-muted mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full bg-transparent border-b border-white/10 focus:border-accent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-dim"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-[0.15em] text-muted mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full bg-transparent border-b border-white/10 focus:border-accent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-dim"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-[0.15em] text-muted mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-transparent border-b border-white/10 focus:border-accent py-3 text-foreground outline-none transition-colors duration-300 placeholder:text-dim resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="magnetic-btn px-8 py-3.5 bg-accent hover:bg-accent-light text-white text-sm font-semibold rounded-full transition-colors duration-300 tracking-wide"
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
