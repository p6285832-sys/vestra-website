"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

// A deliberately realistic path: general ascent with real pullbacks, not a
// straight diagonal — reads as disciplined performance, not a hockey stick.
const PATH_D =
  "M4,238 L40,214 L74,232 L108,178 L146,196 L182,146 L214,164 L252,108 L292,128 L330,80 L366,96 L402,48 L440,64 L476,20";

const GRID_Y = [20, 68, 116, 164, 212, 260];

export default function GrowthChart({ className = "" }: { className?: string }) {
  const pathRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set([path, areaRef.current], { opacity: 1 });
      gsap.set(path, { strokeDashoffset: 0 });
      gsap.set(markerRef.current, { opacity: 1, scale: 1 });
      gsap.set(labelRef.current, { opacity: 1, y: 0 });
      return;
    }

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    gsap.set(areaRef.current, { opacity: 0 });
    gsap.set(markerRef.current, { opacity: 0, scale: 0.6, transformOrigin: "center" });
    gsap.set(labelRef.current, { opacity: 0, y: 8 });

    const gridLines = gridRef.current
      ? Array.from(gridRef.current.children)
      : [];
    gsap.set(gridLines, { scaleX: 0, transformOrigin: "left center" });

    const playDraw = () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(gridLines, { scaleX: 1, duration: 0.8, stagger: 0.06 })
        .to(
          path,
          { strokeDashoffset: 0, duration: 1.9, ease: "power2.inOut" },
          "-=0.3"
        )
        .to(areaRef.current, { opacity: 1, duration: 0.8 }, "-=0.8")
        .to(
          markerRef.current,
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2.4)" },
          "-=0.15"
        )
        .to(labelRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");

      // Gentle, permanent "live" pulse on the marker — a heartbeat, not a blob.
      gsap.to(markerRef.current, {
        scale: 1.15,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2.2,
        transformOrigin: "center",
      });
    };

    if ((window as unknown as { __vestraIntroDone?: boolean }).__vestraIntroDone) {
      playDraw();
    } else {
      window.addEventListener("vestra:introDone", playDraw, { once: true });
    }

    return () => window.removeEventListener("vestra:introDone", playDraw);
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <svg
        viewBox="0 0 480 280"
        className="h-auto w-full overflow-visible"
        fill="none"
      >
        <defs>
          <linearGradient id="vestra-line-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8290a5" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#93c5fd" />
          </linearGradient>
          <linearGradient id="vestra-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Instrument grid */}
        <g ref={gridRef}>
          {GRID_Y.map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="480"
              y2={y}
              stroke="var(--color-hairline)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </g>

        {/* Area fill beneath the line */}
        <path
          ref={areaRef}
          d={`${PATH_D} L476,280 L4,280 Z`}
          fill="url(#vestra-area-gradient)"
        />

        {/* The ascent line itself */}
        <path
          ref={pathRef}
          d={PATH_D}
          stroke="url(#vestra-line-gradient)"
          strokeWidth="2.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Live marker at the current head */}
        <g ref={markerRef} transform="translate(476, 20)">
          <circle r="12" fill="#3b82f6" fillOpacity="0.2" />
          <circle r="6" fill="#3b82f6" fillOpacity="0.6" />
          <circle r="3.5" fill="#ffffff" />
        </g>
      </svg>

      <div
        ref={labelRef}
        className="absolute -top-4 right-0 font-mono-tight text-xs uppercase tracking-widest text-cobalt sm:right-2 font-medium"
      >
        Target 18–24%*
      </div>
    </div>
  );
}
