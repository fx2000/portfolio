"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getFeaturedProjects } from "@/data/projects";
import AudioPlayer from "@/components/AudioPlayer";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const featured = getFeaturedProjects();

/**
 * Featured projects displayed as vertically stacked cards with
 * alternating image/text layout and scroll-triggered animations.
 */
export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cleanupClickHandlers: (() => void)[] = [];

    const ctx = gsap.context(() => {
      // Header entrance
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

      // Each card animates in on scroll
      cardsRef.current.forEach((card) => {
        if (!card) return;

        const image = card.querySelector(".project-image-wrap");
        const details = card.querySelector(".project-details");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        if (image) {
          tl.fromTo(
            image,
            { opacity: 0, y: 40, scale: 0.97 },
            { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "power3.out" },
            0
          );
        }

        if (details) {
          tl.fromTo(
            details,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
            0.15
          );
        }

        // Mobile: tap to cycle which stacked image is on top
        const imageButtons = Array.from(
          card.querySelectorAll<HTMLButtonElement>(".project-image-card")
        );

        if (imageButtons.length > 1) {
          let activeIdx = 0;

          const updateZ = () => {
            imageButtons.forEach((btn, idx) => {
              const baseZ = 10 + idx;
              btn.style.zIndex = idx === activeIdx ? "50" : String(baseZ);
            });
          };

          updateZ();

          imageButtons.forEach((btn) => {
            const clickHandler = () => {
              if (window.matchMedia("(min-width: 768px)").matches) return;
              activeIdx = (activeIdx + 1) % imageButtons.length;
              updateZ();
            };

            // Mobile tap behavior
            btn.addEventListener("click", clickHandler);
            cleanupClickHandlers.push(() =>
              btn.removeEventListener("click", clickHandler)
            );

            // Desktop: hover should bring hovered image to the front
            const mouseEnterHandler = () => {
              if (!window.matchMedia("(min-width: 768px)").matches) return;

              imageButtons.forEach((otherBtn, idx) => {
                const baseZ = 10 + idx;
                otherBtn.style.zIndex =
                  otherBtn === btn ? "50" : String(baseZ);
              });
            };

            const mouseLeaveHandler = () => {
              if (!window.matchMedia("(min-width: 768px)").matches) return;
              updateZ();
            };

            btn.addEventListener("mouseenter", mouseEnterHandler);
            btn.addEventListener("mouseleave", mouseLeaveHandler);

            cleanupClickHandlers.push(() => {
              btn.removeEventListener("mouseenter", mouseEnterHandler);
              btn.removeEventListener("mouseleave", mouseLeaveHandler);
            });
          });
        }
      });
    }, sectionRef);

    return () => {
      cleanupClickHandlers.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="py-24 md:py-32 bg-background px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={headerRef} className="mb-16 md:mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">
            Selected Work
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient">
            Featured Projects
          </h2>
        </div>

        {/* Project cards */}
        <div className="space-y-20 md:space-y-28">
          {featured.map((project, idx) => {
            const isReversed = idx % 2 !== 0;

            const imageStack = [
              {
                src: project.pImg,
                alt: project.pImgAlt || project.title,
              },
              ...(project.psub1img1
                ? [
                    {
                      src: project.psub1img1,
                      alt: project.psub1img1Alt || project.title,
                    },
                  ]
                : []),
              ...(project.psub1img2
                ? [
                    {
                      src: project.psub1img2,
                      alt: project.psub1img2Alt || project.title,
                    },
                  ]
                : []),
            ].slice(0, 3);

            const baseTransforms = [
              // First card: on mobile sits at the top, desktop leans left
              "translate-y-0 md:-rotate-8 md:-translate-x-6 md:translate-y-2",
              // Second card: tighter on mobile for more overlap, minimal offset on desktop
              "translate-y-2 md:translate-y-1",
              // Third card: tighter on mobile for more overlap, leans right on desktop
              "translate-y-4 md:rotate-8 md:translate-x-6 md:translate-y-4",
            ];

            const baseZClasses = ["z-30", "z-20", "z-10"];

            // Special layout for AI Portfolio: image + text side by side, diagram full-width below
            if (project.title === "AI Portfolio") {
              return (
                <div
                  key={project.id}
                  data-project-title={project.title}
                  ref={(el) => {
                    if (el) cardsRef.current[idx] = el;
                  }}
                  className="relative"
                >
                  {/* Top: details + image side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
                    {/* Details */}
                    <div className="project-details relative space-y-4 order-2 lg:order-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-accent">
                        {project.company}
                      </p>
                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted">{project.role}</p>
                      <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                        {project.contributions}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit project: ${project.title}`}
                        className="group inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors duration-300 pt-1"
                      >
                        Visit project
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </a>
                    </div>

                    {/* Image */}
                    <div className="project-image-wrap relative z-20 aspect-[16/10] lg:aspect-[4/3] pointer-events-none order-1 lg:order-2">
                      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-light pointer-events-auto">
                        <Image
                          src={project.pImg}
                          alt={project.pImgAlt || project.title}
                          fill
                          className="object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Full-width architecture diagram below */}
                  <div className="mt-10">
                    <ArchitectureDiagram />
                  </div>
                </div>
              );
            }

            return (
              <div
                key={project.id}
                data-project-title={project.title}
                ref={(el) => {
                  if (el) cardsRef.current[idx] = el;
                }}
                className={`relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center ${
                  isReversed ? "lg:[direction:rtl]" : ""
                }`}
              >
                {/* Image stack */}
                <div
                  className={`project-image-wrap relative z-20 aspect-[16/10] lg:aspect-[4/3] ${
                    isReversed ? "lg:[direction:ltr]" : ""
                  } group/image-stack pointer-events-none`}
                >
                  {/* Fallback single image if no stack */}
                  {imageStack.length === 1 && (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-light pointer-events-auto">
                      <Image
                        src={imageStack[0].src}
                        alt={imageStack[0].alt}
                        fill
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover/image-stack:scale-[1.03]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    </div>
                  )}

                  {/* Multiple images: overlapping stack */}
                  {imageStack.length > 1 &&
                    imageStack.map((img, imageIdx) => (
                      <button
                        key={`${img.src}-${imageIdx}`}
                        type="button"
                        className={`project-image-card absolute inset-0 origin-center transition-all duration-500 ease-out pointer-events-auto focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                          baseTransforms[imageIdx] || ""
                        } ${baseZClasses[imageIdx] || "z-10"} hover:scale-115 hover:-translate-y-8 hover:rotate-0 focus-visible:scale-115 focus-visible:-translate-y-8 focus-visible:rotate-0`}
                        aria-label={img.alt}
                      >
                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface-light shadow-xl border border-white/10">
                          <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover object-top will-change-transform"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                        </div>
                      </button>
                    ))}
                </div>

                {/* Details */}
                <div
                  className={`project-details relative space-y-4 ${
                    isReversed ? "lg:[direction:ltr]" : ""
                  }`}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-accent">
                    {project.type === "company"
                      ? project.company
                      : `${project.company} → ${project.client}`}
                  </p>

                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                    {project.title}
                  </h3>

                  <p className="text-sm text-muted">{project.role}</p>

                  <p className="text-sm md:text-base text-foreground/75 leading-relaxed">
                    {project.contributions}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Audio demo for Magic */}
                  {project.media && (
                    <AudioPlayer
                      src={project.media.url}
                      type={project.media.type}
                      title={project.media.title}
                    />
                  )}

                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit project: ${project.title}`}
                    className="group inline-flex items-center gap-2 text-sm text-accent hover:text-accent-light transition-colors duration-300 pt-1"
                  >
                    Visit project
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1"
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
