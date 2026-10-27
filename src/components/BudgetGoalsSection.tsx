import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Minus, PiggyBank, Plus, RotateCcw, Target, Wallet } from "lucide-react";
import { SectionHeader } from "./product/ProductUI";
import { ProgressBar } from "./product/GameUI";
import { CATEGORY_ICONS } from "./product/phone/icons";
import { SUGGESTED_BUDGET, lastMonth, projectedBalance, sumBudget } from "@/data/budget";
import { SITE } from "@/config/site";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;
const GOAL = { name: "Trip to Riga", target: 150, saved: 45 };
const STEP = 5;
/* Already €43 spent on delivery this month, so the preview limit stays above that */
const MIN_DELIVERY = 45;

/* Left: a monthly budget where the delivery limit can be nudged and the projection updates. */
const BudgetPreview = () => {
  const [delivery, setDelivery] = useState(SUGGESTED_BUDGET.delivery);
  const budget = { ...SUGGESTED_BUDGET, delivery };
  const planned = sumBudget(budget);
  const projected = projectedBalance(lastMonth.income, budget);
  const others = planned - delivery;

  return (
    <div className="surface rounded-3xl p-5 sm:p-8 flex flex-col min-w-0">
      <p className="flex items-center gap-2 text-[14px] font-extrabold text-muted-foreground">
        <Wallet className="w-4 h-4" aria-hidden="true" /> Your monthly budget
      </p>

      <dl className="grid grid-cols-3 gap-3 mt-5">
        <div>
          <dt className="text-[12px] font-bold text-muted-foreground">Income</dt>
          <dd className="text-[19px] sm:text-[22px] font-black tabular">{eur(lastMonth.income)}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-bold text-muted-foreground">Planned spending</dt>
          <dd className="text-[19px] sm:text-[22px] font-black tabular">{eur(planned)}</dd>
        </div>
        <div>
          <dt className="text-[12px] font-bold text-muted-foreground">Projected remaining</dt>
          <dd className="text-[19px] sm:text-[22px] font-black tabular text-accent" aria-live="polite">
            {eur(projected)}
          </dd>
        </div>
      </dl>

      <div className="mt-6 rounded-2xl border border-white/10 p-4">
        <div className="flex items-center gap-3">
          <CATEGORY_ICONS.delivery className="w-5 h-5 text-chart-3 shrink-0" strokeWidth={2.25} aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-extrabold">Food delivery</p>
            <p className="text-[13px] font-bold text-muted-foreground tabular flex flex-wrap items-center gap-x-1">
              €{Math.round(lastMonth.byCategory("delivery"))} last month <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" /> €{delivery} planned
            </p>
          </div>
          <div className="flex items-center rounded-full border border-white/15">
            <button type="button" onClick={() => setDelivery((v) => Math.max(MIN_DELIVERY, v - STEP))} disabled={delivery <= MIN_DELIVERY} aria-label={`Lower delivery limit by €${STEP}`} className="w-9 h-9 flex items-center justify-center rounded-l-full hover:bg-white/[0.06] disabled:opacity-30">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-[15px] font-black tabular" aria-hidden="true">
              €{delivery}
            </span>
            <button type="button" onClick={() => setDelivery((v) => Math.min(120, v + STEP))} aria-label={`Raise delivery limit by €${STEP}`} className="w-9 h-9 flex items-center justify-center rounded-r-full hover:bg-white/[0.06]">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="text-[13px] font-bold text-muted-foreground mt-3 tabular">Six other categories, including €290 rent: {eur(others)} planned.</p>

      <p className="mt-auto pt-6 text-[14px] font-semibold text-muted-foreground leading-relaxed">
        A budget is a plan. A lower limit raises what's projected to be left, but it doesn't move any money.
      </p>
    </div>
  );
};

/* Right: the goal, with savings the user records themselves. */
const GoalPreview = () => {
  const [saved, setSaved] = useState(GOAL.saved);
  const pct = Math.round((saved / GOAL.target) * 100);
  const left = GOAL.target - saved;

  return (
    <div className="surface rounded-3xl p-5 sm:p-8 flex flex-col min-w-0">
      <p className="flex items-center gap-2 text-[14px] font-extrabold text-muted-foreground">
        <Target className="w-4 h-4" aria-hidden="true" /> Your goal
      </p>
      <p className="text-[28px] font-black mt-4 leading-tight">{GOAL.name}</p>

      <p className="flex items-baseline justify-between mt-5" aria-live="polite">
        <span className="text-[34px] font-black tabular">{eur(saved)}</span>
        <span className="text-[15px] font-bold text-muted-foreground tabular">of {eur(GOAL.target)}</span>
      </p>
      <ProgressBar value={saved} max={GOAL.target} label={`${GOAL.name}: ${pct}% saved`} className="h-3 mt-2" />
      <p className="flex justify-between text-[14px] font-bold text-muted-foreground mt-2 tabular">
        <span>{pct}% saved</span>
        <span>{left > 0 ? `${eur(left)} remaining` : "Goal reached"}</span>
      </p>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button type="button" onClick={() => setSaved((s) => Math.min(GOAL.target, s + 10))} disabled={left <= 0} className="btn btn-accent h-11 px-5 text-[14px]">
          <PiggyBank className="w-4 h-4" aria-hidden="true" /> Record €10 saved
        </button>
        {saved !== GOAL.saved && (
          <button type="button" onClick={() => setSaved(GOAL.saved)} className="inline-flex items-center gap-1.5 text-[14px] font-extrabold text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" /> Reset
          </button>
        )}
      </div>

      <p className="mt-auto pt-6 text-[14px] font-semibold text-muted-foreground leading-relaxed">
        You record what you've actually set aside. Brokie tracks it, and never holds or transfers money.
      </p>
    </div>
  );
};

const BudgetGoalsSection = () => (
  <section id="budget-goals" className="section">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        label="Budget & goals"
        title="Less guessing. More saving for what matters."
        desc="Brokie helps you turn spending insights into a realistic budget, then connect that budget to something you're working toward."
      />
      <div className="grid lg:grid-cols-2 gap-5">
        <BudgetPreview />
        <GoalPreview />
      </div>
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-[15px] font-semibold text-muted-foreground max-w-2xl">
          Projected remaining and saved are two different numbers: one is what your plan leaves over, the other is what you've put aside for real.
        </p>
        <Link to={SITE.demoPath} className="inline-flex items-center gap-1.5 text-[15px] font-extrabold text-primary-glow hover:text-foreground shrink-0">
          Plan a budget in the demo <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  </section>
);

export default BudgetGoalsSection;
