import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Blobs, SectionHeader } from "./product/ProductUI";
import { LevelBadge, ProgressBar, StreakFlame, XpPill } from "./product/GameUI";
import { CATEGORIES, spendingByCategory, totalSpent } from "@/data/transactions";
import { SUGGESTED_BUDGET, lastMonth, projectedBalance, sumBudget } from "@/data/budget";

const STEP_MS = 5000;

const steps = [
  {
    n: "01",
    title: "Understand",
    desc: "Connect your bank (simulated in this demo) and Brokie sorts every transaction into categories, so you see where the money really went.",
    outcome: "October: €690 in, €679.81 out",
  },
  {
    n: "02",
    title: "Plan",
    desc: "Brokie suggests a realistic monthly budget from last month's spending, and you set one goal worth saving for.",
    outcome: "€635 planned, €55 left at month end",
  },
  {
    n: "03",
    title: "Improve",
    desc: "Small challenges tied to your budget and goal: stay under your delivery limit, check your budget, set a little aside.",
    outcome: "Challenges built from your own numbers",
  },
  {
    n: "04",
    title: "Level up",
    desc: "Finished challenges earn XP, streaks and levels. Money progress and XP are tracked separately.",
    outcome: "Better habits that actually stick",
  },
];

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

/* Step visuals: one glass card per step */
const UnderstandVisual = () => {
  const cats = spendingByCategory();
  const total = totalSpent();
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[17px] font-black">October</span>
        <span className="text-[22px] font-black tabular">€{total.toFixed(0)}</span>
      </div>
      <div className="flex h-5 rounded-full overflow-hidden mt-3 mb-5" aria-hidden="true">
        {cats.map((c) => (
          <div key={c.id} style={{ width: `${(c.total / total) * 100}%`, background: c.color }} />
        ))}
      </div>
      <ul className="space-y-2">
        {[...cats].sort((a, b) => b.total - a.total).slice(0, 4).map((c) => (
          <li key={c.id} className="flex items-center gap-3 text-[15px] font-bold">
            <span className="w-3 h-3 rounded-full" style={{ background: c.color }} />
            <span className="flex-1">{c.label}</span>
            <span className="tabular">€{c.total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PlanVisual = () => (
  <div>
    <div className="grid grid-cols-3 gap-2 text-center">
      {[
        ["Income", lastMonth.income],
        ["Planned", sumBudget(SUGGESTED_BUDGET)],
        ["Left at end", projectedBalance(lastMonth.income, SUGGESTED_BUDGET)],
      ].map(([k, v]) => (
        <div key={k as string} className="rounded-xl bg-white/[0.06] py-2.5">
          <p className="text-[11px] font-extrabold text-muted-foreground">{k}</p>
          <p className={`text-[17px] font-black tabular ${k === "Left at end" ? "text-accent" : ""}`}>{eur(v as number)}</p>
        </div>
      ))}
    </div>
    <ul className="mt-4 space-y-2.5">
      {(["delivery", "goingOut", "groceries"] as const).map((id) => (
        <li key={id} className="flex items-center justify-between text-[15px] font-bold">
          <span>{CATEGORIES.find((c) => c.id === id)!.label}</span>
          <span className="tabular text-muted-foreground">
            Oct €{Math.round(lastMonth.byCategory(id))} → <span className="text-foreground font-black">plan €{SUGGESTED_BUDGET[id]}</span>
          </span>
        </li>
      ))}
    </ul>
    <div className="mt-4 rounded-2xl bg-primary/20 border border-primary/40 p-3.5">
      <p className="text-[12px] font-black text-accent">Goal</p>
      <p className="text-[16px] font-extrabold">Trip to Riga · €45 of €150</p>
      <ProgressBar value={45} max={150} label="Trip to Riga progress" className="mt-2" />
    </div>
  </div>
);

const ImproveVisual = () => (
  <div className="space-y-3">
    {[
      { t: "Stay under €55 on food delivery this month", v: 43, m: 55, p: "€43 of €55 used", xp: 50 },
      { t: "Check your budget 3 days in a row", v: 2, m: 3, p: "2 of 3 days", xp: 20 },
      { t: "Add €10 to your savings goal", v: 5, m: 10, p: "€5 of €10", xp: 30 },
    ].map((c) => (
      <div key={c.t} className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
        <div className="flex justify-between gap-3">
          <p className="text-[15px] font-extrabold leading-snug">{c.t}</p>
          <span className="text-[13px] font-black text-accent shrink-0">+{c.xp} XP</span>
        </div>
        <div className="flex items-center gap-3 mt-2.5">
          <ProgressBar value={c.v} max={c.m} label={`${c.t} progress`} className="flex-1" />
          <span className="text-[12px] font-bold text-muted-foreground tabular">{c.p}</span>
        </div>
      </div>
    ))}
  </div>
);

const LevelVisual = () => (
  <div>
    <div className="flex items-center justify-between text-[20px]">
      <StreakFlame count={12} />
      <XpPill xp={2870} />
      <LevelBadge level={8} className="text-[14px] h-8 px-3" />
    </div>
    <div className="mt-5 rounded-2xl bg-white/[0.06] border border-white/10 p-4">
      <div className="text-[11px] font-black tracking-wide text-accent">CHALLENGE COMPLETE</div>
      <p className="text-[16px] font-extrabold mt-1">Add €10 to your savings goal</p>
      <p className="text-[13px] font-bold text-muted-foreground mt-1">+30 XP · Level 8 · Money Ninja</p>
      <ProgressBar value={10} max={600} label="XP towards level 9" className="mt-3" />
    </div>
  </div>
);

const visuals = [<UnderstandVisual key="u" />, <PlanVisual key="p" />, <ImproveVisual key="i" />, <LevelVisual key="l" />];

const HowItWorksSection = () => {
  const [active, setActive] = useState(0);
  const still = useReducedMotion() ?? false;

  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearTimeout(t);
  }, [active, still]);

  return (
    <section id="how-it-works" className="relative py-24 lg:py-36 bg-subtle">
      <Blobs variant={2} />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader label="How it works" title="Understand, plan, improve, level up." />

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-20 items-center">
          {/* Step list */}
          <div className="space-y-2">
            {steps.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.n}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-expanded={isActive}
                  className={`relative w-full text-left rounded-3xl px-6 py-5 transition-colors ${
                    isActive ? "glass" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`text-[15px] font-black tabular ${isActive ? "text-accent" : "text-muted-foreground"}`}>{s.n}</span>
                    <div className="flex-1">
                      <h3 className={`text-[22px] ${isActive ? "text-foreground" : "text-foreground/60"}`}>{s.title}</h3>
                      <AnimatePresence initial={false}>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="text-[16px] text-muted-foreground font-semibold leading-relaxed mt-2">{s.desc}</p>
                            <p className="flex items-center gap-2 mt-4 text-[15px] font-extrabold">
                              <Check className="w-4 h-4 text-accent shrink-0" strokeWidth={3} />
                              {s.outcome}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {/* auto-advance progress */}
                  {isActive && !still && (
                    <span className="absolute left-6 right-6 bottom-0 h-[3px] rounded-full bg-white/10 overflow-hidden">
                      <motion.span
                        key={active}
                        className="block h-full bg-accent"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: STEP_MS / 1000, ease: "linear" }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Visual for the active step */}
          <div className="relative glass-strong rounded-[28px] p-6 sm:p-8 min-h-[340px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                className="w-full"
              >
                {visuals[active]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
