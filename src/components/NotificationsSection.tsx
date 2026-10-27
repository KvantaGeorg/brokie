import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Shuffle, Sparkles } from "lucide-react";
import { Blobs, FadeUp, SectionHeader } from "./product/ProductUI";
import BrokieMascot from "./brand/BrokieMascot";
import { DEMO_CATEGORIES, GROUPS, NOTIFICATIONS, buildDemoNotification, type Mood, type Tone } from "@/data/notifications";
import { usableEquivalents } from "@/data/equivalents";
import type { SpendCategory } from "@/data/transactions";
import { useTone } from "@/hooks/use-tone";

/* A single push-style notification card. */
const NotificationCard = ({ text, time, mood, tone }: { text: string; time: string; mood: Mood; tone: Tone }) => (
  <div className="glass rounded-2xl p-4 flex gap-3 items-start transition-transform duration-300 hover:-translate-y-1 hover:rotate-[-0.5deg]">
    <span className="shrink-0 w-11 h-11 rounded-xl bg-primary/30 flex items-center justify-center">
      <BrokieMascot mood={mood} size={36} title="" />
    </span>
    <div className="min-w-0 flex-1">
      <div className="flex items-center justify-between gap-2 text-[12px] font-black text-muted-foreground">
        <span>BROKIE</span>
        <span>{time}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={tone + text}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="text-[16px] font-bold leading-snug mt-0.5"
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  </div>
);

export const ToneToggle = () => {
  const { tone, setTone } = useTone();
  const options: { id: Tone; label: string }[] = [
    { id: "gentle", label: "🌸 Gentle mode" },
    { id: "savage", label: "🔥 Savage mode" },
  ];
  return (
    <div role="radiogroup" aria-label="Notification tone" className="inline-flex glass rounded-2xl p-1.5 gap-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={tone === o.id}
          onClick={() => setTone(o.id)}
          className={`relative h-11 px-4 sm:px-5 rounded-xl text-[15px] font-extrabold transition-colors ${
            tone === o.id ? "text-accent-foreground" : "text-foreground/80 hover:text-foreground"
          }`}
        >
          {tone === o.id && (
            <motion.span layoutId="tone-pill" className="absolute inset-0 rounded-xl bg-accent shadow-[0_3px_0_hsl(var(--accent-deep))]" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
          )}
          <span className="relative">{o.label}</span>
        </button>
      ))}
    </div>
  );
};

/* Type an amount, pick a category, get a Brokie notification built from the equivalents price list. */
const NotificationDemo = () => {
  const { tone } = useTone();
  const [amount, setAmount] = useState("15");
  const [category, setCategory] = useState<SpendCategory>("delivery");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ text: string; key: number } | null>(null);
  const [seed, setSeed] = useState(0);

  const generate = (nextSeed: number) => {
    const value = Number(amount.replace(",", "."));
    if (!Number.isFinite(value) || value < 0.5 || value > 5000) {
      setError("Enter an amount between €0.50 and €5,000");
      return;
    }
    setError("");
    const options = usableEquivalents(value);
    const eq = options[nextSeed % options.length];
    setSeed(nextSeed);
    setResult({ text: buildDemoNotification(Math.round(value * 100) / 100, category, tone, eq, nextSeed), key: Date.now() });
  };

  return (
    <div id="try" className="glass-strong rounded-[28px] p-6 sm:p-8 mt-16 scroll-mt-24">
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
        <div>
          <h3 className="text-[26px] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-accent" aria-hidden="true" /> Try Brokie
          </h3>
          <p className="text-muted-foreground font-semibold mt-1 mb-6">Type what you spent. Brokie does the maths.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              generate(Math.floor(Math.random() * 100));
            }}
            className="space-y-4"
            noValidate
          >
            <div className="grid sm:grid-cols-[0.8fr_1.2fr] gap-3">
              <label className="block">
                <span className="block text-[13px] font-extrabold mb-1.5">Amount (EUR)</span>
                <span className="flex items-center h-12 rounded-xl bg-white/[0.07] border border-white/15 focus-within:border-accent px-3">
                  <span className="text-muted-foreground font-black mr-1" aria-hidden="true">€</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? "demo-error" : undefined}
                    className="w-full bg-transparent text-[17px] font-extrabold focus:outline-none tabular"
                  />
                </span>
              </label>
              <label className="block">
                <span className="block text-[13px] font-extrabold mb-1.5">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SpendCategory)}
                  className="w-full h-12 rounded-xl bg-white/[0.07] border border-white/15 focus:border-accent px-3 text-[16px] font-extrabold focus:outline-none [&>option]:bg-popover"
                >
                  {DEMO_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {error && (
              <p id="demo-error" className="text-[14px] font-bold text-destructive">
                {error}
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-1">
              <button type="submit" className="btn-chunky btn-primary">
                Ask Brokie
              </button>
              {result && (
                <button type="button" onClick={() => generate(seed + 1)} className="btn-chunky btn-glass">
                  <Shuffle className="w-4 h-4" aria-hidden="true" /> Another one
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="relative min-h-[150px] flex items-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key={result.key}
                initial={{ opacity: 0, y: -30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 380, damping: 24 }}
                className="w-full"
              >
                <NotificationCard text={result.text} time="now" mood={tone === "savage" ? "watching" : "shocked"} tone={tone} />
              </motion.div>
            ) : (
              <motion.div key="empty" className="w-full flex items-center gap-4 rounded-2xl border-2 border-dashed border-white/15 p-5">
                <BrokieMascot mood="watching" size={56} title="" />
                <p className="font-bold text-muted-foreground">Brokie is waiting for your confession…</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const NotificationsSection = () => {
  const { tone } = useTone();
  return (
    <section id="notifications" className="relative py-24 lg:py-36 bg-subtle">
      <Blobs variant={1} />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div className="[&>div]:mb-0">
            <SectionHeader
              label="Notifications"
              title="Notifications that actually hit different."
              desc="Brokie turns spending into absurd but real equivalents. Jokes about the situation, never about you."
            />
          </div>
          <ToneToggle />
        </div>

        <div className="grid md:grid-cols-2 gap-x-6 gap-y-10">
          {GROUPS.map((g, gi) => (
            <FadeUp key={g.id} delay={gi * 0.06}>
              <h3 className="text-[18px] text-accent mb-3">{g.title}</h3>
              <ul className="space-y-3">
                {NOTIFICATIONS.filter((n) => n.group === g.id).map((n) => (
                  <li key={n.id}>
                    <NotificationCard text={n.text[tone]} time={n.time} mood={n.mood} tone={tone} />
                  </li>
                ))}
              </ul>
            </FadeUp>
          ))}
        </div>

        <NotificationDemo />
      </div>
    </section>
  );
};

export default NotificationsSection;
