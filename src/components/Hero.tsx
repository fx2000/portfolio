"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { magneticEffect } from "@/lib/animations";
import { socialLinks } from "@/data/social";

/**
 * Full-viewport hero section with dramatic typography,
 * staggered word entrance animation, magnetic CTAs, and scroll indicator.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const btn1Ref = useRef<HTMLAnchorElement>(null);
  const btn2Ref = useRef<HTMLAnchorElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Name fades in
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Title words stagger in
      tl.fromTo(
        titleWordsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // CTAs slide up
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.2"
      );

      // Social links fade in
      tl.fromTo(
        socialRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.3"
      );

      // Scroll indicator
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6 },
        "-=0.2"
      );
    }, sectionRef);

    // Magnetic effect on buttons
    const cleanups: (() => void)[] = [];
    if (btn1Ref.current) cleanups.push(magneticEffect(btn1Ref.current, 0.2));
    if (btn2Ref.current) cleanups.push(magneticEffect(btn2Ref.current, 0.2));

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const titleText = "AI-Driven Leader & Developer";
  const titleWords = titleText.split(" ");

  /** Smooth scroll to contact section */
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Radial gradient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
        {/* Name */}
        <p
          ref={subtitleRef}
          className="text-sm md:text-base uppercase tracking-[0.3em] text-muted mb-6 md:mb-8 opacity-0"
        >
          Daniel Duque
        </p>

        {/* Title */}
        <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-bold leading-[1.15] tracking-tight mb-8 md:mb-12">
          {titleWords.map((word, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) titleWordsRef.current[i] = el;
              }}
              className="inline-block mr-[0.25em] text-gradient opacity-0"
            >
              {word}
            </span>
          ))}
        </h1>

        {/* CTAs */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 md:gap-6 opacity-0">
          <a
            ref={btn1Ref}
            href="#contact"
            onClick={scrollToContact}
            className="magnetic-btn px-8 py-3.5 bg-accent hover:bg-accent-light text-white text-sm font-medium rounded-full transition-colors duration-300 tracking-wide"
          >
            Get in touch
          </a>
          <a
            ref={btn2Ref}
            href="/files/DanielDuqueCV.pdf"
            download="DanielDuqueCV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-btn px-8 py-3.5 border border-white/20 hover:border-white/40 text-foreground text-sm font-medium rounded-full transition-all duration-300 tracking-wide hover:bg-white/5"
          >
            Download resume
          </a>
        </div>
      </div>

      {/* Social links - bottom left (hidden on small screens) */}
      <div
        ref={socialRef}
        className="hidden sm:flex absolute bottom-8 left-6 md:left-12 flex-col gap-4 opacity-0"
      >
        {socialLinks.map(({ platform, url, ariaLabel }) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={ariaLabel}
            className="text-xs uppercase tracking-[0.2em] text-muted hover:text-foreground transition-colors duration-300 [writing-mode:vertical-lr] rotate-180"
          >
            {platform}
          </a>
        ))}
      </div>

      {/* Scroll indicator - bottom center */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
          Scroll
        </span>
        <div className="scroll-indicator w-px h-8 bg-gradient-to-b from-muted to-transparent" />
      </div>
    </section>
  );
}
