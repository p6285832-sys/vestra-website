"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type StatNumberProps = {
  from?: number;
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
};

export default function StatNumber({
  from = 0,
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: StatNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!ref.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      ref.current.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`;
      return;
    }

    const counter = { val: from };
    const el = ref.current;

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        val: to,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        onUpdate: () => {
          el.textContent = `${prefix}${counter.val.toFixed(decimals)}${suffix}`;
        },
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {from.toFixed(decimals)}
      {suffix}
    </span>
  );
}
