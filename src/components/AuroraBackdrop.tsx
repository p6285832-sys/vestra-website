"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const BLOBS = [
  { color: "#3b82f6", top: "8%", left: "62%", size: 46, opacity: 0.3 },
  { color: "#93c5fd", top: "58%", left: "8%", size: 40, opacity: 0.2 },
  { color: "#ffffff", top: "22%", left: "18%", size: 30, opacity: 0.1 },
  { color: "#1d4ed8", top: "72%", left: "72%", size: 44, opacity: 0.26 },
];

export default function AuroraBackdrop() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const blobs = Array.from(root.children) as HTMLElement[];

    blobs.forEach((blob, i) => {
      const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 2.4 });
      tl.to(blob, {
        x: `+=${60 + i * 18}`,
        y: `+=${-40 - i * 12}`,
        scale: 1.15,
        duration: 22 + i * 6,
        ease: "sine.inOut",
      });
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink"
    >
      <div ref={rootRef} className="absolute inset-0">
        {BLOBS.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-[110px] will-change-transform"
            style={{
              backgroundColor: b.color,
              top: b.top,
              left: b.left,
              width: `${b.size}vw`,
              height: `${b.size}vw`,
              opacity: b.opacity,
              mixBlendMode: "screen",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-ink/35" />
    </div>
  );
}
