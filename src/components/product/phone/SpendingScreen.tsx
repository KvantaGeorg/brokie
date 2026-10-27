import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CATEGORY_ICONS } from "./icons";
import { CATEGORIES, TRANSACTIONS, spendingByCategory, totalIncome, totalSpent, type SpendCategory } from "@/data/transactions";

const eur = (n: number) => `€${Math.abs(n).toFixed(2)}`;
const day = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/* Month overview: donut, categories (tap to filter) and the matching payments. */
const SpendingScreen = () => {
  const still = useReducedMotion() ?? false;
  const cats = useMemo(() => [...spendingByCategory()].sort((a, b) => b.total - a.total), []);
  const total = totalSpent();
  const left = totalIncome() - total;
  const [filter, setFilter] = useState<SpendCategory | null>(null);

  let acc = 0;
  const gradient = cats
    .map((c) => {
      const from = (acc / total) * 360;
      acc += c.total;
      return `${c.color} ${from}deg ${(acc / total) * 360 - 1.5}deg, transparent 0 ${(acc / total) * 360}deg`;
    })
    .join(", ");

  const list = TRANSACTIONS.filter((t) => (filter ? t.category === filter : t.amount < 0))
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, filter ? 10 : 4);
  const active = CATEGORIES.find((c) => c.id === filter);

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-5">
        <motion.div
          initial={still ? false : { opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-[104px] h-[104px] shrink-0 rounded-full"
          style={{ background: `conic-gradient(${gradient})` }}
          aria-hidden="true"
        >
          <div className="absolute inset-[13px] rounded-full bg-[hsl(258_42%_10%)]" />
        </motion.div>
        <div>
          <p className="text-[11px] font-extrabold text-white/50">Spent in October</p>
          <p className="text-[26px] font-black tabular leading-tight">€{total.toFixed(0)}</p>
          <p className="text-[11px] font-bold text-white/50 tabular">€{left.toFixed(2)} left</p>
        </div>
      </div>

      <ul className="mt-5 space-y-0.5">
        {cats.map((c) => {
          const Icon = CATEGORY_ICONS[c.id];
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={filter === c.id}
                onClick={() => setFilter((f) => (f === c.id ? null : c.id))}
                className={`w-full flex items-center gap-3 rounded-xl px-2 py-1.5 text-left transition-colors ${filter === c.id ? "bg-white/10" : "hover:bg-white/[0.05]"}`}
              >
                <span className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center" style={{ background: `color-mix(in srgb, ${c.color} 20%, transparent)`, color: c.color }}>
                  <Icon className="w-3.5 h-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <span className="flex-1 text-[12.5px] font-extrabold">{c.label}</span>
                <span className="text-[12.5px] font-black tabular">€{c.total.toFixed(0)}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <h3 className="text-[11px] font-extrabold text-white/50 mt-4 mb-1">{active ? active.label : "Recent"}</h3>
      <ul className="divide-y divide-white/[0.07]">
        {list.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-2 py-2">
            <span className="min-w-0">
              <span className="block text-[12.5px] font-extrabold truncate">{t.merchant}</span>
              <span className="block text-[11px] font-bold text-white/45">{day(t.date)}</span>
            </span>
            <span className={`text-[13px] font-black tabular ${t.amount > 0 ? "text-chart-2" : ""}`}>
              {t.amount > 0 ? "+" : "−"}
              {eur(t.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpendingScreen;
