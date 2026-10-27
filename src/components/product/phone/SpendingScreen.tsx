import { useMemo, useState } from "react";
import { CATEGORIES, TRANSACTIONS, spendingByCategory, totalSpent, type SpendCategory } from "@/data/transactions";

const eur = (n: number) => `€${Math.abs(n).toFixed(2)}`;
const day = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/* Month overview: CSS donut, category list (tap to filter), and the matching transactions. */
const SpendingScreen = () => {
  const cats = useMemo(() => spendingByCategory(), []);
  const total = totalSpent();
  const max = Math.max(...cats.map((c) => c.total));
  const [filter, setFilter] = useState<SpendCategory | null>(null);

  let acc = 0;
  const gradient = cats
    .map((c) => {
      const from = (acc / total) * 360;
      acc += c.total;
      return `${c.color} ${from}deg ${(acc / total) * 360}deg`;
    })
    .join(", ");

  const list = TRANSACTIONS.filter((t) => (filter ? t.category === filter : t.amount < 0))
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, filter ? 10 : 5);
  const active = CATEGORIES.find((c) => c.id === filter);

  return (
    <div className="px-4 pb-4">
      <h2 className="text-[20px] font-black">October</h2>

      <div className="flex items-center gap-4 mt-3">
        <div className="relative w-[110px] h-[110px] shrink-0 rounded-full" style={{ background: `conic-gradient(${gradient})` }} aria-hidden="true">
          <div className="absolute inset-[18px] rounded-full bg-[hsl(258_45%_13%)] flex flex-col items-center justify-center">
            <span className="text-[10px] font-extrabold text-white/60">spent</span>
            <span className="text-[17px] font-black tabular leading-tight">€{total.toFixed(0)}</span>
          </div>
        </div>
        <p className="text-[12.5px] font-bold text-white/80 leading-snug">
          Delivery, cafés and subscriptions cost <span className="text-accent">more than groceries</span> this month. 👀
        </p>
      </div>

      <ul className="mt-4 space-y-1.5">
        {cats.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => setFilter((f) => (f === c.id ? null : c.id))}
              className={`w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors ${
                filter === c.id ? "bg-white/15" : "hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-[16px]" aria-hidden="true">
                {c.emoji}
              </span>
              <span className="flex-1 min-w-0">
                <span className="flex justify-between text-[12.5px] font-extrabold">
                  <span>{c.label}</span>
                  <span className="tabular">€{c.total.toFixed(0)}</span>
                </span>
                <span className="block h-1.5 rounded-full bg-white/10 mt-1 overflow-hidden">
                  <span className="block h-full rounded-full" style={{ width: `${(c.total / max) * 100}%`, background: c.color }} />
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="text-[12px] font-black tracking-[0.08em] text-white/60 mt-5 mb-2">{active ? active.label.toUpperCase() : "RECENT"}</h3>
      <ul className="space-y-1">
        {list.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-2 rounded-xl bg-white/[0.05] px-3 py-2">
            <span className="min-w-0">
              <span className="block text-[12.5px] font-extrabold truncate">{t.merchant}</span>
              <span className="block text-[11px] font-bold text-white/55">{day(t.date)}</span>
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
