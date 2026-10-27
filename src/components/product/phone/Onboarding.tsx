import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Lock, Shuffle, TrendingDown } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import BudgetEditor, { BudgetSummary } from "./BudgetEditor";
import GoalForm from "./GoalForm";
import { STUDENT_ICONS } from "./icons";
import { BANKS } from "@/data/banks";
import { FEATURED_ID, STUDENTS, catMeta, cohortAverage } from "@/data/students";
import { ONBOARDING_STEPS, useGame, useStudent, type OnboardingStep } from "@/hooks/use-game";
import { useTone } from "@/hooks/use-tone";

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
        goTo("student");
      }}
    >
      <BrokieMascot mood="happy" size={56} title="" />
      <h2 className="text-[24px] font-black leading-tight mt-4">Welcome to Brokie</h2>
      <p className="text-[13px] font-bold text-white/55">Level up out of broke.</p>
      <div className="mt-6 space-y-2.5">
        <label className="block">
          <span className="block text-[11px] font-extrabold text-white/55 mb-1">Email</span>
          <input type="email" defaultValue="you@student.lt" autoComplete="off" className={field} />
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
        <button type="button" onClick={() => goTo("student")} className="w-full h-11 rounded-xl border border-white/20 text-[14px] font-black">
          Log in
        </button>
        <Note>Demo: no account is created and nothing is sent.</Note>
      </div>
    </form>
  );
};

/* 2. Pick whose money the demo runs on: one of the 40 students in the dataset */
const LIVING = ["All", "With parents", "Dorm", "Shared flat", "Alone / with partner"];

const StudentStep = () => {
  const { pickStudent } = useGame();
  const { setTone } = useTone();
  const [living, setLiving] = useState("All");
  const list = [...STUDENTS]
    .filter((s) => living === "All" || s.living === living)
    .sort((a, b) => (a.id === FEATURED_ID ? -1 : b.id === FEATURED_ID ? 1 : 0));

  const pick = (id: string) => {
    const s = STUDENTS.find((x) => x.id === id)!;
    setTone(s.tone); // the tone each student chose in the dataset
    pickStudent(id);
  };

  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-[22px] font-black leading-tight">Pick a student</h2>
      <p className="text-[12.5px] font-bold text-white/55 mt-1">{STUDENTS.length} real profiles from the Brokie dataset. Every number in the app comes from theirs.</p>
      <div role="radiogroup" aria-label="Living situation" className="flex gap-1.5 overflow-x-auto no-scrollbar mt-3 -mx-1 px-1">
        {LIVING.map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            aria-checked={living === l}
            onClick={() => setLiving(l)}
            className={`shrink-0 h-7 px-2.5 rounded-full text-[11px] font-extrabold ${living === l ? "bg-accent text-accent-foreground" : "bg-white/[0.08] text-white/70 hover:text-white"}`}
          >
            {l === "Alone / with partner" ? "Alone" : l}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => pick(list[Math.floor(Math.random() * list.length)].id)}
        className="mt-3 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border border-white/20 text-[12.5px] font-black hover:bg-white/[0.05]"
      >
        <Shuffle className="w-3.5 h-3.5" aria-hidden="true" /> Surprise me
      </button>
      <ul className="mt-2 divide-y divide-white/[0.07]">
        {list.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => pick(s.id)} className="w-full flex items-center gap-3 py-2.5 text-left">
              <span className="w-9 h-9 shrink-0 rounded-full bg-primary/30 flex items-center justify-center text-[13px] font-black" aria-hidden="true">
                {s.name[0]}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex items-center gap-1.5 text-[13.5px] font-extrabold">
                  {s.name}, {s.age}
                  {s.id === FEATURED_ID && <span className="rounded-full bg-accent/20 text-accent px-1.5 text-[9.5px] font-black">Suggested</span>}
                </span>
                <span className="block text-[11px] font-bold text-white/50 truncate">
                  {s.uniShort} · year {s.studyYear} · {s.living === "Alone / with partner" ? "lives alone" : s.living.toLowerCase()}
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className="block text-[12.5px] font-black tabular">€{Math.round(s.income.total)}</span>
                <span className="block text-[10px] font-bold text-white/40">a month</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-white/35 shrink-0" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* 3. Connect banks (simulated, read-only) */
const BanksStep = () => {
  const { state, toggleBank, goTo } = useGame();
  const n = state.banks.length;
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-[22px] font-black leading-tight">Connect your bank</h2>
      <p className="text-[12.5px] font-bold text-white/55 mt-1 flex items-start gap-1.5">
        <Lock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Brokie never holds your money. Every transfer is confirmed by you in your bank.
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
        <Note>Demo connection. Transactions come from the Brokie student dataset.</Note>
      </div>
    </div>
  );
};

