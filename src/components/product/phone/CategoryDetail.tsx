import { useEffect, useRef } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { CATEGORY_ICONS } from "./icons";
import { CATEGORIES, TRANSACTIONS, weeklyTotals, type SpendCategory } from "@/data/transactions";
import { categoryInsight } from "@/data/insights";

const eur = (n: number) => `€${Math.abs(n).toFixed(2)}`;
const day = (date: string) => new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/* One path node opened: the category's month, Brokie's take, week-by-week bars and every payment. */
const CategoryDetail = ({ id, locked, onBack }: { id: SpendCategory; locked: boolean; onBack: () => void }) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const cat = CATEGORIES.find((c) => c.id === id)!;
  const Icon = CATEGORY_ICONS[id];
  const insight = categoryInsight(id);
  const weeks = weeklyTotals(id);
  const maxWeek = Math.max(...weeks, 1);
  const peak = weeks.indexOf(Math.max(...weeks));
  const payments = TRANSACTIONS.filter((t) => t.category === id).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);

  useEffect(() => backRef.current?.focus({ preventScroll: true }), []);

  return (
    <div className="px-5 pb-4" onKeyDown={(e) => e.key === "Escape" && onBack()}>
      <button
        ref={backRef}
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-0.5 -ml-1.5 rounded-lg px-1.5 py-1 text-[12px] font-extrabold text-white/60 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Path
      </button>

      <div className="flex items-center gap-3 mt-2">
        <span className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${cat.color} 22%, transparent)`, color: cat.color }}>
          <Icon className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[19px] font-black leading-tight">{cat.label}</h2>
          <p className="text-[12px] font-bold text-white/55 tabular">
            {eur(insight.total)} · {insight.share}% of October
          </p>
        </div>
      </div>

      {locked && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-white/55">
          <Lock className="w-3 h-3" aria-hidden="true" /> Locked until you beat Delivery
        </p>
      )}

      {/* Brokie's take */}
      <div className="flex gap-2.5 mt-4 rounded-2xl bg-white/[0.06] p-3">
        <BrokieMascot mood={insight.mood} size={34} className="shrink-0" title="" />
        <p className="text-[12.5px] font-bold leading-snug text-white/90">{insight.text}</p>
      </div>

      {/* week by week */}
      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-2">By week</h3>
      <div className="flex items-end justify-between gap-3 h-[78px]" role="img" aria-label={`Weekly spending: ${weeks.map((w, i) => `week ${i + 1} ${eur(w)}`).join(", ")}`}>
        {weeks.map((w, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
            <span className={`text-[10px] font-black tabular ${i === peak ? "text-accent" : "text-white/50"}`}>€{w.toFixed(0)}</span>
            <span className="w-full rounded-md" style={{ height: `${Math.max(4, (w / maxWeek) * 52)}px`, background: i === peak ? "hsl(var(--accent))" : "rgba(255,255,255,.14)" }} />
            <span className="text-[10px] font-extrabold text-white/40">W{i + 1}</span>
          </div>
        ))}
      </div>

      {/* payments */}
      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-1">Payments · {payments.length}</h3>
      <ul className="divide-y divide-white/[0.07]">
        {payments.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-2 py-2">
            <span className="min-w-0">
              <span className="block text-[12.5px] font-extrabold truncate">{t.merchant}</span>
              <span className="block text-[11px] font-bold text-white/45">{day(t.date)}</span>
            </span>
            <span className="text-[13px] font-black tabular">−{eur(t.amount)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryDetail;
