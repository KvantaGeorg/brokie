import { Flame, Zap } from "lucide-react";

/* Small game-style pieces shared by the phone mockup and the gamification section. */

export const StreakFlame = ({ count, className = "" }: { count: number; className?: string }) => (
  <span className={`inline-flex items-center gap-1 font-black text-chart-6 ${className}`} aria-label={`${count}-day streak`}>
    <Flame className="w-[1.15em] h-[1.15em] fill-accent text-chart-6 animate-flame" aria-hidden="true" />
    <span className="tabular">{count}</span>
  </span>
);

export const XpPill = ({ xp, className = "" }: { xp: number; className?: string }) => (
  <span className={`inline-flex items-center gap-1 font-black text-accent ${className}`} aria-label={`${xp} XP`}>
    <Zap className="w-[1.05em] h-[1.05em] fill-accent" aria-hidden="true" />
    <span className="tabular">{xp}</span>
  </span>
);

export const LevelBadge = ({ level, className = "" }: { level: number; className?: string }) => (
  <span
    className={`inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shadow-[0_3px_0_hsl(var(--primary-deep))] ${className}`}
    aria-label={`Level ${level}`}
  >
    Lv {level}
  </span>
);

export const ProgressBar = ({ value, max, className = "", label }: { value: number; max: number; className?: string; label: string }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`relative h-3 rounded-full bg-white/10 overflow-hidden ${className}`}
    >
      <div className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-700" style={{ width: `${pct}%` }}>
        <div className="absolute left-2 right-2 top-[3px] h-[3px] rounded-full bg-white/50" />
      </div>
    </div>
  );
};
