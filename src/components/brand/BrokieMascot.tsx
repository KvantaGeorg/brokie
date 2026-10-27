import type { Mood } from "@/data/notifications";

/* Brokie: a chubby gold coin with big eyes, a € stamp, stubby arms and feet. Colours come from theme tokens. */

const Eyes = ({ mood }: { mood: Mood }) => {
  if (mood === "proud") {
    // Happy closed ^^ eyes and a single proud tear
    return (
      <g className="stroke-accent-foreground" strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M38 58 Q45 50 52 58" />
        <path d="M68 58 Q75 50 82 58" />
        <path className="fill-chart-4 stroke-none" d="M85 62 q3 6 0 9 q-3 -3 0 -9z" />
      </g>
    );
  }
  const pupil = mood === "shocked" ? 3.2 : 5;
  const lid = mood === "watching";
  return (
    <g>
      {[45, 75].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="56" rx="9" ry="10.5" fill="#fff" />
          <circle cx={cx + 1.5} cy={lid ? 59 : 57} r={pupil} className="fill-accent-foreground" />
          <circle cx={cx + 3.5} cy={lid ? 56.5 : 54} r="1.8" fill="#fff" />
          {lid && <path d={`M${cx - 10} 53 H${cx + 10} V45 H${cx - 10}z`} className="fill-accent" />}
          {lid && <path d={`M${cx - 9.5} 53 H${cx + 9.5}`} className="stroke-accent-foreground" strokeWidth="3" strokeLinecap="round" />}
        </g>
      ))}
    </g>
  );
};

const Mouth = ({ mood }: { mood: Mood }) => {
  switch (mood) {
    case "shocked":
      return <ellipse cx="60" cy="80" rx="6" ry="7.5" className="fill-accent-foreground" />;
    case "watching":
      return <path d="M50 80 Q60 84 70 78" fill="none" className="stroke-accent-foreground" strokeWidth="3.5" strokeLinecap="round" />;
    default:
      return (
        <g>
          <path d="M47 75 Q60 92 73 75 Z" className="fill-accent-foreground" />
          <path d="M53 82 Q60 88 67 82 Q60 79 53 82Z" className="fill-chart-5" />
        </g>
      );
  }
};

const BrokieMascot = ({ mood = "happy", size = 120, className = "", title = "Brokie the coin" }: { mood?: Mood; size?: number; className?: string; title?: string }) => (
  <svg viewBox="0 0 120 132" width={size} height={size * 1.1} className={className} {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true })}>
    {/* ground shadow */}
    <ellipse cx="60" cy="126" rx="30" ry="4.5" className="fill-black/30" />
    {/* feet */}
    <rect x="40" y="108" width="14" height="14" rx="7" className="fill-accent-deep" />
    <rect x="66" y="108" width="14" height="14" rx="7" className="fill-accent-deep" />
    {/* arms */}
    <path d="M14 70 q-10 -6 -6 -18" fill="none" className="stroke-accent-deep" strokeWidth="7" strokeLinecap="round" />
    <path d="M106 70 q10 -6 6 -18" fill="none" className="stroke-accent-deep" strokeWidth="7" strokeLinecap="round" />
    {/* coin rim + face */}
    <circle cx="60" cy="64" r="50" className="fill-accent-deep" />
    <circle cx="60" cy="61" r="47" className="fill-accent" />
    <circle cx="60" cy="61" r="40" fill="none" className="stroke-accent-deep" strokeOpacity=".45" strokeWidth="2.5" strokeDasharray="3 5" />
    {/* shine */}
    <path d="M26 44 A38 38 0 0 1 48 22" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="5" strokeLinecap="round" />
    {/* € stamp */}
    <text x="60" y="36" textAnchor="middle" fontSize="15" fontWeight="900" className="fill-accent-deep" fontFamily="Nunito, sans-serif">
      €
    </text>
    {/* blush */}
    <ellipse cx="32" cy="72" rx="7" ry="4" className="fill-chart-5" opacity=".55" />
    <ellipse cx="88" cy="72" rx="7" ry="4" className="fill-chart-5" opacity=".55" />
    <Eyes mood={mood} />
    <Mouth mood={mood} />
  </svg>
);

export default BrokieMascot;
