import Image from "next/image";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";

export default function CTA() {
  return (
    <section
      id="contact"
      className="relative bg-ink/20 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <div className="mx-auto mb-8 inline-block rounded-xl bg-paper px-6 py-3.5 shadow-xl shadow-black/60 ring-1 ring-white/20">
            <Image
              src="/logo/vestra-logo.png"
              alt="Vestra Finance"
              width={168}
              height={82}
              className="h-10 w-auto"
            />
          </div>
          <div className="mx-auto mb-6 flex w-fit items-center gap-3 font-mono-tight text-xs uppercase tracking-[0.25em] text-mist">
            <span className="h-px w-8 bg-cobalt" />
            Get Started
            <span className="h-px w-8 bg-cobalt" />
          </div>
          <h2 className="font-display text-4xl font-semibold leading-tight text-paper md:text-5xl lg:text-6xl">
            Discover a plan built around your goals.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-silver/90">
            Connect directly with our team to explore tailored capital management for your financial future.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Magnetic>
              <a
                href="mailto:hello@vestrafinance.com"
                className="inline-block rounded-sm border border-cobalt bg-cobalt px-9 py-4 font-mono-tight text-xs uppercase tracking-widest text-ink font-semibold transition-all duration-300 hover:bg-transparent hover:text-cobalt shadow-lg shadow-cobalt/25"
              >
                Email our team
              </a>
            </Magnetic>
            <Magnetic strength={0.25}>
              <a
                href="tel:+10000000000"
                className="inline-block rounded-sm border border-hairline-strong bg-panel/70 px-9 py-4 font-mono-tight text-xs uppercase tracking-widest text-silver transition-all duration-300 hover:border-cobalt hover:text-paper"
              >
                Call us
              </a>
            </Magnetic>
          </div>
          <p className="mt-6 font-mono-tight text-[11px] uppercase tracking-widest text-mist">
            hello@vestrafinance.com &middot; +1 (000) 000-0000
          </p>
        </Reveal>
      </div>
    </section>
  );
}

