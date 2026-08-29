"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Reveal from "./Reveal";

const STEPS = [
  {
    n: "01",
    label: "Capital Integration",
    body: "Your funds are seamlessly integrated into our secure, risk-managed trading framework.",
  },
  {
    n: "02",
    label: "Deploy Strategy",
    body: "We actively apply disciplined market strategies, designed to capture steady, long-term opportunities while managing risk.",
  },
  {
    n: "03",
    label: "Generate & Distribute",
    body: "We focus on executing our strategy to meet monthly targets, distributing regular payouts directly to you.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !sectionRef.current || !progressRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-ink/30 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="font-mono-tight text-xs uppercase tracking-[0.25em] text-mist">
            <span className="mr-3 text-cobalt">&mdash;</span>
            How It Works
          </div>
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight text-paper md:text-4xl lg:text-5xl">
            Investing, made straightforward.
          </h2>
        </Reveal>

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-[22px] hidden h-px bg-hairline-strong md:block" />
          <div
            ref={progressRef}
            className="absolute left-0 right-0 top-[22px] hidden h-px origin-left bg-cobalt md:block shadow-sm shadow-cobalt"
          />

          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="rounded-xl border border-hairline bg-panel-glass p-8 backdrop-blur-sm transition-all duration-300 hover:border-cobalt/40">
                  <div className="relative z-10 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-cobalt/70 bg-ink font-mono-tight text-sm font-bold text-cobalt shadow-md shadow-cobalt/20">
                      {step.n}
                    </span>
                    <span className="h-px flex-1 bg-hairline md:hidden" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-paper">
                    {step.label}
                  </h3>
                  <p className="mt-3 leading-relaxed text-silver/85 text-sm md:text-base">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
