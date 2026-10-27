import { motion, useReducedMotion } from "framer-motion";
import { Flame, Zap } from "lucide-react";

/* Streak, total XP and level: the app's status row. */
const AppTopBar = ({ streak, totalXp, level }: { streak: number; totalXp: number; level: number }) => {
  const still = useReducedMotion() ?? false;
  return (
    <div className="relative z-10 flex items-center justify-between px-5 pt-11 pb-3 text-[14px] font-black">
      <span className="inline-flex items-center gap-1 text-chart-6" aria-label={`${streak}-day streak`}>
        <Flame className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
        <span className="tabular">{streak}</span>
      </span>
      <motion.span
        key={`xp-${totalXp}`}
        initial={still ? false : { scale: 1.3 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 14 }}
        className="inline-flex items-center gap-1 text-accent"
        aria-label={`${totalXp} XP`}
      >
        <Zap className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
        <span className="tabular">{totalXp}</span>
      </motion.span>
      <motion.span
        key={`lv-${level}`}
        initial={still ? false : { scale: 1.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 12 }}
        className="rounded-lg bg-primary px-2 py-0.5 text-[12px] text-primary-foreground"
        aria-label={`Level ${level}`}
      >
        Lv {level}
      </motion.span>
    </div>
  );
};

export default AppTopBar;
