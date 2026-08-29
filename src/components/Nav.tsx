"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Magnetic from "./Magnetic";

const LINKS = [
  { href: "#philosophy", label: "Philosophy" },
  { href: "#what-we-do", label: "What We Do" },
  { href: "#advantage", label: "Advantage" },
  { href: "#how-it-works", label: "How It Works" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ink/80 backdrop-blur-md border-b border-hairline py-3 shadow-lg shadow-black/40"
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-10">
          <a
            href="#top"
            className="group flex items-center gap-3 rounded-lg bg-paper px-3.5 py-2 shadow-md shadow-black/40 ring-1 ring-white/20 transition-all duration-300 hover:ring-cobalt/60 hover:shadow-cobalt/20"
          >
            <Image
              src="/logo/vestra-logo.png"
              alt="Vestra Finance"
              width={140}
              height={70}
              priority
              className="h-7 w-auto md:h-8 transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </a>

          {/* Desktop Nav */}
          <ul className="hidden items-center gap-8 lg:gap-10 md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative font-mono-tight text-xs uppercase tracking-widest text-silver/80 transition-colors hover:text-paper py-1"
                >
                  <span>{link.label}</span>
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-cobalt transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <Magnetic strength={0.3}>
              <a
                href="#contact"
                className="group relative block overflow-hidden rounded-sm border border-cobalt/70 bg-cobalt/10 px-5 py-2.5 font-mono-tight text-xs uppercase tracking-widest text-paper shadow-sm transition-all duration-300 hover:border-cobalt hover:bg-cobalt hover:text-ink hover:shadow-md hover:shadow-cobalt/25"
              >
                <span className="relative z-10 font-semibold">Talk to us</span>
              </a>
            </Magnetic>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-sm border border-hairline-strong bg-panel/70 p-2 text-paper md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`h-0.5 w-5 bg-paper transition-transform duration-300 ${
                mobileMenuOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-paper transition-opacity duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-5 bg-paper transition-transform duration-300 ${
                mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex min-h-screen flex-col justify-between px-8 pt-28 pb-12">
          <ul className="flex flex-col gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display text-2xl font-medium tracking-tight text-silver transition-colors hover:text-cobalt"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 border-t border-hairline pt-8">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full border border-cobalt bg-cobalt py-3.5 text-center font-mono-tight text-xs uppercase tracking-widest text-ink font-semibold"
            >
              Start a Conversation
            </a>
            <p className="font-mono-tight text-[11px] uppercase tracking-widest text-mist text-center">
              hello@vestrafinance.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

