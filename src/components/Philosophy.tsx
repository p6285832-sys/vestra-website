import Reveal from "./Reveal";

export default function Philosophy() {
  return (
    <section id="philosophy" className="relative overflow-hidden bg-ink/30 px-6 py-28 md:px-10 md:py-36">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cobalt/10 blur-[140px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <h2 className="mb-8 flex items-center gap-3 font-mono-tight text-xs uppercase tracking-[0.25em] text-mist">
            <span className="h-px w-8 bg-cobalt" />
            The Vestra Philosophy
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="font-display text-3xl leading-[1.3] font-medium text-paper sm:text-4xl md:text-5xl md:leading-[1.25]">
            Vestra draws from the Latin word for{" "}
            <span className="text-cobalt underline decoration-cobalt/40 underline-offset-8">&ldquo;yours.&rdquo;</span> A
            simple idea sits underneath everything we do:{" "}
            <span className="text-silver/95">
              this is your wealth, your plan, your future.
            </span>{" "}
            Our role is to bring disciplined, professional strategy to what
            is already yours.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
