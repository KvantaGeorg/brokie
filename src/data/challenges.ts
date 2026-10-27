/* Mock game state for the demo user: challenges, achievements and the friend league. */

export type Challenge = {
  id: string;
  title: string;
  emoji: string;
  progress: number;
  goal: number;
  unit: "€" | "days" | "times";
  xp: number;
  status: "active" | "done";
  left?: string;
};

export const CHALLENGES: Challenge[] = [
  { id: "delivery-10", title: "Spend €10 less on delivery than last week", emoji: "🛵", progress: 6, goal: 10, unit: "€", xp: 50, status: "active", left: "3 days left" },
  { id: "no-delivery-3", title: "No delivery for 3 days in a row", emoji: "🍳", progress: 2, goal: 3, unit: "days", xp: 30, status: "active", left: "1 day to go" },
  { id: "bus-not-bolt", title: "Take the bus instead of Bolt 4 times", emoji: "🚌", progress: 1, goal: 4, unit: "times", xp: 20, status: "active", left: "5 days left" },
  { id: "check-in-7", title: "Check your balance 7 days in a row", emoji: "👀", progress: 7, goal: 7, unit: "days", xp: 40, status: "done" },
  { id: "going-out-20", title: "Keep going out under €20 last week", emoji: "🍻", progress: 20, goal: 20, unit: "€", xp: 30, status: "done" },
];

export const formatProgress = (c: Challenge) =>
  c.unit === "€" ? `€${c.progress}/€${c.goal}` : `${c.progress}/${c.goal} ${c.unit}`;

export const ACHIEVEMENTS: { id: string; emoji: string; title: string; unlocked: boolean }[] = [
  { id: "first-week", emoji: "🐣", title: "First week", unlocked: true },
  { id: "banana", emoji: "🍌", title: "Banana saver", unlocked: true },
  { id: "subs", emoji: "✂️", title: "Sub slayer", unlocked: true },
  { id: "owl", emoji: "🦉", title: "No 2 AM orders", unlocked: false },
  { id: "streak-30", emoji: "🔥", title: "30-day streak", unlocked: false },
  { id: "boss", emoji: "👑", title: "Budget boss", unlocked: false },
];

export const PROFILE = {
  name: "Rūta",
  handle: "@ruta.saves",
  level: 7,
  xp: 440, // progress inside the current level
  totalXp: 2840,
  weekXp: 340,
  streak: 12,
  bestStreak: 21,
  savedThisMonth: 47,
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

/* XP for each logged step, on top of the challenge's own reward when it's finished. */
export const XP_PER_LOG = 10;
export const stepFor = (c: Challenge) => (c.unit === "€" ? 2 : 1);

export const FRIENDS = [
  { name: "Gabija", xp: 410, emoji: "🦊" },
  { name: "Matas", xp: 365, emoji: "🐻" },
  { name: "Emilija", xp: 290, emoji: "🐸" },
  { name: "Lukas", xp: 255, emoji: "🐧" },
  { name: "Sofia", xp: 180, emoji: "🐱" },
];
