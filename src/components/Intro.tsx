"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

export default function Intro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const markDone = () => {
      (window as unknown as { __vestraIntroDone?: boolean }).__vestraIntroDone = true;
      window.dispatchEvent(new CustomEvent("vestra:introDone"));
      overlay.style.display = "none";
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      markDone();
      return;
    }

    document.body.style.overflow = "hidden";

    // Set hidden state immediately and synchronously (not queued inside the
    // timeline) so there is no frame where the logo flashes at full opacity
    // before the animation takes over.
    gsap.set(logoRef.current, { opacity: 0, scale: 0.88 });
    gsap.set(lineRef.current, { scaleX: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        markDone();
      },
    });

    tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
      })
      .to(
        lineRef.current,
        { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
        "-=0.3"
      )
      .to({}, { duration: 0.35 }) // hold
      .to(logoRef.current, {
        opacity: 0,
        scale: 1.04,
        duration: 0.5,
        ease: "power2.in",
      })
      .to(
        overlay,
        { yPercent: -100, duration: 0.8, ease: "power4.inOut" },
        "-=0.15"
      );

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <div ref={logoRef} className="w-56 rounded-xl bg-paper px-7 py-6 opacity-0 shadow-2xl shadow-black/80 ring-1 ring-white/20 sm:w-64">
        <Image
          src="/logo/vestra-logo.png"
          alt="Vestra Finance"
          width={2848}
          height={1395}
          priority
          className="h-auto w-full"
        />
      </div>
      <div
        ref={lineRef}
        className="mt-6 h-0.5 w-40 origin-center scale-x-0 bg-cobalt sm:w-48 shadow-sm shadow-cobalt"
      />
    </div>
  );
}
