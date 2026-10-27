import { motion } from "framer-motion";
import { RiseWords } from "./fx/Motion";
import { Blobs } from "./product/ProductUI";
import PhoneShowcase from "./product/PhoneShowcase";
import { Link } from "react-router-dom";
import SourceLink from "./SourceLink";
import { SITE } from "@/config/site";

const HeroSection = () => (
  <section className="relative overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-20 lg:pb-28">
    <Blobs variant={0} />
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-10 items-center">
      <div className="text-center lg:text-left">
        <h1 className="text-foreground leading-[1.02] tracking-[-0.03em]" style={{ fontSize: "clamp(40px, 5.6vw, 68px)" }}>
          <RiseWords text={SITE.heroTitle[0]} />{" "}
          <RiseWords text={SITE.heroTitle[1]} delay={0.25} className="text-accent" />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="text-lg lg:text-[22px] text-muted-foreground mt-6 max-w-xl mx-auto lg:mx-0 leading-snug font-semibold"
        >
          {SITE.heroSubtitle}
        </motion.p>

        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="grid sm:grid-cols-2 gap-3 mt-8 max-w-xl mx-auto lg:mx-0 text-left"
        >
          {SITE.stats.map((s) => (
            <li key={s.value} className="glass rounded-2xl p-4">
              <span className="block text-[30px] font-black text-accent leading-none">{s.value}</span>
              <span className="block text-[14px] font-semibold text-foreground/90 mt-1.5 leading-snug">{s.text}</span>
              <SourceLink id={s.source} className="mt-1.5" />
            </li>
          ))}
        </motion.ul>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="flex flex-wrap justify-center lg:justify-start gap-4 mt-9"
        >
          <Link to={SITE.demoPath} className="btn-chunky btn-accent">
            Open the demo
          </Link>
          <a href={SITE.tryHref} className="btn-chunky btn-glass">
            Try Brokie
          </a>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
        <PhoneShowcase />
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