/* 4. Analysing (auto-advances) */
const AnalyzingStep = () => {
  const { goTo } = useGame();
  const m = useStudent();
  const still = useReducedMotion() ?? false;
  useEffect(() => {
    const t = setTimeout(() => goTo("results"), 2600);
    return () => clearTimeout(t);
  }, [goTo]);
  const lines = [`${m.student.tx.filter((t) => t.month === 1).length} transactions found`, `Sorted into ${m.categories.length} categories`, "Spotted 1 habit to work on"];
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

/* 5. What Brokie found */
const ResultsStep = () => {
  const { goTo } = useGame();
  const m = useStudent();
  const h = m.history;
  const top = m.categories
    .map((id) => ({ ...catMeta(id), total: h.byCategory(id) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);
  const max = top[0].total;
  const left = Math.round((m.income - h.spent) * 100) / 100;
  const focus = catMeta(m.focus);
  const focusTotal = h.byCategory(m.focus);
  const own = m.ownBudget(m.focus);
  const peers = cohortAverage(m.focus, m.student.living);
  return (
    <div className="flex flex-col flex-1">
      <h2 className="text-[22px] font-black leading-tight">{m.student.name}'s October</h2>
      <p className="text-[12px] font-bold text-white/50 mt-0.5">
        {m.student.uniShort} · {m.student.city} · {m.student.bank}
      </p>
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        {[
          ["In", Math.round(m.income)],
          ["Out", Math.round(h.spent)],
          ["Left", Math.round(left)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-white/[0.06] py-2.5">
            <p className="text-[10.5px] font-extrabold text-white/50">{k}</p>
            <p className={`text-[15px] font-black tabular ${k === "Left" ? (left >= 0 ? "text-accent" : "text-destructive") : ""}`}>
              {(v as number) < 0 ? "−" : ""}
              {eur(Math.abs(v as number))}
            </p>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {top.map((c) => {
          const Icon = STUDENT_ICONS[c.id];
          return (
            <li key={c.id} className="flex items-center gap-2.5">
              <Icon className="w-4 h-4 shrink-0" style={{ color: c.color }} strokeWidth={2.5} aria-hidden="true" />
              <span className="w-28 text-[12px] font-extrabold leading-tight">{c.label}</span>
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
            {focus.label}: {eur(Math.round(focusTotal))} in October.{" "}
            {own != null && focusTotal > own ? `That's ${eur(Math.round(focusTotal - own))} over the ${eur(own)} you set yourself.` : `Students with the same living situation average ${eur(peers)}.`}
          </p>
          {left < 0 && <p className="text-[12px] font-bold text-white/70 mt-1">October cost {eur(Math.round(-left))} more than came in. The plan starts there.</p>}
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
      <p className="text-[12.5px] font-bold text-white/55 mt-1">Built from your own limits and the last two months. Change any of them.</p>
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
  const { student } = useStudent();
  const fromDataset = { name: student.goal.name, target: student.goal.target, saved: student.goal.saved, date: student.goal.date ?? undefined };
  return (
    <div>
      <BrokieMascot mood="proud" size={48} title="" />
      <h2 className="text-[22px] font-black leading-tight mt-3">Save for something</h2>
      <p className="text-[12.5px] font-bold text-white/55 mt-1 mb-4">A goal makes the plan worth it. This is {student.name}'s goal from the dataset.</p>
      <GoalForm
        initial={state.goal ?? fromDataset}
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
  student: StudentStep,
  banks: BanksStep,
  analyzing: AnalyzingStep,
  results: ResultsStep,
  budget: BudgetStep,
  goal: GoalStep,
};

const BACK: Partial<Record<OnboardingStep, OnboardingStep>> = { student: "auth", banks: "student", results: "banks", budget: "results", goal: "budget" };

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
