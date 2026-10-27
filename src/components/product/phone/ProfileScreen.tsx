import { Flame, PiggyBank, Trophy } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import { FRIENDS, PROFILE, levelTitle, levelXp } from "@/data/challenges";
import { useGame } from "@/hooks/use-game";

/* Level progress, three stats and the top of the friend league. */
const ProfileScreen = () => {
  const p = PROFILE;
  const { state } = useGame();
  const need = levelXp(state.level);
  const league = [...FRIENDS.map((f) => ({ name: f.name, xp: f.xp })), { name: "You", xp: state.weekXp }].sort((a, b) => b.xp - a.xp);
  const youRank = league.findIndex((f) => f.name === "You");

  const stats = [
    { icon: Flame, value: String(p.streak), label: "Day streak" },
    { icon: Trophy, value: String(p.bestStreak), label: "Best streak" },
    { icon: PiggyBank, value: `€${p.savedThisMonth}`, label: "Saved" },
  ];

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-3">
        <span className="w-14 h-14 shrink-0 rounded-2xl bg-primary/30 flex items-center justify-center">
          <BrokieMascot mood="happy" size={42} title="" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[19px] font-black leading-tight">{p.name}</h2>
          <p className="text-[12px] font-bold text-white/50">
            Level {state.level} · {levelTitle(state.level)}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <ProgressBar value={state.xp} max={need} label={`XP towards level ${state.level + 1}`} className="h-2.5" />
        <p className="text-[11px] font-bold text-white/50 mt-1.5 tabular">
          {state.xp} / {need} XP to {levelTitle(state.level + 1)}
        </p>
      </div>

      <ul className="grid grid-cols-3 gap-2 mt-5">
        {stats.map(({ icon: Icon, value, label }) => (
          <li key={label} className="rounded-xl bg-white/[0.06] px-2 py-2.5 text-center">
            <Icon className="w-4 h-4 mx-auto text-accent" strokeWidth={2.5} aria-hidden="true" />
            <span className="block text-[15px] font-black tabular mt-1">{value}</span>
            <span className="block text-[10.5px] font-bold text-white/50">{label}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-1">Friend league · you're #{youRank + 1}</h3>
      <ol className="divide-y divide-white/[0.07]">
        {league.slice(0, 4).map((f, i) => {
          const you = f.name === "You";
          return (
            <li key={f.name} className="flex items-center gap-2.5 py-2">
              <span className={`w-5 text-[12px] font-black tabular ${i < 3 ? "text-accent" : "text-white/50"}`}>{i + 1}</span>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${you ? "bg-accent text-accent-foreground" : "bg-white/10"}`} aria-hidden="true">
                {f.name[0]}
              </span>
              <span className={`flex-1 text-[12.5px] font-extrabold ${you ? "text-accent" : ""}`}>{f.name}</span>
              <span className="text-[12px] font-black tabular text-white/70">{f.xp} XP</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ProfileScreen;
