import { CalendarRange, Receipt, Target } from "lucide-react";
import SourceLink from "./SourceLink";
import { SITE } from "@/config/site";

const problems = [
  { n: "01", icon: Receipt, title: "Invisible spending", desc: "Small purchases feel harmless until you see the monthly total." },
  { n: "02", icon: CalendarRange, title: "Budgeting that doesn't fit", desc: "Scholarships, part-time jobs, and family support don't always follow a regular payday." },
  { n: "03", icon: Target, title: "Goals that never happen", desc: "Saving for something is harder when you don't know how much you can actually put aside." },
];

const ProblemSection = () => (
  <section id="problem" className="section section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <h2 className="leading-[1.05]" style={{ fontSize: "clamp(34px, 4.8vw, 56px)" }}>
          Where did all my money go?
        </h2>
        <p className="text-muted-foreground text-[18px] font-semibold leading-relaxed mt-5 max-w-2xl">
          Coffee, delivery, subscriptions, going out. Small expenses add up quickly, especially when your income doesn't arrive on a predictable schedule.
        </p>
      </div>

      <ol className="grid md:grid-cols-3 gap-10 md:gap-8 mt-16">
        {problems.map(({ n, icon: Icon, title, desc }) => (
          <li key={n} className="border-t border-white/10 pt-6">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-black text-primary-glow tabular">{n}</span>
              <Icon className="w-6 h-6 text-foreground/70" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="text-[22px] mt-5">{title}</h3>
            <p className="text-[16px] text-muted-foreground font-semibold leading-relaxed mt-2">{desc}</p>
          </li>
        ))}
      </ol>

      {/* supporting evidence: verified figures only */}
      <aside aria-label="Research" className="mt-16 flex flex-col sm:flex-row gap-6 sm:gap-12 text-[14px]">
        {SITE.stats.map((s) => (
          <p key={s.value} className="max-w-xs">
            <span className="text-[20px] font-black text-foreground mr-1.5">{s.value}</span>
            <span className="font-semibold text-muted-foreground">{s.text}.</span> <SourceLink id={s.source} />
          </p>
        ))}
      </aside>
    </div>
  </section>
);

export default ProblemSection;
