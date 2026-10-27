import { ChevronRight, Target } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import ChallengeCard from "./ChallengeCard";
import { featuredChallenge } from "./challengeModel";
import { contextualBanners } from "@/data/appNotifications";
import { lastMonth, projectedBalance, sumBudget, thisMonth } from "@/data/budget";
import { MONTH } from "@/data/november";
import { useGame } from "@/hooks/use-game";
import { useTone } from "@/hooks/use-tone";
import type { PhoneTab } from "./tabs";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

/* Overview of the month, the active goal and the challenge Brokie suggests next. */
const HomeScreen = ({ onNavigate }: { onNavigate: (tab: PhoneTab) => void }) => {
  const { state } = useGame();
  const { tone } = useTone();
  const income = thisMonth.income;
  const spent = thisMonth.spent;
  const left = Math.round((income - spent) * 100) / 100;
  const planned = sumBudget(state.budget);
  const projected = projectedBalance(lastMonth.income, state.budget);
  const insight = contextualBanners(state, tone).find((b) => b.id === "delivery-left")!;
  const goal = state.goal;
  const featured = featuredChallenge(state);

  return (
    <div className="px-5 pb-4 space-y-3">
      {/* Brokie's take */}
      <div className="flex items-center gap-3">
        <BrokieMascot mood={insight.mood} size={44} className="shrink-0" title="" />
        <p className="text-[13.5px] font-extrabold leading-snug">{insight.text}</p>
      </div>

      {/* month overview */}
      <button type="button" onClick={() => onNavigate("spending")} className="w-full text-left rounded-2xl bg-white/[0.06] border border-white/10 p-3.5 hover:bg-white/[0.09] transition-colors">
        <span className="flex items-center justify-between text-[11px] font-extrabold text-white/50">
          <span>
            {MONTH.name} · day {MONTH.today} of {MONTH.days}
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
              <span className={`block text-[16px] font-black tabular ${k === "Left" ? "text-accent" : ""}`}>{eur(Math.round(v as number))}</span>
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
          <span>{state.budgetConfirmed ? `On plan: ${eur(projected)} left at month end` : "Plan not set"}</span>
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
