import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Target } from "lucide-react";
import BrokieMascot from "../brand/BrokieMascot";
import PhoneFrame from "./PhoneFrame";
import AppTopBar from "./phone/AppTopBar";
import { CATEGORY_ICONS } from "./phone/icons";
import { PHONE_TABS } from "./phone/tabs";
import { SUGGESTED_BUDGET, lastMonth, projectedBalance, sumBudget, thisMonth } from "@/data/budget";
import { PROFILE } from "@/data/challenges";
import { CATEGORIES, TRANSACTIONS, spendingByCategory } from "@/data/transactions";

/* Short, looping product preview for the hero (about 15 s): analyse → spot delivery → plan → goal → a challenge pays out.
   Plays only while visible; reduced motion shows the final screen as a still. */

const SCENES = [
  { id: "analyse", ms: 2600 },
  { id: "insight", ms: 2800 },
  { id: "plan", ms: 3000 },
  { id: "goal", ms: 2600 },
  { id: "win", ms: 3800 },
] as const;
type SceneId = (typeof SCENES)[number]["id"];

const GOAL = { name: "Trip to Riga", target: 150, saved: 45 };
const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

const Bar = ({ pct, color = "hsl(var(--accent))", delay = 0, animate = true }: { pct: number; color?: string; delay?: number; animate?: boolean }) => (
  <span className="block h-2 rounded-full bg-white/10 overflow-hidden">
    <motion.span className="block h-full rounded-full" style={{ background: color }} initial={animate ? { width: 0 } : false} animate={{ width: `${Math.min(100, pct)}%` }} transition={{ duration: 0.8, delay, ease: [0.2, 0, 0, 1] }} />
  </span>
);

const Screen = ({ children }: { children: ReactNode }) => <div className="absolute inset-x-0 top-[84px] bottom-0 px-5 pb-6 flex flex-col">{children}</div>;
const Title = ({ kicker, children }: { kicker: string; children: ReactNode }) => (
  <div className="mb-4">
    <p className="text-[11px] font-extrabold text-white/50">{kicker}</p>
    <p className="text-[21px] font-black leading-tight">{children}</p>
  </div>
);

/* 1. Analyse October */
const Analyse = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
    <div style={{ perspective: 600 }}>
      <motion.div animate={{ rotateY: 360 }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}>
        <BrokieMascot mood="watching" size={84} title="" />
      </motion.div>
    </div>
    <p className="mt-6 text-[19px] font-black">Analysing October</p>
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="mt-2 text-[13px] font-bold text-white/60">
      {TRANSACTIONS.length} transactions · {CATEGORIES.length} categories
    </motion.p>
  </div>
);

/* 2. €90 on delivery stands out */
const Insight = () => {
  const cats = [...spendingByCategory()].sort((a, b) => b.total - a.total);
  const max = cats[0].total;
  return (
    <Screen>
      <Title kicker="October">{eur(lastMonth.spent)} spent</Title>
      <ul className="space-y-2.5">
        {cats.map((c, i) => {
          const Icon = CATEGORY_ICONS[c.id];
          const hot = c.id === "delivery";
          return (
            <li key={c.id} className={`flex items-center gap-2.5 transition-opacity ${hot ? "" : "opacity-45"}`}>
              <Icon className="w-4 h-4 shrink-0" style={{ color: c.color }} strokeWidth={2.5} />
              <span className="w-[92px] text-[12px] font-extrabold">{c.label}</span>
              <span className="flex-1">
                <Bar pct={(c.total / max) * 100} color={c.color} delay={i * 0.05} />
              </span>
              <span className="w-9 text-right text-[12px] font-black tabular">€{Math.round(c.total)}</span>
            </li>
          );
        })}
      </ul>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-auto flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/10 p-3">
        <BrokieMascot mood="shocked" size={36} className="shrink-0" title="" />
        <p className="text-[12.5px] font-extrabold leading-snug">€{Math.round(lastMonth.byCategory("delivery"))} on food delivery. That's your biggest flexible cost.</p>
      </motion.div>
    </Screen>
  );
};

