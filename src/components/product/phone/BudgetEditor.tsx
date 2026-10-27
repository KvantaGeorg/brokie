import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Lock, Minus, Plus } from "lucide-react";
import { STUDENT_ICONS } from "./icons";
import { catMeta, sumBudget, type Cat } from "@/data/students";
import { useGame, useStudent } from "@/hooks/use-game";

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;
const day = (d: number) => `${d} Nov`;
const STEP = 5;

const Stepper = ({ cat, label }: { cat: Cat; label: string }) => {
  const { state, setLimit } = useGame();
  const value = state.budget[cat];
  return (
    <span className="inline-flex items-center rounded-lg bg-white/[0.08]">
      <button type="button" onClick={() => setLimit(cat, value - STEP)} disabled={value <= 0} aria-label={`Lower ${label} limit by €${STEP}`} className="w-7 h-7 flex items-center justify-center rounded-l-lg hover:bg-white/10 disabled:opacity-30">
        <Minus className="w-3.5 h-3.5" strokeWidth={3} />
      </button>
      <label className="flex items-center">
        <span className="sr-only">{label} monthly limit in euros</span>
        <span className="text-[12px] font-black text-white/50" aria-hidden="true">
          €
        </span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={STEP}
          value={value}
          onChange={(e) => setLimit(cat, Number(e.target.value) || 0)}
          className="w-9 bg-transparent text-center text-[13px] font-black tabular focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
      </label>
      <button type="button" onClick={() => setLimit(cat, value + STEP)} aria-label={`Raise ${label} limit by €${STEP}`} className="w-7 h-7 flex items-center justify-center rounded-r-lg hover:bg-white/10">
        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
      </button>
    </span>
  );
};

const barColor = (used: number, limit: number) => (used > limit ? "hsl(var(--destructive))" : used / Math.max(limit, 1) > 0.8 ? "hsl(var(--chart-6))" : "hsl(var(--accent))");

/* Summary of the plan: what's planned and what that leaves at the end of the month. */
export const BudgetSummary = ({ compareLastMonth = false }: { compareLastMonth?: boolean }) => {
  const { state } = useGame();
  const m = useStudent();
  const planned = sumBudget(state.budget);
  const left = m.projected(state.budget);
  return (
    <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-3.5">
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10.5px] font-extrabold text-white/50">Income</p>
          <p className="text-[15px] font-black tabular">{eur(Math.round(m.income))}</p>
        </div>
        <div>
          <p className="text-[10.5px] font-extrabold text-white/50">Planned</p>
          <p className="text-[15px] font-black tabular">{eur(planned)}</p>
        </div>
        <div>
          <p className="text-[10.5px] font-extrabold text-white/50">Left at end</p>
          <motion.p key={left} initial={{ scale: 1.2 }} animate={{ scale: 1 }} className={`text-[15px] font-black tabular ${left >= 0 ? "text-accent" : "text-destructive"}`}>
            {left < 0 ? "−" : ""}
            {eur(Math.abs(left))}
          </motion.p>
        </div>
      </div>
      {compareLastMonth && (
        <p className="text-[11px] font-bold text-white/50 mt-2.5 text-center">
          October: {eur(m.history.spent)} spent, {m.income >= m.history.spent ? `${eur(Math.round((m.income - m.history.spent) * 100) / 100)} left` : `${eur(Math.round((m.history.spent - m.income) * 100) / 100)} more than came in`}
        </p>
      )}
    </div>
  );
};

