import BrokieMascot from "../../brand/BrokieMascot";
import { LevelBadge, ProgressBar } from "../GameUI";
import { ACHIEVEMENTS, FRIENDS, PROFILE, levelTitle, levelXp } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";

const medal = ["🥇", "🥈", "🥉"];

/* Level, stats, achievements and the top of the friend league. */
const ProfileScreen = () => {
  const p = PROFILE;
  const { state } = useGame();
  const need = levelXp(state.level);
  const league = [...FRIENDS, { name: "You", xp: state.weekXp, emoji: "🪙" }].sort((a, b) => b.xp - a.xp);
  const youRank = league.findIndex((f) => f.name === "You");

  const stats = [
    { value: `🔥 ${p.streak}`, label: "day streak" },
    { value: `🏅 ${p.bestStreak}`, label: "best streak" },
    { value: `€${p.savedThisMonth}`, label: "saved" },
  ];

  return (
    <div className="px-4 pb-4">
      <div className="flex items-center gap-3">
        <span className="w-16 h-16 shrink-0 rounded-2xl bg-primary/35 ring-2 ring-accent/60 flex items-center justify-center">
          <BrokieMascot mood="happy" size={50} title="" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[20px] font-black leading-tight">{p.name}</h2>
          <p className="text-[12px] font-bold text-white/60">{p.handle}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[12px] font-extrabold">
            <LevelBadge level={state.level} className="text-[11px] h-6 px-2" /> {levelTitle(state.level)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar value={state.xp} max={need} label={`XP towards level ${state.level + 1}`} className="h-3" />
        <p className="text-[11px] font-bold text-white/60 mt-1.5 tabular">
          {state.xp} / {need} XP to {levelTitle(state.level + 1)}
        </p>
      </div>

      <ul className="grid grid-cols-3 gap-2 mt-4">
        {stats.map((s) => (
          <li key={s.label} className="glass rounded-xl px-2 py-2.5 text-center">
            <span className="block text-[15px] font-black tabular">{s.value}</span>
            <span className="block text-[10.5px] font-bold text-white/60">{s.label}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-[12px] font-black tracking-[0.08em] text-accent mt-5 mb-2">ACHIEVEMENTS</h3>
      <ul className="grid grid-cols-3 gap-2">
        {ACHIEVEMENTS.map((a) => (
          <li
            key={a.id}
            className={`rounded-xl px-1.5 py-2.5 text-center ${a.unlocked ? "bg-accent/15 ring-1 ring-accent/40" : "bg-white/[0.04] opacity-60"}`}
          >
            <span className={`block text-[22px] leading-none ${a.unlocked ? "" : "grayscale"}`} aria-hidden="true">
              {a.emoji}
            </span>
            <span className="block text-[10.5px] font-extrabold mt-1.5 leading-tight">{a.title}</span>
            <span className="sr-only">{a.unlocked ? "unlocked" : "locked"}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-[12px] font-black tracking-[0.08em] text-white/60 mt-5 mb-2">FRIEND LEAGUE · #{youRank + 1}</h3>
      <ol className="space-y-1">
        {league.slice(0, 4).map((f, i) => (
          <li key={f.name} className={`flex items-center gap-2 rounded-xl px-3 py-2 ${f.name === "You" ? "bg-primary/40" : "bg-white/[0.05]"}`}>
            <span className="w-5 text-[13px] font-black">{medal[i] ?? i + 1}</span>
            <span className="flex-1 text-[12.5px] font-extrabold">
              <span aria-hidden="true">{f.emoji}</span> {f.name}
            </span>
            <span className="text-[12px] font-black text-accent tabular">{f.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default ProfileScreen;
