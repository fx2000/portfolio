"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ABOUT_PHRASES = [
  "Building and shipping products, from RAG-driven conversational agents and LLM pipelines to AI-assisted engineering workflows that measurably accelerate team output.",
  "Leading engineering teams across startups, AI labs, and enterprise, owning architectural direction, defining platform APIs, and aligning technical execution with product and business goals.",
  "Driving product ownership end-to-end: from founding technology ventures and shaping product strategy",
  "to defining roadmaps, running performance reviews, and delivering user-facing platforms at scale.",
];

/** Tech names that vary across project entries mapped to their canonical form */
const NORMALIZE: Record<string, string> = {
  Typescript: "TypeScript",
  Javascript: "JavaScript",
  NextJS: "Next.js",
  NodeJS: "Node.js",
  "React-Query": "React Query",
  zustand: "Zustand",
};

/** Non-technical entries that should not appear as skill pills */
const NON_TECH = new Set(["Team Management", "Client Communication", "SSO"]);

const BASE_SKILLS = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "FastAPI",
  "RAG",
  "LLMs",
  "Cursor",
  "Claude",
  "AWS",
];

const skillsSet = new Set<string>(BASE_SKILLS);
projects.forEach((p) =>
  p.technologies.forEach((t) => {
    const normalized = NORMALIZE[t] ?? t;
    if (!NON_TECH.has(normalized)) skillsSet.add(normalized);
  })
);

const ALL_SKILLS = [...skillsSet];


/**
 * About section with scroll-pinned text reveal effect.
 * Words transition from dim gray to bright white as the user scrolls,
 * inspired by Apple's AirPods Pro page.
 */
export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    // Desktop: pinned scroll reveal (skip when reduced motion is preferred)
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      const phrases = textRef.current?.querySelectorAll(".phrase");
      if (!phrases) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${phrases.length * 100}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      phrases.forEach((phrase, i) => {
        tl.to(
          phrase,
          { color: "#f5f5f5", duration: 1, ease: "none" },
          i * 0.6
        );
      });
    });

    // Mobile: simple scroll-based reveal without pinning (skip when reduced motion is preferred)
    mm.add("(prefers-reduced-motion: no-preference) and (max-width: 767px)", () => {
      const phrases = textRef.current?.querySelectorAll(".phrase");
      if (!phrases) return;

      phrases.forEach((phrase) => {
        gsap.to(phrase, {
          color: "#f5f5f5",
          duration: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: phrase,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    });

    // Reduced motion: show final state immediately
    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (counterRef.current) counterRef.current.textContent = "15+";
    });

    // Counter animation (both mobile and desktop, only when motion is OK)
    if (counterRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const obj = { value: 0 };
      gsap.to(obj, {
        value: 15,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: counterRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.round(obj.value) + "+";
          }
        },
      });
    }

    // Skills pills stagger in (only when motion is OK)
    if (skillsRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const pills = skillsRef.current.querySelectorAll(".skill-pill");
      gsap.fromTo(
        pills,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: {
            trigger: skillsRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="min-h-screen flex items-center bg-background"
      aria-labelledby="about-heading"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-20 w-full">
        {/* Section label */}
        <div className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            About
          </p>
          <div className="flex items-baseline gap-4 md:gap-8 mb-8">
            <span
              ref={counterRef}
              className="text-6xl md:text-8xl font-bold text-gradient"
            >
              0+
            </span>
            <span className="text-lg md:text-xl text-muted">
              Years of Experience
            </span>
          </div>
        </div>

        {/* Scroll-revealing text */}
        <div ref={textRef} className="mb-16 md:mb-20">
          <h2 id="about-heading" className="sr-only">
            About Daniel Duque
          </h2>
          <p className="text-2xl md:text-4xl lg:text-5xl font-medium leading-snug tracking-tight">
            {ABOUT_PHRASES.map((phrase, i) => (
              <span
                key={i}
                className="phrase transition-colors duration-100"
                style={{ color: "#333333" }}
              >
                {phrase}{" "}
              </span>
            ))}
          </p>
        </div>

        {/* Skills pills */}
        <div ref={skillsRef} className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => (
            <span
              key={skill}
              className="skill-pill px-3 py-1 rounded-full border border-white/10 text-xs text-muted hover:text-foreground hover:border-white/30 transition-all duration-300 opacity-0"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
