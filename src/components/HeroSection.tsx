import { Link } from "react-router-dom";
import PhoneShowcase from "./product/PhoneShowcase";
import { SITE } from "@/config/site";

const HeroSection = () => (
  <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-40 pb-24 lg:pb-32">
    {/* one soft light behind the phone, nothing else */}
    <div aria-hidden="true" className="absolute right-[-10%] top-[10%] w-[640px] h-[640px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.22),transparent_65%)] pointer-events-none" />
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-12 items-center">
      <div className="text-center lg:text-left">
        <h1 className="text-foreground leading-[1.02] tracking-[-0.03em]" style={{ fontSize: "clamp(44px, 6.4vw, 84px)" }}>
          {SITE.heroTitle[0]} <span className="text-accent">{SITE.heroTitle[1]}</span>
        </h1>
        <p className="text-[19px] lg:text-[21px] text-muted-foreground mt-7 max-w-[34rem] mx-auto lg:mx-0 leading-relaxed font-semibold">{SITE.heroSubtitle}</p>
        <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-10">
          <Link to={SITE.demoPath} className="btn btn-accent">
            Try the demo
          </Link>
          <a href="#how-it-works" className="btn btn-outline">
            See how it works
          </a>
        </div>
      </div>

      <PhoneShowcase />
    </div>
  </section>
);

export default HeroSection;
