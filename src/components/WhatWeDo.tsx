import Reveal from "./Reveal";
import StatNumber from "./StatNumber";

const ITEMS = [
  {
    label: "Targeted Growth",
    body: "We target annual returns of 18–24%, aiming for 1.5–2% monthly.",
    stat: <StatNumber to={18} suffix="–24%" />,
    statCaption: "Target annual return*",
  },
  {
    label: "Consistent Income",
    body: "Enjoy a reliable, regular monthly payout structure built for planning ahead.",
    stat: <StatNumber to={1} decimals={0} prefix="" suffix="×" />,
    statCaption: "Monthly payout cycle",
  },
  {
    label: "Total Flexibility",
    body: "Transparent processes and easy withdrawals whenever you need access to your funds.",
    stat: <span>&infin;</span>,
    statCaption: "Access, on your terms",
  },
];

export default function WhatWeDo() {
  return (
    <section id="what-we-do" className="relative bg-ink/40 px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="font-mono-tight text-xs uppercase tracking-[0.25em] text-mist">
            <span className="mr-3 text-cobalt">&mdash;</span>
            What We Do
          </div>
          <h2 className="mt-6 max-w-2xl font-display text-3xl font-semibold leading-tight text-paper md:text-4xl lg:text-5xl">
            Professional, risk-managed strategy applied to your capital.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {ITEMS.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="group relative h-full rounded-xl border border-hairline bg-panel-glass p-8 backdrop-blur-sm transition-all duration-500 hover:border-cobalt/50 hover:bg-panel-2/90 hover:shadow-xl hover:shadow-cobalt/10 md:p-10">
                <div className="font-mono-tight text-4xl font-semibold text-cobalt transition-transform duration-500 group-hover:-translate-y-1 md:text-5xl">
                  {item.stat}
                </div>
                <div className="mt-2 font-mono-tight text-[11px] uppercase tracking-widest text-mist">
                  {item.statCaption}
                </div>

                <div className="mt-8 h-px w-full bg-hairline transition-colors duration-500 group-hover:bg-cobalt/50" />

                <h3 className="mt-8 font-display text-xl font-semibold text-paper">
                  {item.label}
                </h3>
                <p className="mt-3 leading-relaxed text-silver/85">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 font-mono-tight text-[11px] leading-relaxed text-mist">
          *Targeted, not guaranteed. Investments carry risk, including
          possible loss of capital.
        </p>
      </div>
    </section>
  );
}
