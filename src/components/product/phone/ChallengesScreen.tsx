import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Plus, RotateCcw } from "lucide-react";
import { ProgressBar } from "../GameUI";
import { challengeIcon } from "./icons";
import { formatProgress, stepFor, type Challenge } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";

const logLabel = (c: Challenge) => (c.unit === "€" ? `+€${stepFor(c)}` : c.unit === "days" ? "+1 day" : "+1");

/* Floating "+10 XP" that rises off a card after each log. */
const XpPop = ({ amount, completed }: { amount: number; completed: boolean }) => (
  <motion.span
    initial={{ opacity: 0, y: 6, scale: 0.8 }}
    animate={{ opacity: [0, 1, 1, 0], y: -30, scale: completed ? 1.2 : 1 }}
    transition={{ duration: 1.1, ease: "easeOut" }}
    className="pointer-events-none absolute right-3 top-2 z-10 rounded-full bg-accent px-2 py-0.5 text-[11px] font-black text-accent-foreground"
    aria-hidden="true"
  >
    +{amount} XP
  </motion.span>
);

/* Active challenges you can log progress on, then the ones already won. */
const ChallengesScreen = ({ showReset = true }: { showReset?: boolean }) => {
  const { state, logProgress, reset } = useGame();
  const still = useReducedMotion() ?? false;
  const active = state.challenges.filter((c) => c.status === "active");
  const done = state.challenges.filter((c) => c.status === "done");
  const gain = state.lastGain;

  return (
    <div className="px-5 pb-4">
      <h2 className="text-[19px] font-black leading-tight">Challenges</h2>
      <p className="text-[12px] font-bold text-white/50">Built from your own spending</p>

      {/* screen reader announcement for each log */}
      <p className="sr-only" aria-live="polite">
        {gain ? `${gain.completed ? "Challenge complete! " : "Progress logged. "}Plus ${gain.amount} XP.` : ""}
      </p>

      <h3 className="text-[11px] font-extrabold text-white/50 mt-4 mb-2">This week</h3>
      <motion.ul layout={!still} className="space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {active.map((c) => {
            const Icon = challengeIcon(c.id);
            return (
              <motion.li
                key={c.id}
                layout={!still}
                exit={still ? { opacity: 0 } : { opacity: 0, scale: 0.92, x: 40 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className="relative rounded-2xl bg-white/[0.06] border border-white/10 p-3"
              >
                <AnimatePresence>{gain?.challengeId === c.id && <XpPop key={gain.key} amount={gain.amount} completed={gain.completed} />}</AnimatePresence>
                <div className="flex items-start gap-2.5">
                  <span className="w-8 h-8 shrink-0 rounded-lg bg-primary/25 text-primary-glow flex items-center justify-center">
                    <Icon className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-extrabold leading-snug">{c.title}</p>
                    <p className="text-[11px] font-bold text-white/50 mt-0.5">
                      {c.left} · +{c.xp} XP
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 mt-3">
                  <ProgressBar value={c.progress} max={c.goal} label={`${c.title} progress`} className="flex-1 h-2" />
                  <span className="text-[11px] font-black tabular text-white/70">{formatProgress(c)}</span>
                  <button
                    type="button"
                    onClick={() => logProgress(c.id)}
                    className="inline-flex items-center gap-0.5 h-7 px-2.5 rounded-lg bg-accent text-accent-foreground text-[11.5px] font-black shadow-[0_2px_0_hsl(var(--accent-deep))] transition-transform active:translate-y-0.5 active:shadow-none"
                    aria-label={`Log progress on ${c.title}: ${logLabel(c)}, +10 XP`}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" />
                    {logLabel(c).replace("+", "")}
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
        {!active.length && <li className="rounded-2xl bg-white/[0.04] p-4 text-center text-[12.5px] font-extrabold text-white/70">All done this week. Brokie is proud of you.</li>}
      </motion.ul>

      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-1">Completed</h3>
      <ul className="divide-y divide-white/[0.07]">
        <AnimatePresence initial={false}>
          {done.map((c) => (
            <motion.li
              key={c.id}
              layout={!still}
              initial={still ? { opacity: 0 } : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="flex items-center gap-2.5 py-2"
            >
              <span className="w-5 h-5 shrink-0 rounded-full bg-chart-2 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" strokeWidth={4} aria-hidden="true" />
              </span>
              <span className="flex-1 text-[12.5px] font-bold text-white/80 leading-snug">{c.title}</span>
              <span className="text-[11px] font-black text-accent">+{c.xp}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {showReset && (
        <button
          type="button"
          onClick={reset}
          className="mt-4 mx-auto flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-extrabold text-white/45 hover:text-white"
        >
          <RotateCcw className="w-3 h-3" aria-hidden="true" /> Reset demo progress
        </button>
      )}
    </div>
  );
};

export default ChallengesScreen;
