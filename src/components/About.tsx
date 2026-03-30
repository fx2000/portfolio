"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/data/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ABOUT_TEXT =
  "Building and shipping products, from RAG-driven conversational agents and LLM pipelines to AI-assisted engineering workflows that measurably accelerate team output. Leading engineering teams across startups, AI labs, and enterprise, owning architectural direction, defining platform APIs, and aligning technical execution with product and business goals. Driving product ownership end-to-end: from founding technology ventures and shaping product strategy to defining roadmaps, running performance reviews, and delivering user-facing platforms at scale.";

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

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Counter animation
      if (counterRef.current) {
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

      // Skills pills stagger
      if (skillsRef.current) {
        const pills = skillsRef.current.querySelectorAll(".skill-pill");
        gsap.fromTo(
          pills,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.03,
            ease: "power3.out",
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    // Reduced motion: show final state
    mm.add("(prefers-reduced-motion: reduce)", () => {
      if (counterRef.current) counterRef.current.textContent = "15+";
      const pills = skillsRef.current?.querySelectorAll<HTMLElement>(".skill-pill");
      pills?.forEach((p) => (p.style.opacity = "1"));
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bg-background py-24 md:py-32"
      aria-labelledby="about-heading"
    >
      <div className="max-w-5xl mx-auto px-6 md:px-12 w-full">
        <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
          About
        </p>
        <h2 id="about-heading" className="sr-only">
          About Daniel Duque
        </h2>
        <div className="mb-16 md:mb-20">
          <p className="text-lg md:text-xl text-muted leading-relaxed">
            <span
              ref={counterRef}
              className="text-6xl md:text-8xl font-bold text-gradient align-baseline"
            >
              15+
            </span>{" "}
            Years of Experience. {ABOUT_TEXT}
          </p>
        </div>

        {/* Skills pills */}
        <div ref={skillsRef} className="flex flex-wrap gap-2">
          {ALL_SKILLS.map((skill) => (
            <span
              key={skill}
              className="skill-pill px-3 py-1 rounded-full border border-foreground/10 text-xs text-muted hover:text-foreground hover:border-foreground/30 transition-all duration-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
