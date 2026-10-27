import { Check, Flame, Target, Trophy, Users, Zap } from "lucide-react";
import { SectionHeader } from "./product/ProductUI";
import { ProgressBar } from "./product/GameUI";
import BrokieMascot from "./brand/BrokieMascot";
import { FRIENDS, PROFILE, levelTitle, levelXp } from "@/data/challenges";
import { SUGGESTED_BUDGET, thisMonth } from "@/data/budget";

const features = [
  { icon: Target, title: "Personalized challenges", desc: "Challenges based on your spending, not random financial advice.", example: "Stay under €55 on delivery this month." },
  { icon: Zap, title: "XP & levels", desc: "Earn XP for completed challenges and consistent engagement.", example: `Level ${PROFILE.level}, ${levelTitle(PROFILE.level)}.` },
  { icon: Users, title: "Streaks & friends", desc: "Keep your daily check-in streak alive and see how your friends are progressing.", example: `${PROFILE.streak}-day streak.` },
];

/* One preview that combines a challenge, level progress, the streak and a glance at friends. */
const Preview = () => {
  const spent = thisMonth.byCategory("delivery");
  const top = [...FRIENDS.slice(0, 2), { name: "You", xp: PROFILE.weekXp }].sort((a, b) => b.xp - a.xp);
  return (
    <div className="surface rounded-3xl p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrokieMascot mood="proud" size={44} title="" />
          <div>
            <p className="text-[18px] font-black leading-tight">
              Level {PROFILE.level} · {levelTitle(PROFILE.level)}
            </p>
            <p className="text-[13px] font-bold text-muted-foreground tabular">
              {PROFILE.xp} / {levelXp(PROFILE.level)} XP
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[15px] font-black text-chart-6">
          <Flame className="w-5 h-5" strokeWidth={2.25} aria-hidden="true" /> {PROFILE.streak}
          <span className="sr-only">day streak</span>
        </span>
      </div>
      <ProgressBar value={PROFILE.xp} max={levelXp(PROFILE.level)} label={`XP towards level ${PROFILE.level + 1}`} className="mt-4" />

      <div className="mt-6 rounded-2xl border border-white/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[16px] font-extrabold leading-snug">Stay under €{SUGGESTED_BUDGET.delivery} on delivery this month</p>
          <span className="text-[13px] font-black text-accent shrink-0">+50 XP</span>
        </div>
        <ProgressBar value={spent} max={SUGGESTED_BUDGET.delivery} label="Delivery budget used" className="mt-3" />
        <p className="text-[13px] font-bold text-muted-foreground mt-2 tabular">
          €{Math.round(spent)} of €{SUGGESTED_BUDGET.delivery} used · 16 days left
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 p-4">
        <span className="flex items-center gap-2 text-[14px] font-extrabold">
          <Trophy className="w-4 h-4 text-accent" aria-hidden="true" /> Friends this week
        </span>
        <span className="flex items-center gap-2">
          {top.map((f) => (
            <span
              key={f.name}
              title={`${f.name}: ${f.xp} XP`}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black ${f.name === "You" ? "bg-accent text-accent-foreground" : "bg-white/10"}`}
            >
              {f.name[0]}
            </span>
          ))}
          <span className="text-[13px] font-bold text-muted-foreground ml-1">You're #3</span>
        </span>
      </div>

      <p className="mt-5 flex items-center gap-2 text-[13px] font-bold text-muted-foreground">
        <Check className="w-4 h-4 text-chart-2" aria-hidden="true" /> XP measures progress in Brokie, not money.
      </p>
    </div>
  );
};

const GamificationSection = () => (
  <section id="gamification" className="section section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader label="Gamification" title="Better habits. Bigger wins." desc="Turn everyday financial decisions into small challenges, build your streak, and level up along the way." />
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <ul className="space-y-8">
          {features.map(({ icon: Icon, title, desc, example }) => (
            <li key={title} className="flex gap-4">
              <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/15 text-primary-glow flex items-center justify-center">
                <Icon className="w-5 h-5" strokeWidth={2} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[20px]">{title}</h3>
                <p className="text-[16px] font-semibold text-muted-foreground mt-1">{desc}</p>
                <p className="text-[14px] font-bold text-foreground/80 mt-2">{example}</p>
              </div>
            </li>
          ))}
        </ul>
        <Preview />
      </div>
    </div>
  </section>
);

export default GamificationSection;
