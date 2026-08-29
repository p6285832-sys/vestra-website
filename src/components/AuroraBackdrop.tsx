"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const BLOBS = [
  // Top-right — cobalt anchor
  { color: "#3b82f6", top: "8%",  left: "62%", size: 46, opacity: 0.30, rotation:  10 },
  // Mid-left — silver-blue counter-balance
  { color: "#93c5fd", top: "58%", left: "8%",  size: 40, opacity: 0.20, rotation: -8  },
  // Top-left — cobalt-light (replaces barely-visible white blob)
  { color: "#60a5fa", top: "20%", left: "14%", size: 32, opacity: 0.18, rotation:  6  },
  // Bottom-right — deep navy
  { color: "#1d4ed8", top: "72%", left: "72%", size: 44, opacity: 0.26, rotation: -12 },
  // Bottom-center — deep indigo depth layer (new, very subtle)
  { color: "#312e81", top: "80%", left: "38%", size: 55, opacity: 0.15, rotation:  5  },
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
      const b = BLOBS[i];
      // Durations staggered dramatically [18–34s] so blobs feel independent
      const duration = 18 + i * 4;
      const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: i * 2.0 });
      tl.to(blob, {
        x: `+=${55 + i * 15}`,
        y: `+=${-38 - i * 10}`,
        scale: 1.18,
        rotation: b.rotation,
        duration,
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
