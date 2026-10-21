import { FadeUp, SectionHeader } from "./product/ProductUI";
import { RollingNumber } from "./fx/Motion";
import { SITE } from "@/config/site";

const benefits = [
  { stat: "1", unit: "search", title: "Save time on every booking", desc: "Stop switching between 12 tabs. One search covers all suppliers." },
  { stat: "14.2", unit: "%", title: "Increase margins with better rates", desc: "Save an average of 14.2% per booking by always finding the best rate." },
  { stat: "0", unit: "copy-paste", title: "Reduce manual work and errors", desc: "Automated comparison eliminates copy-paste mistakes and missed deals." },
  { stat: "65", unit: "+ suppliers", title: "Faster, more confident decisions", desc: "See all options at once. Book the best rate with certainty." },
];

const BenefitsSection = () => (
  <section id="benefits" className="py-28 lg:py-40 bg-subtle">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
          index="04" label="Benefits" title={`Why teams switch to ${SITE.name}`} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 border border-border rounded-2xl overflow-hidden divide-y sm:divide-y-0 divide-border">
        {benefits.map((b, i) => (
          <FadeUp
            key={b.title}
            delay={i * 0.06}
            className={`p-7 bg-background ${i % 2 === 1 ? "sm:border-l" : ""} ${i >= 2 ? "sm:border-t lg:border-t-0" : ""} ${i > 0 ? "lg:border-l" : ""} border-border`}
          >
            <div className="flex items-baseline gap-1.5 mb-6">
              <RollingNumber value={b.stat} className="text-[52px] font-bold tracking-[-0.05em] tabular" />
              <span className="text-[15px] font-semibold text-primary">{b.unit}</span>
            </div>
            <h3 className="text-[16px] font-semibold tracking-[-0.01em] mb-1.5">{b.title}</h3>
            <p className="text-[14px] text-muted-foreground leading-relaxed">{b.desc}</p>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSection;
