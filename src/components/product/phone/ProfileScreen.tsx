import { Bell, BookOpen, CalendarCheck, ChevronRight, CircleHelp, Globe, Landmark, Lock, LogOut, Moon, Shield, Sparkles, Flame, UserRound, GraduationCap, PiggyBank, RotateCcw, Target, TrendingDown, Trophy, Users, Wallet, type LucideIcon } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import { FRIENDS, PROFILE, levelTitle, levelXp } from "@/data/challenges";
import { catMeta, type Cat } from "@/data/students";
import { useGame, useStudent, type GameState } from "@/hooks/use-game";
import { useOpenSheet } from "./sheets";

const FOCUS_SHORT: Partial<Record<Cat, string>> = { eatingOut: "Eating-out", fun: "Fun budget", shopping: "Shopping" };

/* Achievements unlock from what the user actually did in this session. */
const achievements = (s: GameState, focusLabel: string): { id: string; icon: LucideIcon; title: string; unlocked: boolean }[] => [
  { id: "budget", icon: Wallet, title: "First budget", unlocked: s.budgetConfirmed },
  { id: "goal", icon: Target, title: "Goal setter", unlocked: !!s.goal },
  { id: "saver", icon: PiggyBank, title: "Halfway there", unlocked: !!s.goal && s.goal.saved >= s.goal.target / 2 },
  { id: "checker", icon: CalendarCheck, title: "Budget habit", unlocked: s.challenges["check-budget"] === "done" },
  { id: "first", icon: Trophy, title: "First challenge", unlocked: Object.values(s.challenges).includes("done") },
  { id: "focus", icon: TrendingDown, title: `${focusLabel} tamer`, unlocked: s.challenges["focus-budget"] === "done" },
  { id: "learner", icon: GraduationCap, title: "Money learner", unlocked: Object.keys(s.lessons).length >= 3 },
  { id: "scholar", icon: BookOpen, title: "All lessons", unlocked: Object.keys(s.lessons).length >= 6 },
];

/* Level, streaks, achievements and the weekly friend league. */
const ProfileScreen = () => {
  const open = useOpenSheet();
  const p = PROFILE;
  const { state, restart, goTo } = useGame();
  const { student, focus } = useStudent();
  const need = levelXp(state.level);
  const league = [...FRIENDS.map((f) => ({ name: f.name, xp: f.xp })), { name: "You", xp: state.weekXp }].sort((a, b) => b.xp - a.xp);
  const youRank = league.findIndex((f) => f.name === "You");

  const stats = [
    { icon: Flame, value: String(p.streak), label: "Day streak" },
    { icon: Trophy, value: String(p.bestStreak), label: "Best streak" },
    { icon: PiggyBank, value: state.goal ? `€${Math.round(state.goal.saved)}` : "€0", label: "Goal savings" },
  ];

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-3">
        <span className="w-14 h-14 shrink-0 rounded-2xl bg-primary/30 flex items-center justify-center">
          <BrokieMascot mood="happy" size={42} title="" />
        </span>
        <div className="min-w-0">
          <h2 className="text-[19px] font-black leading-tight">{student.name}</h2>
          <p className="text-[11.5px] font-bold text-white/50 truncate">
            {student.age} · {student.uniShort}, year {student.studyYear} · {student.city}
          </p>
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

      <ul className="grid grid-cols-3 gap-2 mt-4">
        {stats.map(({ icon: Icon, value, label }) => (
          <li key={label} className="rounded-xl bg-white/[0.06] px-2 py-2.5 text-center">
            <Icon className="w-4 h-4 mx-auto text-accent" strokeWidth={2.5} aria-hidden="true" />
            <span className="block text-[15px] font-black tabular mt-1">{value}</span>
            <span className="block text-[10.5px] font-bold text-white/50">{label}</span>
          </li>
        ))}
      </ul>

      <button type="button" onClick={() => open({ kind: "wrapped" })} className="mt-4 w-full flex items-center gap-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.09] px-3 py-2.5 text-left">
        <Sparkles className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
        <span className="flex-1 text-[13px] font-extrabold">October, wrapped</span>
        <ChevronRight className="w-4 h-4 text-white/40" aria-hidden="true" />
      </button>

      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-2">Achievements</h3>
      <ul className="grid grid-cols-4 gap-1.5">
        {achievements(state, FOCUS_SHORT[focus] ?? catMeta(focus).label).map(({ id, icon: Icon, title, unlocked }) => (
          <li key={id} className={`rounded-xl px-1.5 py-2.5 text-center ${unlocked ? "bg-accent/15" : "bg-white/[0.04]"}`}>
            <Icon className={`w-4 h-4 mx-auto ${unlocked ? "text-accent" : "text-white/30"}`} strokeWidth={2.5} aria-hidden="true" />
            <span className={`block text-[10.5px] font-extrabold mt-1.5 leading-tight ${unlocked ? "" : "text-white/40"}`}>{title}</span>
            <span className="sr-only">{unlocked ? "unlocked" : "locked"}</span>
          </li>
        ))}
      </ul>

      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-1">Friend league this week · you're #{youRank + 1}</h3>
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

      {/* settings: shown to make the app feel complete; the pages behind them aren't part of the demo */}
      <h3 className="text-[11px] font-extrabold text-white/50 mt-5 mb-1.5">Settings</h3>
      <ul className="rounded-2xl bg-white/[0.05] divide-y divide-white/[0.06] overflow-hidden">
        {[
          { icon: UserRound, label: "Profile", value: `@${student.handle.replace("_", ".")}` },
          { icon: Landmark, label: "Bank connections", value: student.bank },
          { icon: Bell, label: "Notifications", value: student.frequency },
          { icon: Globe, label: "Language", value: student.language },
          { icon: Moon, label: "Appearance", value: "Dark" },
          { icon: Lock, label: "Privacy and data" },
          { icon: Shield, label: "Privacy policy" },
          { icon: CircleHelp, label: "Help and support" },
        ].map(({ icon: Icon, label, value }) => (
          <li key={label} className="flex items-center gap-3 px-3 py-2.5 text-[12.5px] font-extrabold">
            <Icon className="w-4 h-4 shrink-0 text-white/55" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {value && <span className="text-[11.5px] font-bold text-white/45 truncate max-w-[45%]">{value}</span>}
            <ChevronRight className="w-3.5 h-3.5 shrink-0 text-white/30" aria-hidden="true" />
          </li>
        ))}
        <li className="flex items-center gap-3 px-3 py-2.5 text-[12.5px] font-extrabold text-destructive">
          <LogOut className="w-4 h-4 shrink-0" aria-hidden="true" />
          Log out
        </li>
      </ul>

      <div className="mt-5 flex flex-col items-center gap-1">
        <button type="button" onClick={() => goTo("student")} className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-[12px] font-black">
          <Users className="w-3.5 h-3.5" aria-hidden="true" /> Switch student
        </button>
        <button type="button" onClick={restart} className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-extrabold text-white/45 hover:text-white">
          <RotateCcw className="w-3 h-3" aria-hidden="true" /> Restart demo from sign-up
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;
