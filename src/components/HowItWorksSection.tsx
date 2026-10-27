import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Landmark } from "lucide-react";
import { Blobs, SectionHeader } from "./product/ProductUI";
import { LevelBadge, ProgressBar, StreakFlame, XpPill } from "./product/GameUI";
import { spendingByCategory, totalSpent } from "@/data/transactions";

const STEP_MS = 5000;

const steps = [
  {
    n: "01",
    title: "Connect your account",
    desc: "Link your bank account in one tap. In this prototype Brokie runs on a demo month of mock transactions.",
    outcome: "No spreadsheets, no manual typing",
  },
  {
    n: "02",
    title: "See your spending structure",
    desc: "Brokie sorts every transaction into categories and shows where your money really goes each month.",
    outcome: "Rent, food, fun: all in one picture",
  },
  {
    n: "03",
    title: "Level up your habits",
    desc: "Earn XP, keep your streak alive and take on weekly challenges built from your own spending.",
    outcome: "Better habits that actually stick",
  },
];

/* Step visuals: one glass card per step */
const ConnectVisual = () => (
  <div className="space-y-3">
    {[
      { name: "Current account", num: "•••• 4021", ok: true },
      { name: "Savings", num: "•••• 7310", ok: true },
      { name: "Credit card", num: "Not linked", ok: false },
    ].map((a) => (
      <div key={a.name} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3">
        <span className="w-9 h-9 rounded-xl bg-primary/30 flex items-center justify-center">
          <Landmark className="w-4 h-4 text-primary-glow" />
        </span>
        <div className="flex-1">
          <div className="text-[15px] font-extrabold leading-snug">{a.name}</div>
          <div className="text-[12px] text-muted-foreground font-bold">{a.num}</div>
        </div>
        {a.ok && (
          <span className="w-7 h-7 rounded-full bg-chart-2 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" strokeWidth={3.5} />
          </span>
        )}
      </div>
    ))}
    <p className="text-center text-[12px] font-extrabold text-accent pt-1">Demo mode: using mock data</p>
  </div>
);

const StructureVisual = () => {
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
            <span className="flex-1">
              {c.emoji} {c.label}
            </span>
            <span className="tabular">€{c.total.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const LevelVisual = () => (
  <div>
    <div className="flex items-center justify-between text-[20px]">
      <StreakFlame count={12} />
      <XpPill xp={340} />
      <LevelBadge level={7} className="text-[14px] h-8 px-3" />
    </div>
    <div className="mt-5 rounded-2xl bg-white/[0.06] border border-white/10 p-4">
      <div className="text-[11px] font-black tracking-wide text-accent">WEEKLY CHALLENGE</div>
      <p className="text-[16px] font-extrabold mt-1">Spend €10 less on delivery than last week</p>
      <ProgressBar value={6} max={10} label="Weekly challenge progress" className="mt-3" />
      <p className="text-[12px] font-bold text-muted-foreground mt-2">€6 of €10 saved · +50 XP when done</p>
    </div>
  </div>
);

const visuals = [<ConnectVisual key="c" />, <StructureVisual key="s" />, <LevelVisual key="l" />];

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
        <SectionHeader label="How it works" title="Three steps from “where did it go?” to “I got this.”" />

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
