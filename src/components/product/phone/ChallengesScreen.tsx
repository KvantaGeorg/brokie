import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Plus, RotateCcw } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import { formatProgress, stepFor, type Challenge } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";

const logLabel = (c: Challenge) => (c.unit === "€" ? `+€${stepFor(c)} saved` : c.unit === "days" ? "+1 day" : "+1 time");

/* Floating "+10 XP" that rises off a card after each log. */
const XpPop = ({ amount, completed }: { amount: number; completed: boolean }) => (
  <motion.span
    initial={{ opacity: 0, y: 6, scale: 0.8 }}
    animate={{ opacity: [0, 1, 1, 0], y: -34, scale: completed ? 1.25 : 1 }}
    transition={{ duration: 1.1, ease: "easeOut" }}
    className="pointer-events-none absolute right-3 top-2 z-10 rounded-full bg-accent px-2 py-0.5 text-[12px] font-black text-accent-foreground shadow-[0_3px_0_hsl(var(--accent-deep))]"
    aria-hidden="true"
  >
    +{amount} XP{completed ? " 🎉" : ""}
  </motion.span>
);

/* Active challenges you can log progress on, then the ones already won. */
const ChallengesScreen = () => {
  const { state, logProgress, reset } = useGame();
  const still = useReducedMotion() ?? false;
  const active = state.challenges.filter((c) => c.status === "active");
  const done = state.challenges.filter((c) => c.status === "done");
  const gain = state.lastGain;

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-3">
        <BrokieMascot mood={active.length ? "proud" : "happy"} size={48} className="shrink-0" title="" />
        <div>
          <h2 className="text-[20px] font-black leading-tight">Challenges</h2>
          <p className="text-[12px] font-bold text-white/65">Log progress, earn XP, level up</p>
        </div>
      </div>

      {/* screen reader announcement for each log */}
      <p className="sr-only" aria-live="polite">
        {gain ? `${gain.completed ? "Challenge complete! " : "Progress logged. "}Plus ${gain.amount} XP.` : ""}
      </p>

      <h3 className="text-[12px] font-black tracking-[0.08em] text-accent mt-4 mb-2">THIS WEEK</h3>
      <motion.ul layout={!still} className="space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {active.map((c, i) => (
            <motion.li
              key={c.id}
              layout={!still}
              exit={still ? { opacity: 0 } : { opacity: 0, scale: 0.9, x: 40 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`relative rounded-2xl p-3 ${i === 0 ? "glass-strong ring-1 ring-accent/40" : "glass"}`}
            >
              <AnimatePresence>{gain?.challengeId === c.id && <XpPop key={gain.key} amount={gain.amount} completed={gain.completed} />}</AnimatePresence>
              <div className="flex items-start gap-2.5">
                <span className="w-9 h-9 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-[18px]" aria-hidden="true">
                  {c.emoji}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-extrabold leading-snug">{c.title}</p>
                  <p className="text-[11px] font-bold text-white/60 mt-0.5">
                    {c.left} · <span className="text-accent">+{c.xp} XP</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                <ProgressBar value={c.progress} max={c.goal} label={`${c.title} progress`} className="flex-1 h-2.5" />
                <span className="text-[11px] font-black tabular">{formatProgress(c)}</span>
              </div>
              <button
                type="button"
                onClick={() => logProgress(c.id)}
                className="btn-chunky btn-accent w-full h-9 mt-2.5 rounded-xl text-[13px]"
                aria-label={`Log progress on ${c.title}: ${logLabel(c)}, +10 XP`}
              >
                <Plus className="w-4 h-4" strokeWidth={3} aria-hidden="true" /> {logLabel(c)}
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
        {!active.length && (
          <li className="rounded-2xl border-2 border-dashed border-white/15 p-4 text-center text-[13px] font-extrabold text-white/80">
            All challenges done this week! Brokie is shedding a single proud tear. 🥹
          </li>
        )}
      </motion.ul>

      <h3 className="text-[12px] font-black tracking-[0.08em] text-white/60 mt-5 mb-2">COMPLETED</h3>
      <ul className="space-y-1.5">
        <AnimatePresence initial={false}>
          {done.map((c) => (
            <motion.li
              key={c.id}
              layout={!still}
              initial={still ? { opacity: 0 } : { opacity: 0, scale: 0.85, backgroundColor: "hsl(145 60% 40% / 0.5)" }}
              animate={{ opacity: 1, scale: 1, backgroundColor: "rgba(255,255,255,0.05)" }}
              transition={{ type: "spring", stiffness: 300, damping: 22, backgroundColor: { duration: 1.2 } }}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5"
            >
              <span className="w-6 h-6 shrink-0 rounded-full bg-chart-2 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />
              </span>
              <span className="flex-1 text-[12.5px] font-extrabold leading-snug">{c.title}</span>
              <span className="text-[11px] font-black text-accent">+{c.xp}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <button
        type="button"
        onClick={reset}
        className="mt-5 mx-auto flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-extrabold text-white/55 hover:text-white hover:bg-white/[0.06]"
      >
        <RotateCcw className="w-3 h-3" aria-hidden="true" /> Reset demo progress
      </button>
    </div>
  );
};

export default ChallengesScreen;
