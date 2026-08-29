"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarsePointer) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    gsap.set(el, { x: window.innerWidth / 2, y: window.innerHeight / 2, opacity: 0 });
    gsap.to(el, { opacity: 1, duration: 1, delay: 0.5 });

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 mix-blend-soft-light"
      style={{
        background:
          "radial-gradient(circle, rgba(51,102,255,0.16) 0%, rgba(51,102,255,0.06) 45%, transparent 70%)",
      }}
    />
  );
}
