import { useId, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Flame, Target, Zap } from "lucide-react";
import { SectionHeader } from "./product/ProductUI";
import { ProgressBar } from "./product/GameUI";
import BrokieMascot from "./brand/BrokieMascot";
import { CATEGORY_ICONS } from "./product/phone/icons";
import { SUGGESTED_BUDGET, lastMonth, projectedBalance, sumBudget, thisMonth } from "@/data/budget";
import { levelTitle, levelXp } from "@/data/challenges";
import { spendingByCategory } from "@/data/transactions";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

/* Step visuals: one product preview per step */
const UnderstandVisual = () => {
  const cats = [...spendingByCategory()].sort((a, b) => b.total - a.total);
  const max = cats[0].total;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <span className="text-[15px] font-extrabold text-muted-foreground">October spending</span>
        <span className="text-[24px] font-black tabular">{eur(lastMonth.spent)}</span>
      </div>
      <ul className="space-y-3">
        {cats.map((c) => {
          const Icon = CATEGORY_ICONS[c.id];
          return (
            <li key={c.id} className="flex items-center gap-3 text-[14px] font-bold">
              <Icon className="w-4 h-4 shrink-0" style={{ color: c.color }} strokeWidth={2.25} aria-hidden="true" />
              <span className="w-28 shrink-0">{c.label}</span>
              <span className="flex-1 h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <span className="block h-full rounded-full" style={{ width: `${(c.total / max) * 100}%`, background: c.color }} />
              </span>
              <span className="w-16 text-right tabular">{eur(c.total)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const PlanVisual = () => (
  <div>
    <dl className="grid grid-cols-3 gap-3 text-center">
      {[
        ["Monthly income", eur(lastMonth.income)],
        ["Planned spending", eur(sumBudget(SUGGESTED_BUDGET))],
        ["Projected remaining", eur(projectedBalance(lastMonth.income, SUGGESTED_BUDGET))],
      ].map(([k, v]) => (
        <div key={k} className="rounded-2xl bg-white/[0.05] px-2 py-4">
          <dt className="text-[12px] font-bold text-muted-foreground">{k}</dt>
          <dd className={`text-[22px] font-black tabular mt-1 ${k === "Projected remaining" ? "text-accent" : ""}`}>{v}</dd>
        </div>
      ))}
    </dl>
    <div className="mt-6 rounded-2xl border border-white/10 p-5">
      <p className="flex items-center gap-2 text-[13px] font-extrabold text-muted-foreground">
        <Target className="w-4 h-4" aria-hidden="true" /> Goal
      </p>
      <p className="flex items-baseline justify-between mt-1">
        <span className="text-[19px] font-black">Trip to Riga</span>
        <span className="text-[15px] font-black tabular">
          €45 <span className="text-muted-foreground font-bold">/ €150</span>
        </span>
      </p>
      <ProgressBar value={45} max={150} label="Trip to Riga: €45 of €150" className="mt-3" />
    </div>
  </div>
);

const ImproveVisual = () => {
  const spent = thisMonth.byCategory("delivery");
  return (
    <div className="rounded-2xl border border-white/10 p-6">
      <div className="flex items-start gap-4">
        <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/20 text-primary-glow flex items-center justify-center">
          <CATEGORY_ICONS.delivery className="w-5 h-5" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-[19px] font-black leading-snug">Stay under €55 on food delivery this month.</p>
          <p className="text-[14px] font-bold text-muted-foreground mt-1">Based on your November budget</p>
        </div>
      </div>
      <ProgressBar value={spent} max={SUGGESTED_BUDGET.delivery} label="Delivery budget used" className="mt-6 h-3" />
      <p className="flex justify-between text-[14px] font-bold mt-2.5 tabular">
        <span>
          €{Math.round(spent)} spent of €{SUGGESTED_BUDGET.delivery}
        </span>
        <span className="text-accent">+50 XP on success</span>
      </p>
      <div className="mt-6 flex items-center gap-3 text-[14px] font-bold text-muted-foreground">
        <BrokieMascot mood="watching" size={36} title="" />
        Only €12 left. Choose wisely.
      </div>
    </div>
  );
};

const LevelVisual = () => (
  <div>
    <div className="flex items-center gap-4">
      <span className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center font-black leading-none">
        <span className="text-[11px]">Lv</span>
        <span className="text-[24px]">8</span>
      </span>
      <div>
        <p className="text-[24px] font-black leading-tight">{levelTitle(8)}</p>
        <p className="text-[14px] font-bold text-muted-foreground">10 / {levelXp(8)} XP to {levelTitle(9)}</p>
      </div>
    </div>
    <ul className="grid grid-cols-2 gap-3 mt-6">
      <li className="rounded-2xl bg-white/[0.05] p-4">
        <Flame className="w-5 h-5 text-chart-6" strokeWidth={2.25} aria-hidden="true" />
        <p className="text-[20px] font-black mt-2">12 days</p>
        <p className="text-[13px] font-bold text-muted-foreground">Check-in streak</p>
      </li>
      <li className="rounded-2xl bg-white/[0.05] p-4">
        <Zap className="w-5 h-5 text-accent" strokeWidth={2.25} aria-hidden="true" />
        <p className="text-[20px] font-black mt-2">+30 XP</p>
        <p className="text-[13px] font-bold text-muted-foreground">Last challenge</p>
      </li>
    </ul>
    <p className="mt-5 text-[14px] font-bold text-muted-foreground">XP tracks your progress in Brokie. It is not money and never changes your balance.</p>
  </div>
);

const steps = [
  { n: "01", title: "Understand", headline: "See where your money goes.", desc: "Brokie organizes your transactions and turns everyday spending into clear insights.", visual: <UnderstandVisual /> },
  { n: "02", title: "Plan", headline: "Give your money a plan.", desc: "Set realistic spending limits and choose something worth saving for.", visual: <PlanVisual /> },
  { n: "03", title: "Improve", headline: "Small challenges. Real habits.", desc: "Get personalized challenges based on your budget and spending patterns.", visual: <ImproveVisual /> },
  { n: "04", title: "Level up", headline: "Make progress worth celebrating.", desc: "Build streaks, earn XP, and celebrate better financial decisions.", visual: <LevelVisual /> },
];

const HowItWorksSection = () => {
  const [active, setActive] = useState(0);
  const still = useReducedMotion() ?? false;
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const step = steps[active];

  // Tabs pattern: arrow keys move between steps
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta = ["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : ["ArrowUp", "ArrowLeft"].includes(e.key) ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + steps.length) % steps.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="how-it-works" className="section section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title="Four steps to better money habits." desc="No complicated spreadsheets. No finance lectures. Just your money, made easier to understand." />

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-16 items-start">
          <div role="tablist" aria-label="How Brokie works" aria-orientation="vertical" className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.n}
                  ref={(el) => (tabRefs.current[i] = el)}
                  id={`${uid}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={`${uid}-panel`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={`text-left rounded-2xl px-5 py-4 border transition-colors ${on ? "bg-surface border-white/15" : "border-transparent hover:bg-white/[0.03]"}`}
                >
                  <span className={`block text-[13px] font-black tabular ${on ? "text-accent" : "text-muted-foreground"}`}>{s.n}</span>
                  <span className={`block text-[20px] lg:text-[22px] font-black mt-0.5 ${on ? "text-foreground" : "text-foreground/60"}`}>{s.title}</span>
                  <span className={`hidden lg:block text-[15px] font-bold mt-0.5 ${on ? "text-muted-foreground" : "text-foreground/40"}`}>{s.headline}</span>
                </button>
              );
            })}
          </div>

          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="surface rounded-3xl p-6 sm:p-9 min-h-[460px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={active} initial={still ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={still ? undefined : { opacity: 0 }} transition={{ duration: 0.2 }}>
                <h3 className="text-[26px] leading-tight">{step.headline}</h3>
                <p className="text-[16px] font-semibold text-muted-foreground mt-2 mb-8 max-w-md">{step.desc}</p>
                {step.visual}
                {active < steps.length - 1 && (
                  <button type="button" onClick={() => setActive(active + 1)} className="mt-8 inline-flex items-center gap-1.5 text-[15px] font-extrabold text-primary-glow hover:text-foreground">
                    Next: {steps[active + 1].title} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
