import { motion } from "framer-motion";
import HeroResultsMock from "./product/HeroResultsMock";
import { BackersRow } from "./brand/Brand";
import { RiseWords, ScrollScale } from "./fx/Motion";
import { TabChaos } from "./fx/TabChaos";
import { SIGNUP_URL } from "./Navbar";
import { SITE } from "@/config/site";

const HeroSection = () => {
  return (
    <section className="relative pb-12">
      <div className="relative mx-2 sm:mx-3 mt-2 sm:mt-3 rounded-[24px] sm:rounded-[32px] overflow-hidden">
        <TabChaos />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-36 lg:pt-48 pb-64 lg:pb-80">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex justify-center mb-10">
              <BackersRow />
            </motion.div>

            <h1 className="font-bold text-foreground leading-[0.98] tracking-[-0.05em]" style={{ fontSize: "clamp(48px, 8.5vw, 120px)" }}>
              <RiseWords text={SITE.heroTitle[0]} />
              <br className="hidden sm:block" />
              <RiseWords text={SITE.heroTitle[1]} delay={0.2} />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-lg lg:text-[22px] text-muted-foreground mt-8 max-w-xl mx-auto leading-snug"
            >
              {SITE.heroSubtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-wrap justify-center gap-3 mt-10"
            >
              <a
                href={SIGNUP_URL}
                className="group inline-flex items-center justify-center gap-2 h-[52px] px-7 bg-foreground text-background font-semibold rounded-full hover:bg-foreground/85 transition-colors"
              >
                Start free trial
              </a>
              <a
                href={SITE.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-[52px] px-7 bg-background text-foreground font-semibold rounded-full border border-border hover:bg-secondary transition-colors"
              >
                Book a demo
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Product window rising out of the stage */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 -mt-48 lg:-mt-60">
        <ScrollScale className="max-w-4xl mx-auto">
          <HeroResultsMock />
        </ScrollScale>
      </div>
    </section>
  );
};

export default HeroSection;
