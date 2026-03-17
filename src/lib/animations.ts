import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Creates a staggered fade-in animation for child elements
 */
export function staggerFadeIn(
  container: HTMLElement,
  selector: string,
  options: {
    y?: number;
    duration?: number;
    stagger?: number;
    start?: string;
  } = {}
): gsap.core.Timeline {
  const {
    y = 30,
    duration = 0.8,
    stagger = 0.1,
    start = "top 80%",
  } = options;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start,
      toggleActions: "play none none none",
    },
  });

  tl.fromTo(
    container.querySelectorAll(selector),
    { opacity: 0, y },
    { opacity: 1, y: 0, duration, stagger, ease: "power3.out" }
  );

  return tl;
}

/**
 * Creates a horizontal scroll pinned section
 */
export function horizontalScroll(
  container: HTMLElement,
  scrollElement: HTMLElement
): ScrollTrigger {
  const totalWidth = scrollElement.scrollWidth - window.innerWidth;

  gsap.to(scrollElement, {
    x: -totalWidth,
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      end: () => `+=${totalWidth}`,
      invalidateOnRefresh: true,
    },
  });

  return ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1];
}

/**
 * Creates a text reveal effect where words transition from dim to bright
 */
export function textReveal(
  container: HTMLElement,
  words: HTMLElement[]
): ScrollTrigger {
  gsap.set(words, { color: "#333333" });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start: "top center",
      end: "bottom center",
      scrub: 1,
      pin: true,
      pinSpacing: true,
    },
  });

  words.forEach((word, i) => {
    tl.to(
      word,
      {
        color: "#f5f5f5",
        duration: 1,
        ease: "none",
      },
      i * 0.5
    );
  });

  return tl.scrollTrigger!;
}

/**
 * Animates a number from 0 to its target value
 */
export function animateCounter(
  element: HTMLElement,
  target: number,
  suffix = "+"
): ScrollTrigger {
  const obj = { value: 0 };

  gsap.to(obj, {
    value: target,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: element,
      start: "top 80%",
      toggleActions: "play none none none",
    },
    onUpdate: () => {
      element.textContent = Math.round(obj.value) + suffix;
    },
  });

  return ScrollTrigger.getAll()[ScrollTrigger.getAll().length - 1];
}

/**
 * Applies a magnetic hover effect to an element
 */
export function magneticEffect(element: HTMLElement, strength = 0.3): () => void {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(element, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  element.addEventListener("mousemove", handleMouseMove);
  element.addEventListener("mouseleave", handleMouseLeave);

  return () => {
    element.removeEventListener("mousemove", handleMouseMove);
    element.removeEventListener("mouseleave", handleMouseLeave);
  };
}
