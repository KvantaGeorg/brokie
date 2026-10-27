import { ChevronRight, CircleHelp, PiggyBank, Sparkles, Target } from "lucide-react";
import { ProgressBar } from "../GameUI";
import ChallengeCard from "./ChallengeCard";
import { featuredChallenge } from "./challengeModel";
import { sumBudget } from "@/data/students";
import { movedToSavings, useGame, useStudent } from "@/hooks/use-game";
import type { PhoneTab } from "./tabs";
import { useOpenSheet } from "./sheets";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

/* Overview of the month, the active goal and the challenge Brokie suggests next. */
const HomeScreen = ({ onNavigate }: { onNavigate: (tab: PhoneTab) => void }) => {
  const open = useOpenSheet();
  const { state } = useGame();
  const m = useStudent();
  const income = m.income;
  const spent = m.current.spent;
  const moved = movedToSavings(state);
  const left = Math.round((income - spent - moved) * 100) / 100;
  const planned = sumBudget(state.budget);
  const projected = m.projected(state.budget) - moved;
  const goal = state.goal;
  const featured = featuredChallenge(state);

  return (
    <div className="px-5 pb-4 space-y-3">
      {/* quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => open({ kind: "afford" })} className="flex items-center gap-2 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.09] px-3 py-2.5 text-left">
          <CircleHelp className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-[12.5px] font-black leading-tight">Can I afford it?</span>
        </button>
        <button type="button" onClick={() => (state.goal ? open({ kind: "savings" }) : onNavigate("goals"))} className="flex items-center gap-2 rounded-2xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.09] px-3 py-2.5 text-left">
          <PiggyBank className="w-4 h-4 shrink-0 text-accent" aria-hidden="true" />
          <span className="text-[12.5px] font-black leading-tight">Move to savings</span>
        </button>
      </div>

      {/* October, wrapped */}
      <button
        type="button"
        onClick={() => open({ kind: "wrapped" })}
        className="w-full flex items-center gap-3 rounded-2xl p-3.5 text-left bg-[linear-gradient(120deg,hsl(262_83%_55%),hsl(330_75%_50%))] hover:brightness-110 transition"
      >
        <Sparkles className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="flex-1">
          <span className="block text-[14px] font-black leading-tight">Your {m.history.name}, wrapped</span>
          <span className="block text-[11.5px] font-bold text-white/80">Your month in money, story style</span>
        </span>
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* month overview */}
      <button type="button" onClick={() => onNavigate("spending")} className="w-full text-left rounded-2xl bg-white/[0.06] border border-white/10 p-3.5 hover:bg-white/[0.09] transition-colors">
        <span className="flex items-center justify-between text-[11px] font-extrabold text-white/50">
          <span>
            {m.current.name} · day {m.current.today} of {m.current.days}
          </span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        <span className="grid grid-cols-3 gap-2 mt-2">
          {[
            ["Income", income],
            ["Spent", spent],
            ["Left", left],
          ].map(([k, v]) => (
            <span key={k as string}>
              <span className="block text-[10.5px] font-extrabold text-white/50">{k}</span>
              <span className={`block text-[16px] font-black tabular ${k === "Left" ? ((v as number) >= 0 ? "text-accent" : "text-destructive") : ""}`}>
                {(v as number) < 0 ? "−" : ""}
                {eur(Math.abs(Math.round(v as number)))}
              </span>
            </span>
          ))}
        </span>
        <span className="block mt-3">
          <ProgressBar value={spent} max={planned} label="Spent so far against this month's plan" className="h-2" />
        </span>
        <span className="flex justify-between mt-1.5 text-[11px] font-bold text-white/55 tabular">
          <span>
            {eur(Math.round(spent))} of {eur(planned)} planned
          </span>
          <span>{!state.budgetConfirmed ? "Plan not set" : projected >= 0 ? `On plan: ${eur(Math.round(projected))} left at month end` : `On plan: ${eur(Math.round(-projected))} short at month end`}</span>
        </span>
      </button>

      {/* goal */}
      <button type="button" onClick={() => onNavigate("goals")} className="w-full text-left rounded-2xl bg-white/[0.06] border border-white/10 p-3.5 hover:bg-white/[0.09] transition-colors">
        <span className="flex items-center justify-between text-[11px] font-extrabold text-white/50">
          <span className="inline-flex items-center gap-1">
            <Target className="w-3.5 h-3.5" aria-hidden="true" /> Savings goal
          </span>
          <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </span>
        {goal ? (
          <>
            <span className="flex items-baseline justify-between mt-1">
              <span className="text-[14px] font-black">{goal.name}</span>
              <span className="text-[12px] font-black tabular">
                {eur(goal.saved)} <span className="text-white/45">/ {eur(goal.target)}</span>
              </span>
            </span>
            <ProgressBar value={goal.saved} max={goal.target} label={`${goal.name} progress`} className="h-2 mt-2" />
          </>
        ) : (
          <span className="block text-[13.5px] font-extrabold mt-1">Save for something: set a goal</span>
        )}
      </button>

      {/* featured challenge */}
      <div>
        <h3 className="text-[11px] font-extrabold text-white/50 mb-1.5">Brokie suggests</h3>
        <ChallengeCard c={featured} onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default HomeScreen;
