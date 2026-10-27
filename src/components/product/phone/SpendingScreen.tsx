import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronRight, Pencil } from "lucide-react";
import BudgetEditor, { BudgetSummary } from "./BudgetEditor";
import CategoryDetail from "./CategoryDetail";
import { CATEGORY_ICONS } from "./icons";
import { spendingByCategory, totalIncome, totalSpent, type SpendCategory } from "@/data/transactions";
import { MONTH } from "@/data/november";
import { useGame } from "@/hooks/use-game";

/* This month: the budget, actual vs plan, editable. Opening it counts as today's budget check. */
const BudgetView = ({ live }: { live: boolean }) => {
  const { checkBudget } = useGame();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (live) checkBudget();
  }, [live, checkBudget]);

  return (
    <div>
      <BudgetSummary />
      <div className="flex items-center justify-between mt-3">
        <p className="text-[11px] font-bold text-white/45">Limits are a plan, not savings.</p>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          aria-pressed={editing}
          className={`inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11.5px] font-black ${editing ? "bg-accent text-accent-foreground" : "bg-white/10 hover:bg-white/15"}`}
        >
          {editing ? <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" /> : <Pencil className="w-3 h-3" aria-hidden="true" />}
          {editing ? "Done" : "Edit budget"}
        </button>
      </div>
      <BudgetEditor mode="track" editing={editing} />
    </div>
  );
};

/* Last month: where the money went, each category opens its payments and Brokie's take. */
const OctoberView = () => {
  const still = useReducedMotion() ?? false;
  const cats = useMemo(() => [...spendingByCategory()].sort((a, b) => b.total - a.total), []);
  const total = totalSpent();
  const [open, setOpen] = useState<SpendCategory | null>(null);

  let acc = 0;
  const gradient = cats
    .map((c) => {
      const from = (acc / total) * 360;
      acc += c.total;
      return `${c.color} ${from}deg ${(acc / total) * 360 - 1.5}deg, transparent 0 ${(acc / total) * 360}deg`;
    })
    .join(", ");

  if (open) return <CategoryDetail id={open} locked={false} onBack={() => setOpen(null)} backLabel="October" />;

  return (
    <div>
      <div className="flex items-center gap-5">
        <motion.div
          initial={still ? false : { opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[96px] h-[96px] shrink-0 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
          aria-hidden="true"
        >
          <div className="absolute inset-[12px] rounded-full bg-[hsl(258_42%_10%)]" />
        </motion.div>
        <div>
          <p className="text-[11px] font-extrabold text-white/50">Spent in October</p>
          <p className="text-[24px] font-black tabular leading-tight">€{total.toFixed(2)}</p>
          <p className="text-[11px] font-bold text-white/50 tabular">
            of €{totalIncome().toFixed(0)} · €{(totalIncome() - total).toFixed(2)} left
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-0.5">
        {cats.map((c) => {
          const Icon = CATEGORY_ICONS[c.id];
          return (
            <li key={c.id}>
              <button type="button" onClick={() => setOpen(c.id)} className="w-full flex items-center gap-3 rounded-xl px-2 py-1.5 text-left hover:bg-white/[0.05]">
                <span className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${c.color} 20%, transparent)`, color: c.color }}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="flex-1 text-[12.5px] font-extrabold">{c.label}</span>
                <span className="text-[12.5px] font-black tabular">€{c.total.toFixed(0)}</span>
                <ChevronRight className="w-3.5 h-3.5 text-white/35" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

/* Spending tab: this month's budget, or last month's breakdown. */
const SpendingScreen = ({ live = true }: { live?: boolean }) => {
  const [view, setView] = useState<"budget" | "october">("budget");
  const still = useReducedMotion() ?? false;
  const options = [
    { id: "budget" as const, label: `${MONTH.name} budget` },
    { id: "october" as const, label: "October" },
  ];

  return (
    <div className="px-5 pb-4">
      <div role="radiogroup" aria-label="Spending view" className="grid grid-cols-2 gap-1 rounded-xl bg-white/[0.06] p-1 mb-4">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={view === o.id}
            onClick={() => setView(o.id)}
            className={`h-8 rounded-lg text-[12px] font-black transition-colors ${view === o.id ? "bg-white/15" : "text-white/55 hover:text-white"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={view} initial={still ? { opacity: 0 } : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
          {view === "budget" ? <BudgetView live={live} /> : <OctoberView />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SpendingScreen;
