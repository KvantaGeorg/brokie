import { useEffect, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, Check, Landmark, Lock, PiggyBank, ShieldCheck, Smartphone } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import SheetShell, { SheetButton } from "./SheetShell";
import { availableNow, safeToMove } from "@/data/afford";
import { useGame, useStudent } from "@/hooks/use-game";

type Step = "link" | "amount" | "review" | "bank" | "done";

const eur = (n: number) => `€${Number.isInteger(n) ? n.toLocaleString("en-GB") : n.toFixed(2)}`;
const BANK_CONFIRM_MS = 2600;

/* Account numbers for the demo, made from the student id so they stay the same */
const accountTail = (id: string, salt: number) => String((Number(id.replace(/\D/g, "")) * 37 + salt) % 9000 + 1000);

/* Move money to the student's own savings account: Brokie starts the transfer (open banking payment initiation),
   the student confirms it in their bank with Smart-ID. Brokie never holds the money. */
const SavingsSheet = ({ amount: preset, onClose }: { amount?: number; onClose: () => void }) => {
  const { state, linkSavings, transferToSavings } = useGame();
  const m = useStudent();
  const still = useReducedMotion() ?? false;
  const bank = m.student.bank;
  const current = `Current ••${accountTail(m.student.id, 11)}`;
  const savings = `Savings ••${accountTail(m.student.id, 503)}`;
  const available = availableNow(m, state);
  const safe = safeToMove(m, state);
  const goal = state.goal;
  const inApp = bank === "Revolut"; // Revolut confirms in its own app; Lithuanian banks use Smart-ID

  const [step, setStep] = useState<Step>(state.savings.linked ? "amount" : "link");
  const [amount, setAmount] = useState(preset ?? Math.min(10, Math.max(5, safe)));
  const [custom, setCustom] = useState("");
  const [code] = useState(() => String(1000 + Math.floor(Math.random() * 9000)));

  // The bank confirms after a moment, as if Smart-ID was approved on the phone
  useEffect(() => {
    if (step !== "bank") return;
    const t = setTimeout(() => {
      transferToSavings(amount);
      setStep("done");
    }, BANK_CONFIRM_MS);
    return () => clearTimeout(t);
  }, [step, amount, transferToSavings]);

  if (!goal)
    return (
      <SheetShell title="Move to savings" onClose={onClose}>
        <PiggyBank className="w-10 h-10 text-accent" aria-hidden="true" />
        <h2 className="text-[22px] font-black leading-tight mt-4">Set a goal first</h2>
        <p className="text-[13px] font-bold text-white/60 mt-2">Money you move to savings is always for a goal, so you know what it's for. Create one in Goals.</p>
        <div className="mt-auto">
          <SheetButton onClick={onClose}>Got it</SheetButton>
        </div>
      </SheetShell>
    );

  const back: Partial<Record<Step, Step>> = { review: "amount" };
  const pickCustom = (e: FormEvent) => {
    e.preventDefault();
    const v = Number(custom.replace(",", "."));
    if (Number.isFinite(v) && v > 0) setAmount(Math.round(v * 100) / 100);
  };
  const tooMuch = amount > available;

  return (
    <SheetShell title="Move to savings" onClose={onClose} onBack={back[step] ? () => setStep(back[step]!) : undefined}>
      {step === "link" && (
        <>
          <Landmark className="w-10 h-10 text-accent" aria-hidden="true" />
          <h2 className="text-[22px] font-black leading-tight mt-4">Link your savings account</h2>
          <p className="text-[13px] font-bold text-white/60 mt-2">Brokie found a savings account at {bank}. Link it to move money to {goal.name} from inside Brokie.</p>
          <button type="button" onClick={() => { linkSavings(); setStep("amount"); }} className="mt-5 w-full flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.05] hover:bg-white/[0.09] p-3.5 text-left">
            <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[12px] font-black" aria-hidden="true">
              {bank.slice(0, 2)}
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-extrabold">
                {bank} {savings}
              </span>
              <span className="block text-[11.5px] font-bold text-white/50">Balance {eur(goal.saved)}</span>
            </span>
            <span className="text-[12px] font-black text-accent">Link</span>
          </button>
          <ul className="mt-6 space-y-2.5 text-[12px] font-bold text-white/65">
            <li className="flex gap-2"><Lock className="w-4 h-4 shrink-0 text-white/45" aria-hidden="true" /> Brokie never holds your money. It stays in your bank.</li>
            <li className="flex gap-2"><ShieldCheck className="w-4 h-4 shrink-0 text-white/45" aria-hidden="true" /> Every transfer is confirmed by you in your bank.</li>
            <li className="flex gap-2"><Smartphone className="w-4 h-4 shrink-0 text-white/45" aria-hidden="true" /> Works through open banking (PSD2), like paying online.</li>
          </ul>
        </>
      )}

      {step === "amount" && (
        <>
          <h2 className="text-[22px] font-black leading-tight">Move to {goal.name}</h2>
          <p className="text-[12.5px] font-bold text-white/55 mt-1">
            {eur(goal.saved)} of {eur(goal.target)} saved
          </p>
          <p className="text-[52px] font-black tabular text-center mt-6 leading-none">{eur(amount)}</p>
          <div className="flex gap-2 mt-5">
            {[5, 10, 20].map((v) => (
              <button key={v} type="button" onClick={() => setAmount(v)} aria-pressed={amount === v} className={`flex-1 h-10 rounded-xl text-[13.5px] font-black ${amount === v ? "bg-accent text-accent-foreground" : "bg-white/[0.08] hover:bg-white/[0.12]"}`}>
                €{v}
              </button>
            ))}
          </div>
          <form onSubmit={pickCustom} className="flex gap-2 mt-2">
            <label className="flex-1 flex items-center rounded-xl bg-white/[0.08] px-3">
              <span className="sr-only">Other amount in euros</span>
              <span className="text-[13px] font-black text-white/45" aria-hidden="true">€</span>
              <input value={custom} onChange={(e) => setCustom(e.target.value)} inputMode="decimal" placeholder="Other amount" className="w-full h-10 bg-transparent px-1.5 text-[13.5px] font-bold tabular focus:outline-none placeholder:text-white/35" />
            </label>
            <button type="submit" className="h-10 px-3 rounded-xl bg-white/10 text-[12.5px] font-black hover:bg-white/15">Use</button>
          </form>
          <div className="flex gap-2.5 items-start mt-5 rounded-xl bg-white/[0.06] p-3">
            <BrokieMascot mood="happy" size={30} className="shrink-0" title="" />
            <p className="text-[12px] font-bold leading-snug">
              {safe > 0 ? `Your plan allows about ${eur(safe)} this month without going below zero.` : "Your plan is already tight this month. Even €5 counts, but check your budget first."}
            </p>
          </div>
          {tooMuch && <p role="alert" className="text-[12px] font-bold text-destructive mt-3">Only {eur(available)} is in your current account right now.</p>}
          <div className="mt-auto pt-5">
            <SheetButton onClick={() => setStep("review")} disabled={tooMuch || amount <= 0}>
              Continue
            </SheetButton>
          </div>
        </>
      )}

      {step === "review" && (
        <>
          <h2 className="text-[22px] font-black leading-tight">Check the transfer</h2>
          <div className="mt-5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="p-3.5">
              <p className="text-[11px] font-extrabold text-white/50">From</p>
              <p className="text-[14px] font-extrabold">
                {bank} {current}
              </p>
              <p className="text-[11.5px] font-bold text-white/50">Available {eur(available)}</p>
            </div>
            <div className="flex justify-center -my-3 relative z-10">
              <span className="w-7 h-7 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                <ArrowDown className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
              </span>
            </div>
            <div className="p-3.5 bg-white/[0.04]">
              <p className="text-[11px] font-extrabold text-white/50">To</p>
              <p className="text-[14px] font-extrabold">
                {bank} {savings}
              </p>
              <p className="text-[11.5px] font-bold text-white/50">For {goal.name}</p>
            </div>
          </div>
          <div className="flex justify-between items-baseline mt-5">
            <span className="text-[13px] font-extrabold text-white/60">Amount</span>
            <span className="text-[26px] font-black tabular">{eur(amount)}</span>
          </div>
          <p className="text-[11px] font-bold text-white/45 mt-4 leading-snug">
            Brokie starts this transfer through open banking. Your bank asks you to confirm it. Brokie never holds your money.
          </p>
          <div className="mt-auto pt-5">
            <SheetButton onClick={() => setStep("bank")}>Confirm in {bank}</SheetButton>
          </div>
        </>
      )}

      {step === "bank" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center rounded-3xl bg-white text-[hsl(230_25%_15%)] -mx-2 px-5 py-8" role="status">
          <p className="text-[13px] font-black tracking-wide uppercase text-[hsl(230_15%_45%)]">{bank}</p>
          <p className="text-[19px] font-black mt-2">Confirm payment</p>
          <p className="text-[13px] font-bold text-[hsl(230_15%_40%)] mt-1">
            {eur(amount)} to {savings}
          </p>
          {inApp ? (
            <p className="text-[12.5px] font-bold text-[hsl(230_15%_40%)] mt-6">Open the {bank} app and approve the payment.</p>
          ) : (
            <>
              <div className="mt-6 rounded-2xl bg-[hsl(230_25%_95%)] px-6 py-4">
                <p className="text-[11px] font-extrabold text-[hsl(230_15%_45%)]">Smart-ID verification code</p>
                <p className="text-[34px] font-black tracking-[0.2em] tabular">{code}</p>
              </div>
              <p className="text-[12.5px] font-bold text-[hsl(230_15%_40%)] mt-5">Check that the code matches on your phone, then enter your PIN2.</p>
            </>
          )}
          <motion.span
            className="mt-6 w-8 h-8 rounded-full border-[3px] border-[hsl(230_20%_85%)] border-t-[hsl(262_83%_58%)]"
            animate={still ? {} : { rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          />
          <p className="sr-only">Waiting for confirmation</p>
          <p className="text-[10.5px] font-bold text-[hsl(230_15%_55%)] mt-6">Demo: confirms automatically. No real bank is contacted.</p>
        </div>
      )}

      {step === "done" && (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.span initial={still ? false : { scale: 0.5 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-chart-2 flex items-center justify-center">
              <Check className="w-8 h-8 text-white" strokeWidth={3.5} aria-hidden="true" />
            </motion.span>
            <h2 className="text-[22px] font-black mt-5">{eur(amount)} is in savings</h2>
            <p className="text-[13px] font-bold text-white/60 mt-1">Confirmed by {bank}.</p>
            <p className="text-[15px] font-extrabold mt-5">
              {goal.name}: {eur(goal.saved)} of {eur(goal.target)}
            </p>
          </div>
          <SheetButton onClick={onClose}>Done</SheetButton>
        </div>
      )}
    </SheetShell>
  );
};

export default SavingsSheet;
