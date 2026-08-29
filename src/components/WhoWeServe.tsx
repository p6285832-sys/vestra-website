import Reveal from "./Reveal";

const PROFILES = [
  {
    title: "Serious Wealth-Builders",
    desc: "Individuals and families focused on generational compounding and disciplined risk parameters.",
    icon: "01",
  },
  {
    title: "Income-Focused Planners",
    desc: "Capital allocators seeking predictable, structured monthly distributions to support cash flow.",
    icon: "02",
  },
  {
    title: "Disillusioned by Hype",
    desc: "Investors fatigued by emotional retail trading, memestocks, and unverified promises.",
    icon: "03",
  },
];

export default function WhoWeServe() {
  return (
    <section className="relative bg-paper px-6 py-28 text-ink md:px-10 md:py-36 shadow-2xl">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16 items-start">
          <Reveal>
            <div className="font-mono-tight text-xs uppercase tracking-[0.25em] text-cobalt font-semibold">
              <span className="mr-3 inline-block h-px w-8 bg-cobalt align-middle" />
              Who We Serve
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl lg:text-5xl">
              Built for wealth-builders, not speculators.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600 md:text-lg">
              Vestra Finance is intentionally designed for serious long-term planners and professionals who value strategic consistency over volatile market gambles.
            </p>
          </Reveal>

          <div className="grid gap-6">
            {PROFILES.map((profile, i) => (
              <Reveal key={profile.title} delay={i * 0.1}>
                <div className="group rounded-lg border border-slate-200 bg-slate-50/80 p-6 transition-all duration-300 hover:border-cobalt hover:bg-white hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-cobalt text-xs font-mono font-bold text-white">
                      {profile.icon}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-ink group-hover:text-cobalt transition-colors">
                        {profile.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                        {profile.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

