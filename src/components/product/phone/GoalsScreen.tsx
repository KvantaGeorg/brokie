import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import ChallengeCard from "./ChallengeCard";
import GoalForm from "./GoalForm";
import { challengeViews } from "./challengeModel";
import { useGame, type Goal } from "@/hooks/use-game";
import type { PhoneTab } from "./tabs";

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
  const { addToGoal, saveGoal } = useGame();
  const [editing, setEditing] = useState(false);
  const [custom, setCustom] = useState("");
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
    <div className="rounded-2xl bg-primary/15 border border-primary/35 p-3.5">
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

      <p className="text-[11px] font-extrabold text-white/55 mt-3 mb-1.5">Record money you set aside</p>
      <div className="flex gap-2">
        {[5, 10].map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => addToGoal(v)}
            className="h-9 px-3 rounded-xl bg-accent text-accent-foreground text-[13px] font-black shadow-[0_2px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none"
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
      <p className="text-[10.5px] font-bold text-white/40 mt-2">You record it, Brokie tracks it. No money is moved or held.</p>
    </div>
  );
};

/* Goals tab: the goal, the challenges tied to it and the budget, and what's done. */
const GoalsScreen = ({ onNavigate }: { onNavigate: (tab: PhoneTab) => void }) => {
  const { state, saveGoal } = useGame();
  const views = challengeViews(state);
  const active = views.filter((c) => c.status === "active");
  const finished = views.filter((c) => c.status !== "active");

  return (
    <div className="px-5 pb-4">
      {state.goal ? (
        <GoalCard goal={state.goal} />
      ) : (
        <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">
          <h2 className="text-[19px] font-black leading-tight mb-3">Save for something</h2>
          <GoalForm submitLabel="Create goal" onSubmit={saveGoal} />
        </div>
      )}

      {state.contributions.length > 0 && (
        <>
          <h3 className="text-[11px] font-extrabold text-white/50 mt-4 mb-1">Recorded by you</h3>
          <ul className="divide-y divide-white/[0.07]">
            {state.contributions.slice(0, 4).map((c) => (
              <li key={c.id} className="flex justify-between py-1.5 text-[12px] font-bold">
                <span className="text-white/70">Set aside · demo day {c.day + 1}</span>
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
