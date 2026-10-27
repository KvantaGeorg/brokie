import { useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import SheetShell, { SheetButton } from "./SheetShell";
import { STUDENT_ICONS } from "./icons";
import { affordCheck, categoryChoices, type AffordResult } from "@/data/afford";
import { catMeta, type Cat } from "@/data/students";
import { useGame, useStudent } from "@/hooks/use-game";
import { useTone } from "@/hooks/use-tone";
import { useOpenSheet } from "./sheets";

const eur = (n: number) => `€${Number.isInteger(n) ? n.toLocaleString("en-GB") : n.toFixed(2)}`;

/* Quick picks, so the demo works with one tap */
const IDEAS: { what: string; amount: number; cat: Cat }[] = [
  { what: "concert ticket", amount: 30, cat: "fun" },
  { what: "dinner with friends", amount: 25, cat: "eatingOut" },
  { what: "new sneakers", amount: 90, cat: "shopping" },
];

/* "Can I afford it?": a pause before paying. Checks the purchase against the plan and the savings goal,
   and offers to move money to savings first when the goal would slip. */
const AffordSheet = ({ onClose }: { onClose: () => void }) => {
  const { state, boughtAnyway } = useGame();
  const m = useStudent();
  const { tone } = useTone();
  const open = useOpenSheet();
  const still = useReducedMotion() ?? false;
  const choices = categoryChoices(m);
  const [what, setWhat] = useState("");
  const [amount, setAmount] = useState("");
  const [cat, setCat] = useState<Cat>(choices.find((c) => c.id === "fun")?.id ?? choices[0].id);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ r: AffordResult; what: string; amount: number; cat: Cat } | null>(null);
  const savage = tone === "savage";

  const check = (w: string, a: number, c: Cat) => {
    setResult({ r: affordCheck(m, state, c, a), what: w || "this", amount: a, cat: c });
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const a = Number(amount.replace(",", "."));
    if (!Number.isFinite(a) || a <= 0) return setError("Enter a price above €0.");
    setError("");
    check(what.trim(), Math.round(a * 100) / 100, cat);
  };

  if (result) {
    const { r } = result;
    const label = catMeta(result.cat).label.toLowerCase();
    const goal = state.goal;
    const view =
      r.verdict === "yes"
        ? {
            icon: CircleCheck,
            color: "text-chart-2",
            mood: "proud" as const,
            title: "Yes, you can",
            text: savage
              ? `It fits your ${label} budget. ${eur(r.leftInCategory)} left there after. Go on, treat yourself. Responsibly.`
              : `It fits your ${label} budget, with ${eur(r.leftInCategory)} left there after. Enjoy it.`,
          }
        : r.verdict === "tight"
          ? {
              icon: TriangleAlert,
              color: "text-accent",
              mood: "watching" as const,
              title: "You can, but",
              text: `It's ${eur(r.over)} over your ${label} budget.${goal && r.goalDelayDays ? ` ${goal.name} would arrive about ${r.goalDelayDays} day${r.goalDelayDays > 1 ? "s" : ""} later.` : ""} ${savage ? "Your future self is raising an eyebrow." : "Protect your goal first, then buy it with a clear head."}`,
            }
          : {
              icon: CircleX,
              color: "text-destructive",
              mood: "shocked" as const,
              title: "Not this month",
              text: `It would leave you ${eur(r.short)} short at the end of November. ${savage ? "Your wallet said no before Brokie could." : "Put it on a wishlist and check again next month."}`,
            };
    const Icon = view.icon;

    return (
      <SheetShell title="Can I afford it?" onClose={onClose} onBack={() => setResult(null)}>
        <motion.div initial={still ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col">
          <p className="text-[12px] font-extrabold text-white/50">
            {result.what.charAt(0).toUpperCase() + result.what.slice(1)} · {eur(result.amount)}
          </p>
          <h2 className={`flex items-center gap-2 text-[26px] font-black leading-tight mt-1 ${view.color}`}>
            <Icon className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" /> {view.title}
          </h2>
          <div className="flex gap-3 mt-5 rounded-2xl bg-white/[0.06] p-3.5" role="status">
            <BrokieMascot mood={view.mood} size={40} className="shrink-0" title="" />
            <p className="text-[13.5px] font-bold leading-snug">{view.text}</p>
          </div>
          {r.verdict !== "no" && (
            <dl className="grid grid-cols-2 gap-2 mt-4 text-center">
              <div className="rounded-xl bg-white/[0.05] py-2.5">
                <dt className="text-[10.5px] font-extrabold text-white/50">{catMeta(result.cat).label} budget now</dt>
                <dd className="text-[16px] font-black tabular">{eur(Math.max(0, m.remaining(state.budget, result.cat)))}</dd>
              </div>
              <div className="rounded-xl bg-white/[0.05] py-2.5">
                <dt className="text-[10.5px] font-extrabold text-white/50">Month end after</dt>
                <dd className="text-[16px] font-black tabular">{r.verdict === "tight" ? eur(r.endOfMonth) : "Unchanged"}</dd>
              </div>
            </dl>
          )}
          <div className="mt-auto pt-5 space-y-1.5">
            {r.verdict === "tight" && goal && r.protect > 0 && <SheetButton onClick={() => open({ kind: "savings", amount: r.protect })}>Move {eur(r.protect)} to savings first</SheetButton>}
            {r.verdict === "yes" && (
              <SheetButton
                onClick={() => {
                  boughtAnyway(result.what);
                  onClose();
                }}
              >
                Buy it
              </SheetButton>
            )}
            {r.verdict === "tight" && (
              <SheetButton
                variant="ghost"
                onClick={() => {
                  boughtAnyway(result.what);
                  onClose();
                }}
              >
                Buy it anyway
              </SheetButton>
            )}
            {r.verdict === "no" && <SheetButton onClick={onClose}>Got it</SheetButton>}
          </div>
        </motion.div>
      </SheetShell>
    );
  }

  const field = "w-full h-11 rounded-xl bg-white/[0.07] border border-white/10 px-3 text-[14px] font-bold focus:outline-none focus:border-accent";

  return (
    <SheetShell title="Can I afford it?" onClose={onClose}>
      <h2 className="text-[24px] font-black leading-tight">Can I afford it?</h2>
      <p className="text-[12.5px] font-bold text-white/55 mt-1">Brokie checks it against your plan and your goal before you pay.</p>

      <p className="text-[11px] font-extrabold text-white/50 mt-5 mb-2">Try one</p>
      <div className="flex flex-wrap gap-1.5">
        {IDEAS.filter((i) => choices.some((c) => c.id === i.cat)).map((i) => (
          <button key={i.what} type="button" onClick={() => check(i.what, i.amount, i.cat)} className="h-8 px-3 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-[12px] font-extrabold">
            {i.what} · €{i.amount}
          </button>
        ))}
      </div>

      <form onSubmit={submit} noValidate className="mt-5 space-y-3 flex-1 flex flex-col">
        <label className="block">
          <span className="block text-[11px] font-extrabold text-white/55 mb-1">What is it?</span>
          <input value={what} onChange={(e) => setWhat(e.target.value)} maxLength={40} placeholder="Concert ticket" className={`${field} placeholder:text-white/30`} />
        </label>
        <label className="block">
          <span className="block text-[11px] font-extrabold text-white/55 mb-1">Price (€)</span>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="40" className={`${field} tabular placeholder:text-white/30`} />
        </label>
        <fieldset>
          <legend className="block text-[11px] font-extrabold text-white/55 mb-1.5">Category</legend>
          <div className="grid grid-cols-2 gap-1.5">
            {choices.map((c) => {
              const Icon = STUDENT_ICONS[c.id];
              return (
                <label key={c.id} className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[11.5px] font-extrabold cursor-pointer ${cat === c.id ? "border-accent bg-accent/10" : "border-white/10"}`}>
                  <input type="radio" name="afford-cat" value={c.id} checked={cat === c.id} onChange={() => setCat(c.id)} className="sr-only" />
                  <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> <span className="truncate">{c.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="text-[12px] font-bold text-destructive">
            {error}
          </p>
        )}
        <div className="mt-auto pt-3">
          <SheetButton type="submit">Check</SheetButton>
        </div>
      </form>
    </SheetShell>
  );
};

export default AffordSheet;
