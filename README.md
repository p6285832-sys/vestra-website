# Vestra Finance

One-page marketing site for Vestra Finance — "Disciplined strategy. Long-term wealth."

## Stack

- **Next.js 16** (App Router, Turbopack, React 19)
- **TypeScript**
- **Tailwind CSS v4** (design tokens in `src/app/globals.css`)
- **Three.js + React Three Fiber** — the fixed ascent-line/particle canvas that runs behind the whole page (`src/components/AscentScene.tsx`, `AscentCanvas.tsx`)
- **GSAP + ScrollTrigger** — scroll-driven reveals, the progress line in "How It Works," and the canvas's scroll-linked camera/line progress
- **Lenis** — smooth scrolling, synced to the GSAP ticker
- **Motion** (installed, available for any additional micro-interactions)
- Self-hosted fonts via **Fontsource** (Archivo, Inter, JetBrains Mono) — no external font requests at runtime

All animation respects `prefers-reduced-motion`.

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Deploying

1. Push this repo to GitHub.
2. Import it into Vercel — it will auto-detect Next.js, no config needed.
3. Vercel will generate a preview URL on every push/PR. Once you're happy, promote to production and point your domain at it in the Vercel dashboard.

## Content still needed before launch

- Real contact email/phone in `src/components/CTA.tsx` and `src/components/Footer.tsx` (currently placeholders).
- Confirm the risk disclosure language in `src/components/Footer.tsx` and `src/components/WhatWeDo.tsx` with whoever handles compliance for the firm.
- Swap in real social/legal links if/when you have them.

## Project structure

```
src/
  app/
    layout.tsx       — fonts, metadata, root shell
    page.tsx          — assembles all sections
    globals.css        — design tokens (color, type, motion)
  components/
    AscentCanvas.tsx    — fixed Three.js canvas host + scroll wiring
    AscentScene.tsx      — particles, ascent line, camera rig
    SmoothScroll.tsx      — Lenis + GSAP ticker sync
    Reveal.tsx             — scroll-triggered fade/rise wrapper
    StatNumber.tsx           — animated count-up
    Nav.tsx, Hero.tsx, Philosophy.tsx, WhoWeServe.tsx,
    WhatWeDo.tsx, Advantage.tsx, HowItWorks.tsx, CTA.tsx, Footer.tsx
```
