import { AnimatePresence, motion } from "framer-motion";
import { Check, FlaskConical, X } from "lucide-react";
import { ProgressBar } from "../GameUI";
import { CHALLENGE_ICONS, STUDENT_ICONS } from "./icons";
import { SOURCE_LABEL, type ChallengeView } from "./challengeModel";
import { useGame, useStudent } from "@/hooks/use-game";
import type { PhoneTab } from "./tabs";

/* Floating "+30 XP" when a challenge pays out. */
const XpPop = ({ amount }: { amount: number }) => (
  <motion.span
    initial={{ opacity: 0, y: 6, scale: 0.8 }}
    animate={{ opacity: [0, 1, 1, 0], y: -30, scale: 1.15 }}
    transition={{ duration: 1.3, ease: "easeOut" }}
    className="pointer-events-none absolute right-3 top-2 z-10 rounded-full bg-accent px-2 py-0.5 text-[11px] font-black text-accent-foreground"
    aria-hidden="true"
  >
    +{amount} XP
  </motion.span>
);

/* Simulated actions look different from real ones: dashed outline and a "Demo" label. */
const DemoButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg border border-dashed border-white/30 text-[11px] font-extrabold text-white/70 hover:text-white hover:border-white/60"
  >
    <FlaskConical className="w-3 h-3" aria-hidden="true" />
    <span className="sr-only">Simulated demo action:</span> {label}
  </button>
);

const ChallengeCard = ({ c, interactive = true, onNavigate }: { c: ChallengeView; interactive?: boolean; onNavigate?: (tab: PhoneTab) => void }) => {
  const { state, addToGoal, nextDay, monthEnd } = useGame();
  const { focus } = useStudent();
  const Icon = c.id === "focus-budget" ? STUDENT_ICONS[focus] : CHALLENGE_ICONS[c.id];
  const gain = state.lastGain?.id === c.id ? state.lastGain : null;
  const done = c.status === "done";
  const missed = c.status === "missed";

  return (
    <div className={`relative rounded-2xl border p-3 ${done ? "bg-chart-2/10 border-chart-2/30" : "bg-white/[0.06] border-white/10"}`}>
      <AnimatePresence>{gain && <XpPop key={gain.key} amount={gain.amount} />}</AnimatePresence>
      <div className="flex items-start gap-2.5">
        <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${done ? "bg-chart-2 text-white" : "bg-primary/25 text-primary-glow"}`}>
          {done ? <Check className="w-4 h-4" strokeWidth={3.5} aria-hidden="true" /> : <Icon className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-extrabold leading-snug">{c.title}</p>
          <p className="text-[11.5px] font-bold text-white/55 mt-0.5 leading-snug">{c.description}</p>
        </div>
        <span className={`shrink-0 text-[11px] font-black ${done ? "text-chart-2" : "text-accent"}`}>{done ? "Done" : missed ? "Missed" : `+${c.xp} XP`}</span>
      </div>

      <div className="flex items-center gap-2.5 mt-3">
        <ProgressBar value={c.value} max={c.max} label={`${c.title} progress`} className="flex-1 h-2" />
        <span className="text-[11px] font-black tabular text-white/70">{c.progressText}</span>
      </div>
      <p className="text-[10px] font-extrabold text-white/40 mt-1.5">{SOURCE_LABEL[c.source]}</p>

      {interactive && c.status === "active" && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {c.id === "goal-add" &&
            (state.goal ? (
              <button
                type="button"
                onClick={() => addToGoal(10)}
                className="inline-flex items-center h-7 px-2.5 rounded-lg bg-accent text-accent-foreground text-[11.5px] font-black shadow-[0_2px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none"
              >
                Record €10 set aside
              </button>
            ) : (
              <span className="text-[11px] font-bold text-white/50">{c.blocked}</span>
            ))}
          {c.id === "check-budget" && (
            <>
              {onNavigate && (
                <button type="button" onClick={() => onNavigate("spending")} className="inline-flex items-center h-7 px-2.5 rounded-lg bg-white/10 text-[11.5px] font-extrabold hover:bg-white/15">
                  Open budget
                </button>
              )}
              <DemoButton label="Next day" onClick={nextDay} />
            </>
          )}
          {c.id === "focus-budget" && <DemoButton label="Simulate month end" onClick={monthEnd} />}
        </div>
      )}
      {missed && (
        <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-white/55">
          <X className="w-3 h-3" aria-hidden="true" /> No XP this time. A new month brings a new try.
        </p>
      )}
    </div>
  );
};

export default ChallengeCard;
