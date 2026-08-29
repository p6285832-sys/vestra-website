const PILLARS = [
  "Disciplined Risk Controls",
  "Absolute Transparency",
  "Professional Focus",
];

const FIGURES = [
  "18–24% Target Annual Return",
  "1.5–2% Monthly Target",
  "Consistent Monthly Payouts",
  "Total Flexibility",
];

function Dot() {
  return <span className="mx-8 h-1 w-1 shrink-0 rounded-full bg-hairline-strong" />;
}

function Row({
  items,
  direction,
  tone,
}: {
  items: string[];
  direction: "marquee" | "marquee-reverse";
  tone: "bright" | "dim";
}) {
  const doubled = [...items, ...items, ...items];
  const textClass =
    tone === "bright"
      ? "text-silver/85"
      : "text-mist/70";

  return (
    <div className="flex overflow-hidden">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={`flex shrink-0 items-center ${
            direction === "marquee" ? "animate-marquee" : "animate-marquee-reverse"
          } motion-reduce:animate-none`}
        >
          {doubled.map((phrase, i) => (
            <span
              key={`${phrase}-${i}`}
              className={`flex shrink-0 items-center font-mono-tight text-xs uppercase tracking-widest ${textClass}`}
            >
              {phrase}
              <Dot />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div className="relative flex flex-col gap-3 border-y border-hairline bg-panel-2/40 backdrop-blur-sm py-4">
      <Row items={PILLARS} direction="marquee" tone="bright" />
      <Row items={FIGURES} direction="marquee-reverse" tone="dim" />
    </div>
  );
}
