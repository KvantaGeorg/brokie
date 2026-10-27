import { useEffect, useRef } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { STUDENT_ICONS } from "./icons";
import { catMeta, cohortAverage, type Cat } from "@/data/students";
import { useStudent } from "@/hooks/use-game";

const eur = (n: number) => `€${Math.abs(n).toFixed(2)}`;
const LIVING_LABEL: Record<string, string> = {
  "With parents": "Live with parents",
  Dorm: "Live in a dorm",
  "Shared flat": "Share a flat",
  "Alone / with partner": "Live alone",
};

/* One category opened: October in that category, Brokie's take, how it compares with other students,
   week-by-week bars and every payment. */
const CategoryDetail = ({ id, locked, onBack, backLabel = "Back" }: { id: Cat; locked: boolean; onBack: () => void; backLabel?: string }) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const m = useStudent();
  const cat = catMeta(id);
  const Icon = STUDENT_ICONS[id];
  const insight = m.insight(id);
  const weeks = m.history.weekly(id);
  const maxWeek = Math.max(...weeks, 1);
  const peak = weeks.indexOf(Math.max(...weeks));
  const payments = m.history.transactions(id);
  const parts = m.history.breakdown(id);
  const own = m.ownBudget(id);
  const compare = [
    { label: "You", value: insight.total, you: true },
    { label: LIVING_LABEL[m.student.living] ?? m.student.living, value: cohortAverage(id, m.student.living) },
    { label: "All students", value: cohortAverage(id) },
  ];
  const maxCompare = Math.max(...compare.map((c) => c.value), 1);

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div className="pb-2" onKeyDown={(e) => e.key === "Escape" && onBack()}>
      <button
        ref={backRef}
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-0.5 -ml-1.5 rounded-lg px-1.5 py-1 text-[12px] font-extrabold text-white/60 hover:text-white"
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" /> {backLabel}
      </button>

      <div className="flex items-center gap-3 mt-2">
        <span className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center" style={{ background: `color-mix(in srgb, ${cat.color} 22%, transparent)`, color: cat.color }}>
          <Icon className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[19px] font-black leading-tight">{cat.label}</h2>
          <p className="text-[12px] font-bold text-white/55 tabular">
            {eur(insight.total)} · {insight.share}% of October{own != null && ` · your limit €${own}`}
          </p>
        </div>
      </div>

      {locked && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-white/55">
          <Lock className="w-3 h-3" aria-hidden="true" /> Locked for now
        </p>
      )}

      {/* Brokie's take */}
      <div className="flex gap-2.5 mt-4 rounded-2xl bg-white/[0.06] p-3">
        <BrokieMascot mood={insight.mood} size={34} className="shrink-0" title="" />
        <p className="text-[12.5px] font-bold leading-snug text-white/90">{insight.text}</p>
      </div>

      {/* what it's made of */}
      {parts.length > 1 && (
        <ul className="mt-3 grid grid-cols-2 gap-2">
          {parts.map((p) => (
            <li key={p.raw} className="rounded-xl bg-white/[0.04] px-2.5 py-2">
              <span className="block text-[11px] font-extrabold text-white/55 truncate">{p.raw}</span>
              <span className="block text-[13px] font-black tabular">
                {eur(p.total)} <span className="text-[10.5px] text-white/40">· {p.count}x</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* students like you */}
      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-2">Compared with other students, per month</h3>
      <ul className="space-y-1.5">
        {compare.map((c) => (
          <li key={c.label} className="flex items-center gap-2">
            <span className={`w-24 text-[11px] font-extrabold truncate ${c.you ? "text-accent" : "text-white/60"}`}>{c.label}</span>
            <span className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <span className="block h-full rounded-full" style={{ width: `${(c.value / maxCompare) * 100}%`, background: c.you ? "hsl(var(--accent))" : "rgba(255,255,255,.35)" }} />
            </span>
            <span className="w-11 text-right text-[11px] font-black tabular">€{Math.round(c.value)}</span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] font-bold text-white/35 mt-1.5">Averages over September and October, Brokie student dataset.</p>

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
        {payments.slice(0, 40).map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-2 py-2">
            <span className="min-w-0">
              <span className="block text-[12.5px] font-extrabold truncate">{t.label}</span>
              <span className="block text-[11px] font-bold text-white/45">{t.day} Oct</span>
            </span>
            <span className="text-[13px] font-black tabular">−{eur(t.amount)}</span>
          </li>
        ))}
      </ul>
      {payments.length > 40 && <p className="text-[11px] font-bold text-white/40 pt-2">and {payments.length - 40} more</p>}
    </div>
  );
};

export default CategoryDetail;
