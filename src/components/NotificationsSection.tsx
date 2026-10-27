import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Shuffle } from "lucide-react";
import { SectionHeader } from "./product/ProductUI";
import BrokieMascot from "./brand/BrokieMascot";
import ToneToggle from "./ToneToggle";
import { DEMO_CATEGORIES, EXAMPLES, buildDemoNotification, type Mood } from "@/data/notifications";
import { usableEquivalents } from "@/data/equivalents";
import type { SpendCategory } from "@/data/transactions";
import { useTone } from "@/hooks/use-tone";

/* A lock-screen style notification from Brokie. */
const PushCard = ({ text, time, mood }: { text: string; time: string; mood: Mood }) => (
  <div className="rounded-2xl bg-[hsl(258_30%_20%)] border border-white/10 p-4 flex gap-3 items-start text-left">
    <span className="shrink-0 w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
      <BrokieMascot mood={mood} size={32} title="" />
    </span>
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2 text-[12px] font-extrabold text-white/55">
        <span>Brokie</span>
        <span>{time}</span>
      </div>
      <p className="text-[15px] font-bold leading-snug mt-0.5 text-white">{text}</p>
    </div>
  </div>
);

/* Amount + category in, a Brokie notification out, using the approximate Vilnius price list. */
const Generator = () => {
  const { tone } = useTone();
  const still = useReducedMotion() ?? false;
  const [amount, setAmount] = useState("15");
  const [category, setCategory] = useState<SpendCategory>("delivery");
  const [error, setError] = useState("");
  // What was generated is frozen until the next click; only the tone toggle re-words it
  const [made, setMade] = useState<{ value: number; category: SpendCategory; seed: number } | null>(null);

  const generate = (seed: number) => {
    const value = Number(amount.replace(",", "."));
    if (!Number.isFinite(value) || value < 0.5 || value > 5000) {
      setError("Enter an amount between €0.50 and €5,000.");
      return;
    }
    setError("");
    setMade({ value: Math.round(value * 100) / 100, category, seed });
  };

  const text = made ? buildDemoNotification(made.value, made.category, tone, usableEquivalents(made.value)[made.seed % usableEquivalents(made.value).length], made.seed) : null;

  return (
    <div id="try" className="surface rounded-3xl p-6 sm:p-8 scroll-mt-24">
      <h3 className="text-[22px]">Try Brokie</h3>
      <p className="text-[15px] font-semibold text-muted-foreground mt-1">Enter a purchase and see what Brokie would say.</p>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          generate(Math.floor(Math.random() * 100));
        }}
        className="mt-6 grid sm:grid-cols-[0.7fr_1.3fr] gap-3"
      >
        <label className="block">
          <span className="block text-[13px] font-extrabold text-muted-foreground mb-1.5">Amount (EUR)</span>
          <span className="flex items-center h-12 rounded-xl border border-white/15 focus-within:border-accent px-3">
            <span className="text-muted-foreground font-black mr-1" aria-hidden="true">
              €
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "try-error" : undefined}
              className="w-full bg-transparent text-[16px] font-extrabold tabular focus:outline-none"
            />
          </span>
        </label>
        <label className="block">
          <span className="block text-[13px] font-extrabold text-muted-foreground mb-1.5">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as SpendCategory)}
            className="w-full h-12 rounded-xl border border-white/15 bg-transparent focus:border-accent px-3 text-[16px] font-extrabold focus:outline-none [&>option]:bg-popover"
          >
            {DEMO_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        {error && (
          <p id="try-error" className="sm:col-span-2 text-[14px] font-bold text-destructive">
            {error}
          </p>
        )}
        <div className="sm:col-span-2 flex flex-wrap gap-3 pt-1">
          <button type="submit" className="btn btn-accent">
            Generate notification
          </button>
          <button type="button" onClick={() => generate((made?.seed ?? 0) + 1)} disabled={!made} className="btn btn-outline">
            <Shuffle className="w-4 h-4" aria-hidden="true" /> Another one
          </button>
        </div>
      </form>

      <div className="mt-6 min-h-[92px]" aria-live="polite">
        <AnimatePresence mode="wait">
          {text ? (
            <motion.div key={text} initial={still ? { opacity: 0 } : { opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <PushCard text={text} time="now" mood={tone === "savage" ? "watching" : "shocked"} />
            </motion.div>
          ) : (
            <p className="rounded-2xl border border-dashed border-white/15 p-5 text-[14px] font-bold text-muted-foreground">Your notification will appear here.</p>
          )}
        </AnimatePresence>
      </div>
      <p className="text-[12px] font-semibold text-muted-foreground mt-3">Equivalents use approximate Vilnius prices.</p>
    </div>
  );
};

const NotificationsSection = () => {
  const { tone } = useTone();
  return (
    <section id="notifications" className="section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <SectionHeader label="Notifications" title="Financial reality checks, with personality." desc="Brokie knows when to celebrate your progress and when to question that 2 AM food delivery." className="!mb-0" />
          <ToneToggle className="self-start lg:self-end" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-12 lg:mt-16 items-start">
          <ul className="space-y-4">
            {EXAMPLES.map((n) => (
              <li key={n.id}>
                <p className="text-[13px] font-extrabold text-muted-foreground mb-2">{n.label}</p>
                <PushCard text={n.text[tone]} time={n.time} mood={n.mood} />
              </li>
            ))}
          </ul>
          <Generator />
        </div>
      </div>
    </section>
  );
};

export default NotificationsSection;
