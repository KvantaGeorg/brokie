/* Game rules and mock profile for the demo user: challenges, levels and the friend league.
   XP only ever comes from completed activities; it is kept apart from money. */

export type ChallengeId = "focus-budget" | "check-budget" | "goal-add";
export type ChallengeStatus = "active" | "done" | "missed";

/* Where a challenge's progress comes from, shown on the card so simulated progress is never mistaken for real behaviour. */
export type ProgressSource = "transactions" | "app" | "you";

export const CHALLENGE_DEFS: { id: ChallengeId; xp: number; source: ProgressSource }[] = [
  { id: "goal-add", xp: 30, source: "you" },
  { id: "check-budget", xp: 20, source: "app" },
  { id: "focus-budget", xp: 50, source: "transactions" },
];

export const CHECK_DAYS_GOAL = 3;
export const GOAL_ADD_TARGET = 10;

export const PROFILE = {
  name: "Rūta",
  handle: "@ruta.saves",
  level: 7,
  xp: 440, // progress inside the current level
  totalXp: 2840,
  weekXp: 340,
  streak: 12,
  bestStreak: 21,
};

/* Level ladder: XP needed to finish a level grows by 100 each time. */
const LEVEL_TITLES: Record<number, string> = {
  6: "Coin Rookie",
  7: "Budget Padawan",
  8: "Money Ninja",
  9: "Coin Whisperer",
  10: "Budget Boss",
};
export const levelTitle = (level: number) => LEVEL_TITLES[level] ?? "Broke-No-More Legend";
export const levelXp = (level: number) => 500 + Math.max(0, level - 7) * 100;

export const FRIENDS = [
  { name: "Gabija", xp: 410 },
  { name: "Matas", xp: 365 },
  { name: "Emilija", xp: 290 },
  { name: "Lukas", xp: 255 },
  { name: "Sofia", xp: 180 },
];
