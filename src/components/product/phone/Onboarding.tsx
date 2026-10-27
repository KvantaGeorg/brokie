import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, Lock, TrendingDown } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import BudgetEditor, { BudgetSummary } from "./BudgetEditor";
import GoalForm from "./GoalForm";
import { CATEGORY_ICONS } from "./icons";
import { BANKS } from "@/data/banks";
import { lastMonth } from "@/data/budget";
import { CATEGORIES, TRANSACTIONS, spendingByCategory, weeklyTotals } from "@/data/transactions";
import { ONBOARDING_STEPS, useGame, type OnboardingStep } from "@/hooks/use-game";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

const PrimaryButton = ({ children, onClick, disabled }: { children: string; onClick: () => void; disabled?: boolean }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full h-11 rounded-xl bg-accent text-accent-foreground text-[14px] font-black shadow-[0_3px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none transition-transform disabled:bg-white/10 disabled:text-white/40 disabled:shadow-none"
  >
    {children}
  </button>
);

const Note = ({ children }: { children: string }) => <p className="text-[11px] font-bold text-white/45 text-center">{children}</p>;

/* 1. Sign up (simulated) */
const AuthStep = () => {
  const { goTo } = useGame();
  const field = "w-full h-11 rounded-xl bg-white/[0.07] border border-white/10 px-3 text-[14px] font-bold focus:outline-none focus:border-accent";
  return (
    <form
      className="flex flex-col flex-1"
      onSubmit={(e) => {
        e.preventDefault();
        goTo("banks");
      }}
    >
      <BrokieMascot mood="happy" size={56} title="" />
      <h2 className="text-[24px] font-black leading-tight mt-4">Welcome to Brokie</h2>
      <p className="text-[13px] font-bold text-white/55">Level up out of broke.</p>
      <div className="mt-6 space-y-2.5">
        <label className="block">
          <span className="block text-[11px] font-extrabold text-white/55 mb-1">Email</span>
          <input type="email" defaultValue="ruta@stud.vu.lt" autoComplete="off" className={field} />
        </label>
        <label className="block">
          <span className="block text-[11px] font-extrabold text-white/55 mb-1">Password</span>
          <input type="password" defaultValue="demo-only" autoComplete="off" className={field} />
        </label>
      </div>
      <div className="mt-auto space-y-2.5 pt-6">
        <button type="submit" className="w-full h-11 rounded-xl bg-accent text-accent-foreground text-[14px] font-black shadow-[0_3px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none">
          Create account
        </button>
        <button type="button" onClick={() => goTo("banks")} className="w-full h-11 rounded-xl border border-white/20 text-[14px] font-black">
          Log in
        </button>
        <Note>Demo: no account is created and nothing is sent.</Note>
      </div>
    </form>
  );
};

/* 2. Connect banks (simulated, read-only) */
const BanksStep = () => {
  const { state, toggleBank, goTo } = useGame();
  const n = state.banks.length;
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-[22px] font-black leading-tight">Connect your bank</h2>
      <p className="text-[12.5px] font-bold text-white/55 mt-1 flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5" aria-hidden="true" /> Read-only. Brokie never moves money.
      </p>
      <ul className="mt-4 divide-y divide-white/[0.07]">
        {BANKS.map((b) => {
          const on = state.banks.includes(b.id);
          return (
            <li key={b.id}>
              <button type="button" aria-pressed={on} onClick={() => toggleBank(b.id)} className="w-full flex items-center gap-3 py-2.5 text-left">
                <span className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[12px] font-black text-white/80" aria-hidden="true">
                  {b.name.slice(0, 2)}
                </span>
                <span className="flex-1 text-[14px] font-extrabold">{b.name}</span>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${on ? "bg-accent border-accent text-accent-foreground" : "border-white/25"}`}>
                  {on && <Check className="w-3.5 h-3.5" strokeWidth={4} aria-hidden="true" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-auto space-y-2 pt-4">
        <PrimaryButton onClick={() => goTo("analyzing")} disabled={!n}>
          {n ? `Connect ${n} bank${n > 1 ? "s" : ""}` : "Choose a bank"}
        </PrimaryButton>
        <Note>Simulated connection. The demo uses mock transactions.</Note>
      </div>
    </div>
  );
};

/* 3. Analysing (auto-advances) */
const AnalyzingStep = () => {
  const { goTo } = useGame();
  const still = useReducedMotion() ?? false;
  useEffect(() => {
    const t = setTimeout(() => goTo("results"), 2600);
    return () => clearTimeout(t);
  }, [goTo]);
  const lines = [`${TRANSACTIONS.length} transactions found`, `Sorted into ${CATEGORIES.length} categories`, "Spotted 1 habit to beat"];
  return (
    <div className="flex flex-col items-center justify-center flex-1 text-center" role="status">
      <div style={{ perspective: 600 }}>
        <motion.div animate={still ? {} : { rotateY: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <BrokieMascot mood="watching" size={88} title="" />
        </motion.div>
      </div>
      <p className="mt-6 text-[19px] font-black">Analysing your October</p>
      <ul className="mt-4 space-y-2 text-left">
        {lines.map((l, i) => (
          <motion.li key={l} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.6 }} className="flex items-center gap-2 text-[13px] font-bold text-white/80">
            <span className="w-4 h-4 rounded-full bg-chart-2 flex items-center justify-center">
              <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} aria-hidden="true" />
            </span>
            {l}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

/* 4. What Brokie found */
const ResultsStep = () => {
  const { goTo } = useGame();
  const top = [...spendingByCategory()].sort((a, b) => b.total - a.total).slice(0, 4);
  const max = top[0].total;
  const weeks = weeklyTotals("delivery");
  const avg = weeks.reduce((a, b) => a + b, 0) / weeks.length;
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-[22px] font-black leading-tight">Your October</h2>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        {[
          ["In", lastMonth.income],
          ["Out", lastMonth.spent],
          ["Left", Math.round((lastMonth.income - lastMonth.spent) * 100) / 100],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/[0.06] py-2.5">
            <p className="text-[10.5px] font-extrabold text-white/50">{k}</p>
            <p className={`text-[15px] font-black tabular ${k === "Left" ? "text-accent" : ""}`}>{eur(v as number)}</p>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {top.map((c) => {
          const Icon = CATEGORY_ICONS[c.id];
          return (
            <li key={c.id} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0" style={{ color: c.color }} strokeWidth={2.5} aria-hidden="true" />
              <span className="w-24 text-[12px] font-extrabold">{c.label}</span>
              <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <span className="block h-full rounded-full" style={{ width: `${(c.total / max) * 100}%`, background: c.color }} />
              </span>
              <span className="w-12 text-right text-[12px] font-black tabular">€{c.total.toFixed(0)}</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 rounded-2xl bg-primary/20 border border-primary/40 p-3.5 flex gap-3">
        <BrokieMascot mood="shocked" size={40} className="shrink-0" title="" />
        <div>
          <p className="flex items-center gap-1.5 text-[11px] font-black text-accent">
            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" /> Biggest opportunity
          </p>
          <p className="text-[13px] font-extrabold leading-snug mt-0.5">
            Food delivery: {eur(lastMonth.byCategory("delivery"))}. The last week alone was {(weeks[3] / avg).toFixed(1)}x your weekly average.
          </p>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <PrimaryButton onClick={() => goTo("budget")}>Plan November</PrimaryButton>
      </div>
    </div>
  );
};

/* 5. Suggested budget, editable */
const BudgetStep = () => {
  const { goTo, confirmBudget, resetBudget } = useGame();
  return (
    <div>
      <h2 className="text-[22px] font-black leading-tight">Your November plan</h2>
      <p className="text-[12.5px] font-bold text-white/55 mt-1">Suggested from October. Change any limit.</p>
      <div className="mt-4">
        <BudgetSummary compareLastMonth />
      </div>
      <BudgetEditor mode="plan" />
      <p className="text-[11px] font-bold text-white/45 mt-3">A budget is a plan for what you'll spend. It doesn't move or save money on its own.</p>
      <div className="space-y-2 pt-4">
        <PrimaryButton
          onClick={() => {
            confirmBudget();
            goTo("goal");
          }}
        >
          Confirm budget
        </PrimaryButton>
        <button type="button" onClick={resetBudget} className="w-full h-9 text-[12.5px] font-extrabold text-white/55 hover:text-white">
          Reset to suggestion
        </button>
      </div>
    </div>
  );
};

/* 6. Savings goal */
const GoalStep = () => {
  const { state, saveGoal, goTo } = useGame();
  return (
    <div>
      <BrokieMascot mood="proud" size={48} title="" />
      <h2 className="text-[22px] font-black leading-tight mt-3">Save for something</h2>
      <p className="text-[12.5px] font-bold text-white/55 mt-1 mb-4">A goal makes the plan worth it.</p>
      <GoalForm
        initial={state.goal ?? undefined}
        submitLabel={state.goal ? "Save goal" : "Create goal"}
        onSubmit={(g) => {
          saveGoal(g);
          goTo("done");
        }}
        onSecondary={() => goTo("done")}
        secondaryLabel="Skip for now"
      />
    </div>
  );
};

const STEP_VIEW: Record<Exclude<OnboardingStep, "done">, () => JSX.Element> = {
  auth: AuthStep,
  banks: BanksStep,
  analyzing: AnalyzingStep,
  results: ResultsStep,
  budget: BudgetStep,
  goal: GoalStep,
};

const BACK: Partial<Record<OnboardingStep, OnboardingStep>> = { banks: "auth", results: "banks", budget: "results", goal: "budget" };

/* Interactive first run inside the demo phone: sign up → connect bank → analysis → budget → goal. */
const Onboarding = () => {
  const { state, goTo } = useGame();
  const still = useReducedMotion() ?? false;
  const scrollRef = useRef<HTMLDivElement>(null);
  const step = state.step as Exclude<OnboardingStep, "done">;
  const View = STEP_VIEW[step];
  const back = BACK[step];
  const idx = ONBOARDING_STEPS.indexOf(step);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step]);

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center justify-between px-5 pt-11 pb-2 h-[76px]">
        {back ? (
          <button type="button" onClick={() => goTo(back)} className="inline-flex items-center -ml-1.5 rounded-lg px-1.5 py-1 text-[12px] font-extrabold text-white/60 hover:text-white">
            <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Back
          </button>
        ) : (
          <span />
        )}
        <span className="flex gap-1" aria-label={`Step ${idx + 1} of ${ONBOARDING_STEPS.length - 1}`}>
          {ONBOARDING_STEPS.slice(0, -1).map((s, i) => (
            <span key={s} className={`h-1.5 rounded-full transition-all ${i === idx ? "w-4 bg-accent" : i < idx ? "w-1.5 bg-accent/60" : "w-1.5 bg-white/20"}`} />
          ))}
        </span>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain no-scrollbar px-6 pb-6">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={still ? { opacity: 0 } : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={still ? { opacity: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-full flex flex-col pt-2"
          >
            <View />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
