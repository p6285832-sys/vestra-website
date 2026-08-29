"use client";

import { useRef } from "react";
import gsap from "gsap";
import SplitWords from "./SplitWords";
import Magnetic from "./Magnetic";
import GrowthChart from "./GrowthChart";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

export default function Hero() {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLHeadingElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollCueRef = useRef<HTMLDivElement>(null);
  const chartWrapRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const words = [
      ...(line1Ref.current?.querySelectorAll<HTMLElement>(".split-word") ?? []),
      ...(line2Ref.current?.querySelectorAll<HTMLElement>(".split-word") ?? []),
    ];

    // Hide everything immediately and synchronously on mount — not just at
    // the moment the entrance animation starts. Otherwise the content sits
    // fully visible (just covered by the intro overlay) for the ~2.5s the
    // intro plays, then snaps to hidden the instant the entrance timeline
    // is created — that snap is what reads as a stutter/flash.
    gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
    gsap.set(words, { y: "110%", rotate: 4 });
    gsap.set(subRef.current, { opacity: 0, y: 16 });
    gsap.set(ctaRef.current, { opacity: 0, y: 16 });
    gsap.set(chartWrapRef.current, { opacity: 0, y: 24, scale: 0.97 });
    gsap.set(scrollCueRef.current, { opacity: 0 });

    const playEntrance = () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 })
        .to(
          words,
          { y: "0%", rotate: 0, duration: 1, stagger: 0.055 },
          "-=0.35"
        )
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.45")
        .to(
          chartWrapRef.current,
          { opacity: 1, y: 0, scale: 1, duration: 0.9 },
          "-=0.6"
        )
        .to(scrollCueRef.current, { opacity: 1, duration: 0.6 }, "-=0.2");
    };

    if ((window as unknown as { __vestraIntroDone?: boolean }).__vestraIntroDone) {
      playEntrance();
    } else {
      window.addEventListener("vestra:introDone", playEntrance, { once: true });
    }

    return () => window.removeEventListener("vestra:introDone", playEntrance);
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 md:px-10"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
        <div>
          <div
            ref={eyebrowRef}
            className="mb-6 flex items-center gap-3 font-mono-tight text-xs uppercase tracking-[0.25em] text-mist"
          >
            <span className="h-px w-8 bg-cobalt" />
            Capital Management &mdash; Est. Discipline
          </div>

          <h1
            ref={line1Ref}
            className="font-display text-[12vw] leading-[0.95] font-semibold tracking-tight text-paper sm:text-[8vw] md:text-[4.6vw] lg:text-[4.2vw]"
          >
            <SplitWords text="Disciplined strategy." />
            <span ref={line2Ref} className="block text-cobalt">
              <SplitWords text="Long-term wealth." />
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-8 max-w-xl text-balance text-lg leading-relaxed text-silver/90 md:text-xl"
          >
            Vestra draws from the Latin word for &ldquo;yours.&rdquo; This is
            your wealth, your plan, your future &mdash; we bring
            professional, risk-managed strategy to what is already yours.
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-5">
            <Magnetic>
              <a
                href="#contact"
                className="inline-block rounded-sm border border-cobalt bg-cobalt px-8 py-4 font-mono-tight text-xs uppercase tracking-widest text-ink font-semibold transition-all duration-300 hover:bg-transparent hover:text-cobalt shadow-lg shadow-cobalt/25"
              >
                Start a conversation
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="#what-we-do"
                className="inline-block font-mono-tight text-xs uppercase tracking-widest text-silver/80 underline decoration-hairline-strong underline-offset-8 transition-colors hover:text-cobalt"
              >
                See how it works
              </a>
            </Magnetic>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-hairline pt-6 text-mist font-mono-tight text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Target 18–24% APR</span>
            </div>
            <span className="text-hairline-strong">&bull;</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cobalt" />
              <span>Monthly Distribution</span>
            </div>
            <span className="text-hairline-strong">&bull;</span>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-ascent" />
              <span>Capital Preservation Priority</span>
            </div>
          </div>
        </div>

        <div ref={chartWrapRef} className="relative mt-6 md:mt-0">
          <div className="rounded-xl border border-hairline bg-panel-glass p-6 backdrop-blur-md shadow-2xl shadow-black/80 md:p-8">
            <div className="mb-6 flex items-center justify-between font-mono-tight text-[11px] uppercase tracking-widest text-mist">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cobalt" />
                <span>Illustrative Performance</span>
              </div>
              <span className="rounded bg-cobalt/15 px-2 py-0.5 text-ascent-bright border border-cobalt/30">
                Vestra Composite
              </span>
            </div>
            <GrowthChart />
          </div>
        </div>
      </div>

      <div
        ref={scrollCueRef}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex opacity-70 hover:opacity-100 transition-opacity"
      >
        <span className="font-mono-tight text-[10px] uppercase tracking-[0.3em] text-mist">
          Scroll to explore
        </span>
        <span className="h-8 w-px bg-gradient-to-b from-cobalt to-transparent" />
      </div>
    </section>
  );
}
