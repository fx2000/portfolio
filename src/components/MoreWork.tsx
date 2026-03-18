"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getOtherProjects } from "@/data/projects";
import { Project } from "@/types";
import { useFocusTrap } from "@/hooks/useFocusTrap";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const otherProjects = getOtherProjects();

/**
 * Compact grid of remaining projects with hover glow cards
 * and an expandable detail modal.
 */
export default function MoreWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  useFocusTrap(modalRef, !!selected);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!gridRef.current) return;

      const cards = gridRef.current.querySelectorAll(".work-card");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    if (selected) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKey);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-surface px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            More Work
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient">
            Additional Projects
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {otherProjects.map((project) => (
            <button
              key={project.id}
              className="work-card card-glow group text-left rounded-2xl bg-surface-light p-6 transition-all duration-400 hover:-translate-y-1 cursor-pointer opacity-0"
              onClick={() => setSelected(project)}
            >
              <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-5 bg-background">
                <Image
                  src={project.pImg}
                  alt={project.pImgAlt}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>

              <p className="text-xs uppercase tracking-[0.15em] text-accent mb-1.5">
                {project.type === "company"
                  ? project.company
                  : `${project.company} → ${project.client}`}
              </p>
              <h3 className="text-lg font-semibold mb-1 group-hover:text-foreground transition-colors">
                {project.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {project.role}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelected(null)}
            aria-hidden="true"
          />

          {/* Modal content */}
          <div className="relative bg-surface-light rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto border border-white/5">
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Image */}
            <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
              <Image
                src={selected.pImg}
                alt={selected.pImgAlt}
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-light to-transparent" />
            </div>

            <div className="p-6 md:p-8 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-accent mb-2">
                  {selected.type === "company"
                    ? selected.company
                    : `${selected.company} → ${selected.client}`}
                </p>
                <h3
                  id="modal-title"
                  className="text-2xl md:text-3xl font-bold"
                >
                  {selected.title}
                </h3>
                <p className="text-sm text-muted mt-1">{selected.role}</p>
              </div>

              <p className="text-foreground/80 leading-relaxed">
                {selected.about}
              </p>

              <p className="text-foreground/70 leading-relaxed">
                {selected.contributions}
              </p>

              <div className="flex flex-wrap gap-2">
                {selected.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit project: ${selected.title}`}
                className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors duration-300"
              >
                Visit project
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 7h12M8 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
