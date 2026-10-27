import { useState, type FormEvent } from "react";
import type { Goal } from "@/hooks/use-game";

/* "Save for something": name, target, optional amount already set aside and optional date. Tracked virtually. */
const GoalForm = ({ initial, submitLabel, onSubmit, onSecondary, secondaryLabel }: { initial?: Goal; submitLabel: string; onSubmit: (g: Goal) => void; onSecondary?: () => void; secondaryLabel?: string }) => {
  const [name, setName] = useState(initial?.name ?? "Trip to Riga");
  const [target, setTarget] = useState(String(initial?.target ?? 150));
  const [saved, setSaved] = useState(String(initial?.saved ?? 45));
  const [date, setDate] = useState(initial?.date ?? "");
  const [error, setError] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const t = Number(target.replace(",", "."));
    const s = Number((saved || "0").replace(",", "."));
    if (!name.trim()) return setError("Give your goal a name.");
    if (!Number.isFinite(t) || t <= 0) return setError("Target must be more than €0.");
    if (!Number.isFinite(s) || s < 0 || s > t) return setError("Saved so far must be between €0 and the target.");
    setError("");
    onSubmit({ name: name.trim(), target: Math.round(t * 100) / 100, saved: Math.round(s * 100) / 100, date: date || undefined });
  };

  const field = "w-full h-10 rounded-xl bg-white/[0.07] border border-white/10 px-3 text-[14px] font-bold focus:outline-none focus:border-accent";

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <label className="block">
        <span className="block text-[11px] font-extrabold text-white/55 mb-1">What are you saving for?</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} className={field} />
      </label>
      <div className="grid grid-cols-2 gap-2.5">
        <label className="block">
          <span className="block text-[11px] font-extrabold text-white/55 mb-1">Target (€)</span>
          <input value={target} onChange={(e) => setTarget(e.target.value)} inputMode="decimal" className={`${field} tabular`} />
        </label>
        <label className="block">
          <span className="block text-[11px] font-extrabold text-white/55 mb-1">Saved so far (€)</span>
          <input value={saved} onChange={(e) => setSaved(e.target.value)} inputMode="decimal" className={`${field} tabular`} />
        </label>
      </div>
      <label className="block">
        <span className="block text-[11px] font-extrabold text-white/55 mb-1">Target date (optional)</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min="2026-11-14" className={`${field} [color-scheme:dark]`} />
      </label>
      {error && (
        <p role="alert" className="text-[12px] font-bold text-destructive">
          {error}
        </p>
      )}
      <p className="text-[11px] font-bold text-white/45">Tracked virtually. Brokie never holds, moves or sets aside money for you.</p>
      <div className="space-y-2 pt-1">
        <button type="submit" className="w-full h-11 rounded-xl bg-accent text-accent-foreground text-[14px] font-black shadow-[0_3px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none transition-transform">
          {submitLabel}
        </button>
        {onSecondary && (
          <button type="button" onClick={onSecondary} className="w-full h-10 rounded-xl text-[13px] font-extrabold text-white/60 hover:text-white">
            {secondaryLabel}
          </button>
        )}
      </div>
    </form>
  );
};

export default GoalForm;
