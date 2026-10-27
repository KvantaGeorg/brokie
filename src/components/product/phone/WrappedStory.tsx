import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { STUDENT_ICONS } from "./icons";
import { wrappedFor } from "@/data/wrapped";
import { useGame } from "@/hooks/use-game";
import { useTone } from "@/hooks/use-tone";

const CARD_MS = 5500;
const eur = (n: number) => {
  const v = Math.abs(n);
  return `€${Number.isInteger(v) ? v.toLocaleString("en-GB") : v.toFixed(2)}`;
};

/* Background per card, so every tap feels like a new page */
const BACKGROUNDS = [
  "linear-gradient(160deg, hsl(262 83% 45%), hsl(258 60% 18%))",
  "linear-gradient(160deg, hsl(45 95% 52%), hsl(28 90% 45%))",
  "linear-gradient(160deg, hsl(330 75% 50%), hsl(262 70% 30%))",
  "linear-gradient(160deg, hsl(160 70% 38%), hsl(200 70% 25%))",
  "linear-gradient(160deg, hsl(200 85% 45%), hsl(250 60% 25%))",
  "linear-gradient(160deg, hsl(18 90% 55%), hsl(340 70% 35%))",
  "linear-gradient(160deg, hsl(262 83% 60%), hsl(300 60% 30%))",
  "linear-gradient(160deg, hsl(258 50% 22%), hsl(258 42% 8%))",
];

const Big = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
  <p className={`text-[44px] leading-[0.95] font-black tabular ${dark ? "text-[hsl(258_42%_10%)]" : ""}`}>{children}</p>
);
const Small = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
  <p className={`text-[15px] font-extrabold leading-snug mt-3 ${dark ? "text-[hsl(258_42%_10%)]/80" : "text-white/85"}`}>{children}</p>
);
const Kicker = ({ children, dark = false }: { children: ReactNode; dark?: boolean }) => (
  <p className={`text-[12px] font-black uppercase tracking-[0.12em] mb-3 ${dark ? "text-[hsl(258_42%_10%)]/70" : "text-white/70"}`}>{children}</p>
);

