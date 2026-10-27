import { forwardRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Pencil, PiggyBank, Plus } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import ChallengeCard from "./ChallengeCard";
import GoalForm from "./GoalForm";
import { challengeViews } from "./challengeModel";
import { useGame, useStudent, type Goal } from "@/hooks/use-game";
import type { PhoneTab } from "./tabs";
import { useOpenSheet } from "./sheets";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const cheer = (g: Goal) => {
  const pct = g.saved / g.target;
  if (pct >= 1) return "Goal reached! Brokie is doing a little coin spin.";
  if (pct >= 0.5) return `Over halfway to ${g.name}. Keep it going.`;
  if (pct >= 0.25) return "A solid start. Small amounts add up.";
  return "Every euro counts. Start small, keep going.";
};

/* The active goal: progress, manual top-ups and an edit form. Nothing here moves real money. */
const GoalCard = ({ goal }: { goal: Goal }) => {
  const { state, addToGoal, saveGoal } = useGame();
  const open = useOpenSheet();
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState("");
  const [recordOpen, setRecordOpen] = useState(false);
  const pct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
  const toGo = Math.max(0, Math.round((goal.target - goal.saved) * 100) / 100);

  if (editing)
    return (
      <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">
        <GoalForm
          initial={goal}
          submitLabel="Save changes"
          onSubmit={(g) => {
            saveGoal(g);
            setEditing(false);
          }}
          onSecondary={() => setEditing(false)}
          secondaryLabel="Cancel"
        />
      </div>
    );

  const addCustom = (e: FormEvent) => {
    e.preventDefault();
    const v = Number(custom.replace(",", "."));
    if (Number.isFinite(v) && v > 0) {
      addToGoal(Math.round(v * 100) / 100);
      setCustom("");
    }
  };

  return (
    <div className="rounded-2xl bg-[hsl(262_40%_19%)] border border-primary/35 p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] font-extrabold text-white/55">Saving for</p>
          <h2 className="text-[19px] font-black leading-tight truncate">{goal.name}</h2>
          {goal.date && <p className="text-[11px] font-bold text-white/50">by {fmtDate(goal.date)}</p>}
        </div>
        <button type="button" onClick={() => setEditing(true)} aria-label="Edit goal" className="w-8 h-8 shrink-0 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center">
          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <motion.span key={goal.saved} initial={{ scale: 1.15 }} animate={{ scale: 1 }} className="text-[26px] font-black tabular origin-left">
          {eur(goal.saved)}
        </motion.span>
        <span className="text-[12px] font-extrabold text-white/55 tabular">of {eur(goal.target)}</span>
      </div>
      <ProgressBar value={goal.saved} max={goal.target} label={`${goal.name}: ${pct}% saved`} className="h-3 mt-1.5" />
      <p className="flex justify-between text-[11.5px] font-bold text-white/60 mt-1.5 tabular">
        <span>{pct}%</span>
        <span>{toGo ? `${eur(toGo)} to go` : "Done"}</span>
      </p>

      <div className="flex gap-2.5 items-center mt-3 rounded-xl bg-white/[0.06] p-2.5">
        <BrokieMascot mood={pct >= 50 ? "proud" : "happy"} size={30} className="shrink-0" title="" />
        <p className="text-[12px] font-bold leading-snug">{cheer(goal)}</p>
      </div>

      <button
        type="button"
        onClick={() => open({ kind: "savings" })}
        className="mt-3 w-full h-11 rounded-xl bg-accent text-accent-foreground text-[14px] font-black shadow-[0_3px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none inline-flex items-center justify-center gap-2"
      >
        <PiggyBank className="w-4 h-4" aria-hidden="true" /> Move to savings
      </button>

      <button
        type="button"
        onClick={() => setRecordOpen((o) => !o)}
        aria-expanded={recordOpen}
        className="mt-3 w-full flex items-center justify-between rounded-lg px-1 py-1 text-[11.5px] font-extrabold text-white/60 hover:text-white"
      >
        Saved somewhere else? Record it
        <ChevronDown className={`w-4 h-4 transition-transform ${recordOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {recordOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="flex gap-2 pt-1.5">
              {[5, 10].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => addToGoal(v)}
                  className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-[13px] font-black"
                >
                  +€{v}
                </button>
              ))}
              <form onSubmit={addCustom} className="flex-1 flex rounded-xl bg-white/[0.08] overflow-hidden">
                <label className="flex-1 flex items-center pl-2.5">
                  <span className="sr-only">Other amount in euros</span>
                  <span className="text-[12px] font-black text-white/45" aria-hidden="true">
                    €
                  </span>
                  <input value={custom} onChange={(e) => setCustom(e.target.value)} inputMode="decimal" placeholder="Other" className="w-full bg-transparent px-1 text-[13px] font-bold tabular focus:outline-none placeholder:text-white/35" />
                </label>
                <button type="submit" aria-label="Record other amount" className="w-9 flex items-center justify-center hover:bg-white/10">
                  <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <p className="text-[9px] font-bold text-white/35 mt-1.5 leading-snug">Brokie never holds your money. Every transfer is confirmed by you in your bank.</p>
    </div>
  );
};

/* Ready-made goals for one-tap adding */
const GOAL_IDEAS: Goal[] = [
  { name: "Emergency fund", target: 300, saved: 0 },
  { name: "New laptop", target: 600, saved: 0 },
  { name: "Summer trip", target: 400, saved: 0 },
  { name: "Concert tickets", target: 80, saved: 0 },
];

/* The top card of the stack: drag it sideways, Tinder style, to bring the next goal forward. */
// forwardRef: AnimatePresence "popLayout" measures the leaving card through its ref
const SwipeCard = forwardRef<HTMLDivElement, { goal: Goal; canSwipe: boolean; onSwipe: (dir: 1 | -1) => void }>(({ goal, canSwipe, onSwipe }, ref) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);
  return (
    <motion.div
      ref={ref}
      style={{ x, rotate }}
      drag={canSwipe ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 600) onSwipe(info.offset.x < 0 ? 1 : -1);
      }}
      variants={{
        exit: (dir: 1 | -1) => ({ x: dir === 1 ? -340 : 340, opacity: 0, rotate: dir === 1 ? -18 : 18, transition: { duration: 0.25 } }),
      }}
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit="exit"
      className={`relative z-10 ${canSwipe ? "cursor-grab active:cursor-grabbing" : ""}`}
    >
      <GoalCard goal={goal} />
    </motion.div>
  );
});
SwipeCard.displayName = "SwipeCard";

/* Goals as a stack: the active one on top, the others peeking out behind it. */
const GoalStack = () => {
  const { state, cycleGoal, addGoal } = useGame();
  const still = useReducedMotion() ?? false;
  const [adding, setAdding] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const swipe = (d: 1 | -1) => {
    setDir(d);
    cycleGoal(d);
  };
  const all = [state.goal!, ...state.moreGoals];
  const behind = state.moreGoals.slice(0, 2);
  const ideas = GOAL_IDEAS.filter((g) => !all.some((x) => x.name === g.name));

  if (adding)
    return (
      <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">
        <h2 className="text-[17px] font-black leading-tight">Add a goal</h2>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {ideas.map((g) => (
            <button
              key={g.name}
              type="button"
              onClick={() => {
                addGoal(g);
                setAdding(false);
              }}
              className="h-8 px-3 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-[12px] font-extrabold"
            >
              {g.name} · €{g.target}
            </button>
          ))}
        </div>
        <p className="text-[11px] font-extrabold text-white/50 mt-4 mb-2">Or your own</p>
        <GoalForm
          initial={{ name: "", target: 100, saved: 0 }}
          submitLabel="Add goal"
          onSubmit={(g) => {
            addGoal(g);
            setAdding(false);
          }}
          onSecondary={() => setAdding(false)}
          secondaryLabel="Cancel"
        />
      </div>
    );

  return (
    <div>
      <div className="relative" style={{ paddingBottom: behind.length * 10 }}>
        {/* cards waiting behind the active one */}
        {behind.map((g, i) => (
          <div
            key={g.name}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 rounded-2xl border border-primary/25 bg-[hsl(258_38%_16%)] px-3.5 pt-3"
            style={{ bottom: behind.length * 10 - (i + 1) * 10, transform: `scale(${1 - (i + 1) * 0.05})`, transformOrigin: "bottom center", zIndex: 5 - i }}
          >
            <p className="text-[12px] font-black text-white/50">{g.name}</p>
          </div>
        ))}
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <SwipeCard key={state.goal!.name} goal={state.goal!} canSwipe={!still && all.length > 1} onSwipe={swipe} />
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between mt-3">
        {all.length > 1 ? (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => swipe(-1)} aria-label="Previous goal" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <span className="text-[11.5px] font-extrabold text-white/55 px-1.5 tabular whitespace-nowrap">{all.length} goals</span>
            <button type="button" onClick={() => swipe(1)} aria-label="Next goal" className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/15 flex items-center justify-center">
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <span className="text-[11.5px] font-bold text-white/45">Saving for more than one thing?</span>
        )}
        <button type="button" onClick={() => setAdding(true)} className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-[12px] font-black whitespace-nowrap shrink-0">
          <Plus className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" /> Add goal
        </button>
      </div>
    </div>
  );
};

/* Goals tab: the goal stack, what was added, the challenges tied to it, and what's done. */
const GoalsScreen = ({ onNavigate }: { onNavigate: (tab: PhoneTab) => void }) => {
  const { state, saveGoal } = useGame();
  const { student } = useStudent();
  const views = challengeViews(state);
  const active = views.filter((c) => c.status === "active");
  const finished = views.filter((c) => c.status !== "active");
  const added = state.contributions.filter((c) => !c.goal || c.goal === state.goal?.name);

  return (
    <div className="px-5 pb-4">
      {state.goal ? (
        <GoalStack />
      ) : (
        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">
          <h2 className="text-[19px] font-black leading-tight mb-3">Save for something</h2>
          <GoalForm initial={{ name: student.goal.name, target: student.goal.target, saved: student.goal.saved, date: student.goal.date ?? undefined }} submitLabel="Create goal" onSubmit={saveGoal} />
        </div>
      )}

      {added.length > 0 && (
        <>
          <h3 className="text-[11px] font-extrabold text-white/50 mt-4 mb-1">Added to {state.goal?.name}</h3>
          <ul className="divide-y divide-white/[0.07]">
            {added.slice(0, 4).map((c) => (
              <li key={c.id} className="flex justify-between py-1.5 text-[12px] font-bold">
                <span className="text-white/70">
                  {c.source === "bank" ? "Moved to savings, confirmed by your bank" : "Recorded by you"} · day {c.day + 1}
                </span>
                <span className="tabular text-accent">+{eur(c.amount)}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-2">Challenges</h3>
      <div className="space-y-2">
        {active.map((c) => (
          <ChallengeCard key={c.id} c={c} onNavigate={onNavigate} />
        ))}
        {!active.length && <p className="rounded-2xl bg-white/[0.04] p-4 text-center text-[12.5px] font-extrabold text-white/70">All challenges finished. Brokie is proud of you.</p>}
      </div>

      {finished.length > 0 && (
        <>
          <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-2">Finished</h3>
          <div className="space-y-2">
            {finished.map((c) => (
              <ChallengeCard key={c.id} c={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GoalsScreen;
