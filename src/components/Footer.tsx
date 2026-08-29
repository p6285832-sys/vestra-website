import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-ink/30 px-6 pb-12 pt-16 md:px-10 border-t border-hairline">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 w-fit rounded-lg bg-paper px-3.5 py-2 shadow-md shadow-black/40 ring-1 ring-white/20">
              <Image
                src="/logo/vestra-logo.png"
                alt="Vestra Finance"
                width={168}
                height={82}
                className="h-8 w-auto md:h-9"
              />
            </div>
            <p className="font-mono-tight text-xs text-mist max-w-xs">
              Disciplined strategy. Long-term wealth.
            </p>
          </div>

          <div className="max-w-xl">
            <p className="font-mono-tight text-[11px] uppercase tracking-widest text-cobalt font-semibold">
              Risk Disclosure & Governance
            </p>
            <p className="mt-3 text-xs md:text-sm leading-relaxed text-mist">
              Investments carry risk, including possible loss of capital.
              Past performance and targeted returns are not a guarantee of
              future results. Vestra Finance provides this information for
              general informational purposes only and it should not be considered
              financial advice. Speak with a qualified advisor before making
              investment decisions.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 font-mono-tight text-[11px] uppercase tracking-widest text-mist md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} Vestra Finance. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#philosophy" className="hover:text-silver transition-colors">Philosophy</a>
            <a href="#what-we-do" className="hover:text-silver transition-colors">What We Do</a>
            <a href="#advantage" className="hover:text-silver transition-colors">Advantage</a>
            <a href="#how-it-works" className="hover:text-silver transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-silver transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