/* Full-screen story inside the phone: tap right for next, left for back. Auto-advances unless reduced motion is on. */
const WrappedStory = ({ onClose }: { onClose: () => void }) => {
  const { state } = useGame();
  const { tone } = useTone();
  const still = useReducedMotion() ?? false;
  const w = wrappedFor(state.studentId);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);
  const TopIcon = STUDENT_ICONS[w.top.cat];
  const maxWeek = Math.max(...w.weeks, 1);

  // Shared text has no amounts, only the personality, shares and counts
  const summary = `My ${w.month} on Brokie: I'm ${w.personality.title}. Number one habit: ${w.top.label} (${w.top.share}% of my spending)${w.count ? `, ${w.count.count} ${w.count.plural}` : ""}.`;

  const cards: ReactNode[] = [
    <>
      <BrokieMascot mood="happy" size={110} className="mx-auto" title="" />
      <p className="text-[30px] leading-[1.05] font-black text-center mt-6">
        {w.name}'s {w.month},<br />wrapped
      </p>
      <Small>
        <span className="block text-center">Your month in money. Tap to start.</span>
      </Small>
    </>,
    <>
      <Kicker dark>In {w.month} you spent</Kicker>
      <Big dark>{eur(w.spent)}</Big>
      <Small dark>
        {w.left >= 0 ? `${eur(w.left)} of your ${eur(w.income)} was still there at the end.` : `That's ${eur(w.left)} more than the ${eur(w.income)} that came in.`}
      </Small>
    </>,
    <>
      <Kicker>Your number one habit</Kicker>
      <span className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
        <TopIcon className="w-7 h-7" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <Big>{w.top.label}</Big>
      <Small>
        {eur(w.top.total)}, {w.top.share}% of everything you spent.
      </Small>
    </>,
    w.count && (
      <>
        <Kicker>Your most bought thing</Kicker>
        <Big>
          {w.count.count}
          <br />
          {w.count.plural}
        </Big>
        <Small>
          {eur(w.count.total)} in total, about {w.count.perDay} a day. That's {w.count.busRides} bus rides in Vilnius.
        </Small>
      </>
    ),
    <>
      <Kicker>Your biggest week</Kicker>
      <Big>Week {w.peakWeek + 1}</Big>
      <Small>{eur(w.weeks[w.peakWeek])} on everything except rent.</Small>
      <div className="flex items-end gap-3 h-28 mt-6" aria-hidden="true">
        {w.weeks.map((v, k) => (
          <motion.span
            key={k}
            initial={still ? false : { height: 6 }}
            animate={{ height: Math.max(6, (v / maxWeek) * 100) }}
            transition={{ delay: 0.2 + k * 0.12, duration: 0.5 }}
            className={`flex-1 rounded-lg ${k === w.peakWeek ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>
    </>,
    <>
      <Kicker>Compared with 40 students</Kicker>
      <Big>{w.top.beats}%</Big>
      <Small>
        of students in our data spend less than you on {w.top.label.toLowerCase()}.
      </Small>
    </>,
    <>
      <Kicker>Your money personality</Kicker>
      <BrokieMascot mood={w.personality.mood} size={84} title="" />
      <p className="text-[34px] leading-[1] font-black mt-5">{w.personality.title}</p>
      <Small>{w.personality.line}</Small>
    </>,
    <>
      <Kicker>Brokie's take</Kicker>
      <p className="text-[22px] leading-snug font-black">{w.roast[tone]}</p>
      <p className="text-[12px] font-bold text-white/60 mt-4">Tone: {tone === "savage" ? "Savage" : "Gentle"}. Switch it under the phone.</p>
    </>,
    <>
      <Kicker>Your share card</Kicker>
      {/* No amounts on the card that gets shared: personality, shares and counts only */}
      <div className="rounded-[28px] p-5 bg-[linear-gradient(150deg,hsl(262_83%_58%),hsl(330_75%_50%))] shadow-float">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-black uppercase tracking-[0.12em] text-white/80">
            {w.name}'s {w.month}
          </p>
          <BrokieMascot mood={w.personality.mood} size={34} title="" />
        </div>
        <p className="text-[27px] leading-[1.02] font-black mt-2">{w.personality.title}</p>
        <ul className="mt-4 space-y-2.5 text-[13.5px] font-extrabold">
          <li className="flex justify-between gap-3">
            <span className="text-white/75">Number one habit</span>
            <span className="text-right">{w.top.label}</span>
          </li>
          <li className="flex justify-between gap-3">
            <span className="text-white/75">Share of spending</span>
            <span>{w.top.share}%</span>
          </li>
          {w.count && (
            <li className="flex justify-between gap-3">
              <span className="text-white/75">Most bought</span>
              <span>
                {w.count.count} {w.count.plural}
              </span>
            </li>
          )}
          <li className="flex justify-between gap-3">
            <span className="text-white/75">{w.left >= 0 ? "Income kept" : "Month"}</span>
            <span>{w.left >= 0 ? `${Math.round((w.left / w.income) * 100)}%` : "in the red"}</span>
          </li>
        </ul>
        <p className="mt-4 text-[11px] font-black text-white/70">brokie · level up out of broke</p>
      </div>
      <p className="text-[11.5px] font-bold text-white/55 mt-3">No amounts on this card, so it's safe to post.</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          navigator.clipboard?.writeText(summary).then(() => setCopied(true), () => setCopied(false));
        }}
        className="mt-4 w-full h-11 rounded-xl bg-accent text-accent-foreground text-[14px] font-black inline-flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-4 h-4" strokeWidth={3} aria-hidden="true" /> : <Copy className="w-4 h-4" aria-hidden="true" />}
        {copied ? "Copied" : "Copy to share"}
      </button>
    </>,
  ].filter(Boolean);

  const last = cards.length - 1;
  const next = () => (i < last ? setI(i + 1) : onClose());
  const back = () => setI(Math.max(0, i - 1));

  // Auto-advance, like stories; stops on the last card
  useEffect(() => {
    if (still || i === last) return;
    const t = setTimeout(() => setI((x) => Math.min(last, x + 1)), CARD_MS);
    return () => clearTimeout(t);
  }, [i, last, still]);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${w.name}'s ${w.month}, wrapped`}
      initial={{ opacity: 0, scale: still ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 text-white bg-[hsl(258_42%_10%)]"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") back();
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={i}
          initial={still ? { opacity: 0 } : { opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={still ? { opacity: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex flex-col justify-center px-7 pt-16 pb-10"
          style={{ background: BACKGROUNDS[i % BACKGROUNDS.length] }}
        >
          {cards[i]}
        </motion.div>
      </AnimatePresence>

      {/* tap zones */}
      {i < last && (
        <>
          <button type="button" aria-label="Previous" onClick={back} className="absolute left-0 top-16 bottom-0 w-1/3 z-10" />
          <button type="button" aria-label="Next" onClick={next} className="absolute right-0 top-16 bottom-0 w-2/3 z-10" />
        </>
      )}

      {/* progress + close */}
      <div className="absolute top-9 left-4 right-4 z-20 flex items-center gap-3">
        <div className="flex-1 flex gap-1" aria-label={`Card ${i + 1} of ${cards.length}`}>
          {cards.map((_, k) => (
            <span key={k} className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
              <motion.span
                key={k === i ? `on-${i}` : k}
                className="block h-full bg-white"
                initial={{ width: k < i ? "100%" : "0%" }}
                animate={{ width: k < i || (k === i && (still || i === last)) ? "100%" : k === i ? "100%" : "0%" }}
                transition={k === i && !still && i !== last ? { duration: CARD_MS / 1000, ease: "linear" } : { duration: 0 }}
              />
            </span>
          ))}
        </div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close Wrapped" className="w-8 h-8 rounded-full bg-black/25 flex items-center justify-center">
          <X className="w-4 h-4" strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
};

export default WrappedStory;
