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
      // Reduced from 38rem → 32rem: smaller compositing rect, same coverage feel.
      // mix-blend-screen works better on dark backgrounds than soft-light and is cheaper.
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 mix-blend-screen"
      style={{
        background:
          // Inner opacity raised 0.16→0.22, gradient extended to 100% for smooth fade
          "radial-gradient(circle, rgba(51,102,255,0.22) 0%, rgba(51,102,255,0.09) 50%, rgba(51,102,255,0.02) 80%, transparent 100%)",
      }}
    />
  );
}
