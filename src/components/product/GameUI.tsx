/* Small game-style pieces shared by the app screens and landing previews. */

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
