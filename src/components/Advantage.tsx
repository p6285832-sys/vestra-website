import Reveal from "./Reveal";

const PILLARS = [
  {
    label: "Disciplined Risk Controls",
    body: "Strict parameters govern market exposure, with capital preservation treated as a first-order priority — not an afterthought.",
  },
  {
    label: "Absolute Transparency",
    body: "You always know how your wealth is being managed. No hidden mechanics — just clear, direct communication.",
  },
  {
    label: "Professional Focus",
    body: "Strategies built for sustainable, long-term wealth creation, executed by experienced market professionals.",
  },
];

export default function Advantage() {
  return (
    <section
      id="advantage"
      className="relative bg-ink/35 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="font-mono-tight text-xs uppercase tracking-[0.25em] text-mist">
            <span className="mr-3 text-cobalt">&mdash;</span>
            The Vestra Finance Advantage
          </div>
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight text-paper md:text-4xl lg:text-5xl">
            Three pillars our foundation is built on.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.label} delay={i * 0.08}>
              <div className="group relative h-full rounded-xl border border-hairline bg-panel-glass p-8 backdrop-blur-sm transition-all duration-400 hover:border-cobalt/40 hover:bg-panel-2/80 hover:shadow-xl hover:shadow-cobalt/10">
                <div className="flex items-center justify-between">
                  <span className="font-mono-tight text-xs uppercase tracking-widest text-cobalt font-semibold">
                    Pillar 0{i + 1}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-cobalt/60 group-hover:bg-cobalt transition-colors" />
                </div>

                <h3 className="mt-6 font-display text-xl font-semibold text-paper transition-colors duration-300 group-hover:text-ascent-bright">
                  {pillar.label}
                </h3>
                <p className="mt-4 leading-relaxed text-silver/85 text-sm md:text-base">
                  {pillar.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
