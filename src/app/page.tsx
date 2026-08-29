import AscentCanvas from "@/components/AscentCanvas";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Philosophy from "@/components/Philosophy";
import WhoWeServe from "@/components/WhoWeServe";
import WhatWeDo from "@/components/WhatWeDo";
import Advantage from "@/components/Advantage";
import HowItWorks from "@/components/HowItWorks";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <AscentCanvas />
      <Intro />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <Philosophy />
        <WhoWeServe />
        <WhatWeDo />
        <Advantage />
        <HowItWorks />
        <CTA />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </>
  );
}
