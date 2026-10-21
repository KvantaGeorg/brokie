import { Check, X } from "lucide-react";
import { ScrollRevealText } from "./fx/Motion";
import { useContext } from "react";
import { FadeUp, SectionIndexContext } from "./product/ProductUI";
import { SITE } from "@/config/site";

const without = ["Open supplier sites one by one", "Compare prices by hand", "Never sure you found the best rate"];
const withProduct = ["One search across all suppliers", "Every rate side by side", "Best rate highlighted automatically"];

const StatementSection = () => {
  const showIndex = useContext(SectionIndexContext);
  return (
  <section id="problem" className="py-28 lg:py-40">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="micro-label mb-8 flex items-center gap-3">
          {showIndex && (
            <>
              <span className="text-foreground tabular">01</span>
              <span className="w-8 h-px bg-foreground/20" />
            </>
          )}
          The problem
        </p>
        <ScrollRevealText
          className="text-[clamp(30px,4.6vw,64px)] font-bold tracking-[-0.035em] leading-[1.1] text-foreground"
          text={`Checking the same room on every supplier's site takes too much time. ${SITE.name} shows all the rates in one search.`}
          highlight={["one", "search"]}
        />

        {/* Before / after */}
        <div className="grid md:grid-cols-2 gap-4 mt-16">
          <FadeUp className="rounded-3xl bg-subtle border border-border p-8">
            <div className="text-[13px] font-semibold text-muted-foreground mb-6">Without {SITE.name}</div>
            <ul className="space-y-4">
              {without.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[17px] text-muted-foreground">
                  <span className="w-6 h-6 rounded-full bg-foreground/[0.06] flex items-center justify-center shrink-0">
                    <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.08} className="rounded-3xl bg-foreground text-background p-8">
            <div className="text-[13px] font-semibold text-primary mb-6">With {SITE.name}</div>
            <ul className="space-y-4">
              {withProduct.map((t) => (
                <li key={t} className="flex items-center gap-3 text-[17px] font-medium">
                  <span className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      </div>
    </div>
  </section>
  );
};

export default StatementSection;
