import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Blobs, FadeUp, SectionHeader } from "./product/ProductUI";
import { LevelBadge, ProgressBar, StreakFlame, XpPill } from "./product/GameUI";
import BrokieMascot from "./brand/BrokieMascot";
import { FRIENDS, PROFILE, levelTitle, levelXp } from "@/data/challenges";

const LEVEL_XP = levelXp(PROFILE.level);
const CHECK_IN_XP = 20;

const medal = ["🥇", "🥈", "🥉"];

const GamificationSection = () => {
  const [checkedIn, setCheckedIn] = useState(false);
  const streak = PROFILE.streak + (checkedIn ? 1 : 0);
  const xp = PROFILE.xp + (checkedIn ? CHECK_IN_XP : 0);
  const weekXp = PROFILE.weekXp + (checkedIn ? CHECK_IN_XP : 0);

  const league = [...FRIENDS, { name: "You", xp: weekXp, emoji: "🪙" }].sort((a, b) => b.xp - a.xp);

  return (
    <section id="gamification" className="relative py-24 lg:py-36">
      <Blobs variant={2} />
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Gamification"
          title="Saving money, but make it a game."
          desc="Streaks, XP, levels and weekly challenges built from your own spending. Not lessons. Just a better month, every month."
        />

        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Streak */}
            <FadeUp className="glass rounded-3xl p-6 flex flex-col items-center text-center">
              <p className="micro-label">Daily streak</p>
              <div className="relative text-[56px] mt-3">
                <StreakFlame count={streak} />
                <AnimatePresence>
                  {checkedIn && (
                    <motion.span
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: [0, 1, 0], y: -40 }}
                      transition={{ duration: 1.2 }}
                      className="absolute -top-2 right-0 text-[18px] font-black text-accent"
                      aria-hidden="true"
                    >
                      +{CHECK_IN_XP} XP
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <p className="text-muted-foreground font-semibold mt-1 mb-5">days in a row of checking in</p>
              <button type="button" onClick={() => setCheckedIn(true)} disabled={checkedIn} className="btn-chunky btn-accent w-full mt-auto">
                {checkedIn ? "Checked in ✓" : "Do today's check-in"}
              </button>
            </FadeUp>

            {/* Level + XP */}
            <FadeUp delay={0.06} className="glass rounded-3xl p-6 flex flex-col">
              <p className="micro-label">Level</p>
              <div className="flex items-center gap-4 mt-3">
                <LevelBadge level={PROFILE.level} className="text-[22px] h-16 w-16 rounded-2xl" />
                <div>
                  <p className="text-[20px] font-black leading-tight">{levelTitle(PROFILE.level)}</p>
                  <XpPill xp={xp} className="text-[16px]" />
                </div>
              </div>
              <ProgressBar value={xp} max={LEVEL_XP} label={`XP towards level ${PROFILE.level + 1}`} className="mt-6 h-4" />
              <p className="text-[14px] font-bold text-muted-foreground mt-2 tabular">
                {xp} / {LEVEL_XP} XP to Level {PROFILE.level + 1} · {levelTitle(PROFILE.level + 1)}
              </p>
            </FadeUp>

            {/* Weekly challenge */}
            <FadeUp delay={0.12} className="sm:col-span-2 glass-strong rounded-3xl p-6 flex items-center gap-5">
              <BrokieMascot mood="happy" size={80} className="shrink-0 hidden sm:block" title="" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="micro-label">Monthly challenge</p>
                  <span className="text-[13px] font-extrabold text-muted-foreground">16 days left · +50 XP</span>
                </div>
                <p className="text-[20px] font-black mt-1">Stay under €55 on food delivery this month</p>
                <ProgressBar value={43} max={55} label="Delivery budget used" className="mt-4 h-4" />
                <p className="text-[14px] font-bold text-muted-foreground mt-2">€43 of €55 used, €12 left. Choose wisely. 🍌</p>
              </div>
            </FadeUp>
          </div>

          {/* Friend league */}
          <FadeUp delay={0.1} className="glass rounded-3xl p-6">
            <table className="w-full text-left">
              <caption className="text-left mb-4">
                <span className="micro-label block">Friend league</span>
                <span className="block text-[20px] font-black text-foreground mt-1">This week's XP</span>
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Name</th>
                  <th scope="col">XP</th>
                </tr>
              </thead>
              <tbody>
                {league.map((f, i) => {
                  const you = f.name === "You";
                  return (
                    <motion.tr layout key={f.name} className={you ? "bg-primary/35" : ""}>
                      <td className={`py-3 pl-3 w-10 text-[18px] font-black tabular ${you ? "rounded-l-2xl" : ""}`}>{medal[i] ?? i + 1}</td>
                      <td className="py-3 text-[16px] font-extrabold">
                        <span className="mr-2" aria-hidden="true">
                          {f.emoji}
                        </span>
                        {f.name}
                      </td>
                      <td className={`py-3 pr-3 text-right text-[16px] font-black text-accent tabular ${you ? "rounded-r-2xl" : ""}`}>{f.xp} XP</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </FadeUp>
        </div>
      </div>
    </section>
  );
};

export default GamificationSection;