/* Category limits. "plan" compares with last month while choosing limits; "track" shows this month's actual vs plan. */
const BudgetEditor = ({ mode, editing = false }: { mode: "plan" | "track"; editing?: boolean }) => {
  const { state } = useGame();
  const m = useStudent();
  const [open, setOpen] = useState<Cat | null>(null);

  // A render function, not a component: keeps the limit inputs mounted (and focused) while typing
  const renderRow = (id: Cat) => {
    const c = catMeta(id);
    const Icon = STUDENT_ICONS[id];
    const fixed = m.fixed.includes(id);
    const limit = state.budget[id];
    const used = m.current.byCategory(id);
    const left = m.remaining(state.budget, id);
    const editable = !fixed && (mode === "plan" || editing);
    const expanded = mode === "track" && !editing && open === id;

    const head = (
      <>
        <span className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${c.color} 20%, transparent)`, color: c.color }}>
          <Icon className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <span className="flex-1 min-w-0">
          {mode === "plan" && (
            <>
              <span className="block text-[12.5px] font-extrabold leading-tight">{c.label}</span>
              <span className="block text-[10.5px] font-bold text-white/45 tabular">October {eur(Math.round(m.history.byCategory(id)))}</span>
            </>
          )}
          <span className={`items-baseline justify-between gap-2 ${mode === "plan" ? "hidden" : "flex"}`}>
            <span className="text-[12.5px] font-extrabold truncate">{c.label}</span>
            {mode === "plan" ? null : (
              !editable && (
                <span className="text-[11.5px] font-black tabular shrink-0">
                  {eur(Math.round(used))} <span className="text-white/45">/ {eur(limit)}</span>
                </span>
              )
            )}
          </span>
          {mode === "track" && (
            <>
              <span className="block h-1.5 rounded-full bg-white/10 mt-1.5 overflow-hidden">
                <span className="block h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.min(100, (used / Math.max(limit, 1)) * 100)}%`, background: fixed ? "rgba(255,255,255,.35)" : barColor(used, limit) }} />
              </span>
              <span className={`block text-[10.5px] font-bold mt-1 ${left < 0 ? "text-destructive" : "text-white/50"}`}>
                {fixed ? "Fixed cost · paid" : left < 0 ? `${eur(Math.abs(left))} over` : `${eur(left)} left`}
              </span>
            </>
          )}
        </span>
      </>
    );

    return (
      <li key={id} className="py-2">
        <div className="flex items-center gap-3">
          {mode === "track" && !editing ? (
            <button type="button" onClick={() => setOpen((o) => (o === id ? null : id))} aria-expanded={expanded} className="flex-1 flex items-center gap-3 text-left min-w-0">
              {head}
              <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-white/40 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          ) : (
            <div className="flex-1 flex items-center gap-3 min-w-0">{head}</div>
          )}
          {editable ? <Stepper cat={id} label={c.label} /> : fixed && mode === "plan" && <span className="inline-flex items-center gap-1 text-[12px] font-black tabular text-white/70"><Lock className="w-3 h-3" aria-hidden="true" />{eur(limit)}</span>}
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-10">
              {m.current.transactions(id).map((t) => (
                <li key={t.id} className="flex justify-between gap-2 pt-1.5 text-[11.5px] font-bold">
                  <span className="truncate text-white/75">
                    {t.label} <span className="text-white/40">· {day(t.day)}</span>
                  </span>
                  <span className="tabular shrink-0">−{eur(Math.abs(t.amount))}</span>
                </li>
              ))}
              {!m.current.transactions(id).length && <li className="pt-1.5 text-[11.5px] font-bold text-white/45">Nothing yet this month.</li>}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

  return (
    <div>
      {m.fixed.length > 0 && (
        <>
          <h3 className="text-[11px] font-extrabold text-white/50 mt-4">Fixed</h3>
          <ul>{m.fixed.map(renderRow)}</ul>
        </>
      )}
      <h3 className={`text-[11px] font-extrabold text-white/50 ${m.fixed.length ? "mt-2" : "mt-4"}`}>
        Flexible {mode === "track" && <span className="text-white/35">· day {m.current.today} of {m.current.days}</span>}
      </h3>
      <ul className="divide-y divide-white/[0.06]">{m.flexible.map(renderRow)}</ul>
    </div>
  );
};

export default BudgetEditor;