/* 3. Suggest €55 for delivery */
const Plan = () => {
  const [cut, setCut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCut(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <Screen>
      <Title kicker="November plan">Give your money a plan</Title>
      <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">
        <div className="flex items-center gap-2.5">
          <CATEGORY_ICONS.delivery className="w-4 h-4 text-chart-3" strokeWidth={2.5} />
          <span className="flex-1 text-[13px] font-extrabold">Food delivery</span>
          <span className="text-[13px] font-black tabular flex items-center gap-1.5">
            <span className={cut ? "text-white/40 line-through" : ""}>€{Math.round(lastMonth.byCategory("delivery"))}</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/40" />
            <motion.span key={String(cut)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-accent">
              {cut ? `€${SUGGESTED_BUDGET.delivery}` : "…"}
            </motion.span>
          </span>
        </div>
        <p className="text-[11px] font-bold text-white/50 mt-1.5">Last month → planned limit</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
        {[
          ["Income", eur(lastMonth.income)],
          ["Planned", eur(sumBudget(SUGGESTED_BUDGET))],
          ["Left at end", eur(projectedBalance(lastMonth.income, SUGGESTED_BUDGET))],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/[0.06] py-2.5">
            <p className="text-[10.5px] font-extrabold text-white/50">{k}</p>
            <p className={`text-[15px] font-black tabular ${k === "Left at end" ? "text-accent" : ""}`}>{v}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[11px] font-bold text-white/45">A plan, not money moved.</p>
      <div className="mt-auto flex items-center gap-3">
        <BrokieMascot mood="happy" size={40} className="shrink-0" title="" />
        <p className="text-[13px] font-extrabold leading-snug">€35 less on delivery leaves €55 at month end.</p>
      </div>
    </Screen>
  );
};

/* 4. Create the Riga goal */
const Goal = () => (
  <Screen>
    <Title kicker="Save for something">New goal</Title>
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="rounded-2xl bg-primary/20 border border-primary/40 p-4">
      <p className="flex items-center gap-1.5 text-[11px] font-extrabold text-white/60">
        <Target className="w-3.5 h-3.5" /> Saving for
      </p>
      <p className="text-[20px] font-black">{GOAL.name}</p>
      <p className="mt-3 flex items-baseline justify-between">
        <span className="text-[24px] font-black tabular">€{GOAL.saved}</span>
        <span className="text-[12px] font-extrabold text-white/55">of €{GOAL.target}</span>
      </p>
      <span className="block mt-1.5">
        <Bar pct={(GOAL.saved / GOAL.target) * 100} delay={0.4} />
      </span>
      <p className="mt-1.5 text-[11.5px] font-bold text-white/60">30% · €105 to go</p>
    </motion.div>
    <div className="mt-auto flex items-center gap-3">
      <BrokieMascot mood="proud" size={40} className="shrink-0" title="" />
      <p className="text-[13px] font-extrabold">Riga is on the board.</p>
    </div>
  </Screen>
);

/* 5. Home: a challenge pays out XP, and the goal shows the €10 the user recorded — two separate things */
const Win = ({ still = false }: { still?: boolean }) => {
  const [done, setDone] = useState(still);
  useEffect(() => {
    if (still) return;
    const t = setTimeout(() => setDone(true), 1300);
    return () => clearTimeout(t);
  }, [still]);
  const saved = GOAL.saved + (done ? 10 : 0);
  const planned = sumBudget(SUGGESTED_BUDGET);
  return (
    <>
      <AppTopBar streak={PROFILE.streak} totalXp={PROFILE.totalXp + (done ? 30 : 0)} level={PROFILE.level} />
      <Screen>
        <div className="flex items-center gap-3 -mt-1">
          <BrokieMascot mood={done ? "proud" : "happy"} size={40} className="shrink-0" title="" />
          <p className="text-[13px] font-extrabold leading-snug">{done ? "Nice. Riga just got €10 closer." : "Only €12 left in your delivery budget."}</p>
        </div>

        <div className="mt-3 rounded-2xl bg-white/[0.06] border border-white/10 p-3">
          <p className="text-[10.5px] font-extrabold text-white/50">November · day 14 of 30</p>
          <p className="flex justify-between items-baseline mt-0.5">
            <span className="text-[15px] font-black tabular">€{Math.round(thisMonth.spent)} spent</span>
            <span className="text-[11px] font-bold text-white/50 tabular">of €{planned} planned</span>
          </p>
          <span className="block mt-2">
            <Bar pct={(thisMonth.spent / planned) * 100} animate={!still} />
          </span>
        </div>

        <div className="mt-2.5 rounded-2xl bg-white/[0.06] border border-white/10 p-3">
          <p className="flex justify-between text-[12px] font-black">
            <span>{GOAL.name}</span>
            <span className="tabular">
              <motion.span key={saved} initial={still ? false : { scale: 1.3, color: "hsl(48 96% 53%)" }} animate={{ scale: 1, color: "#ffffff" }} className="inline-block">
                €{saved}
              </motion.span>
              <span className="text-white/45"> / €{GOAL.target}</span>
            </span>
          </p>
          <span className="block mt-2">
            <Bar pct={(saved / GOAL.target) * 100} animate={false} />
          </span>
          <p className="mt-1.5 text-[10.5px] font-bold text-white/45">{done ? "+€10 recorded by you" : "Goal savings are recorded by you"}</p>
        </div>

        <div className={`relative mt-2.5 rounded-2xl border p-3 transition-colors duration-500 ${done ? "bg-chart-2/10 border-chart-2/40" : "bg-white/[0.06] border-white/10"}`}>
          <AnimatePresence>
            {done && !still && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: [0, 1, 1, 0], y: -26 }}
                transition={{ duration: 1.4 }}
                className="absolute right-3 top-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-black text-accent-foreground"
              >
                +30 XP
              </motion.span>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-2.5">
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${done ? "bg-chart-2 text-white" : "bg-primary/25 text-primary-glow"}`}>
              {done ? <Check className="w-4 h-4" strokeWidth={3.5} /> : <Target className="w-4 h-4" strokeWidth={2.5} />}
            </span>
            <span className="flex-1 text-[12.5px] font-extrabold leading-snug">Add €10 to your savings goal</span>
            <span className={`text-[11px] font-black ${done ? "text-chart-2" : "text-accent"}`}>+30 XP</span>
          </div>
          <p className="mt-1.5 text-[10.5px] font-bold text-white/45">{done ? "Challenge complete. XP is progress, not money." : "Challenge"}</p>
        </div>
      </Screen>
      <div className="absolute bottom-0 inset-x-0 h-[64px] border-t border-white/10 bg-[hsl(258_42%_8%)] flex items-center justify-around px-2">
        {PHONE_TABS.map(({ id, label, icon: Icon }) => (
          <span key={id} className={`flex flex-col items-center gap-1 text-[10px] font-extrabold ${id === "home" ? "text-accent" : "text-white/55"}`}>
            <Icon className="w-5 h-5" strokeWidth={id === "home" ? 2.5 : 2} />
            {label}
          </span>
        ))}
      </div>
    </>
  );
};

const render = (id: SceneId) => {
  switch (id) {
    case "analyse":
      return <Analyse />;
    case "insight":
      return <Insight />;
    case "plan":
      return <Plan />;
    case "goal":
      return <Goal />;
    case "win":
      return <Win />;
  }
};

const PhoneShowcase = () => {
  const still = useReducedMotion() ?? false;
  const frameRef = useRef<HTMLElement>(null);
  const inView = useInView(frameRef, { margin: "80px" });
  const [idx, setIdx] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (still || !inView) return;
    const t = setTimeout(() => {
      if (idx === SCENES.length - 1) setCycle((c) => c + 1);
      setIdx((idx + 1) % SCENES.length);
    }, SCENES[idx].ms);
    return () => clearTimeout(t);
  }, [idx, inView, still]);

  const scene = SCENES[idx].id;

  return (
    <PhoneFrame
      ref={frameRef}
      label="Brokie app preview: it analyses October spending, spots €90 on food delivery, suggests a €55 delivery budget, creates a €150 goal for a Riga trip, and completes a challenge worth 30 XP while the goal shows €10 recorded by the user."
    >
      <div aria-hidden="true" className="absolute inset-0 select-none">
        {still ? (
          <Win still />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={`${cycle}-${scene}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="absolute inset-0">
              {scene !== "win" && scene !== "analyse" && <AppTopBar streak={PROFILE.streak} totalXp={PROFILE.totalXp} level={PROFILE.level} />}
              {render(scene)}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </PhoneFrame>
  );
};

export default PhoneShowcase;
