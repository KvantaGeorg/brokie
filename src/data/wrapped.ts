import { STUDENTS, catMeta, modelFor, type Cat, type StudentModel } from "./students";
import type { Mood, Tone } from "./notifications";

/* "October, wrapped": the student's month as a short story, Spotify Wrapped style. All numbers are October's. */

export type Personality = { title: string; line: string; mood: Mood };

export type Wrapped = {
  name: string;
  month: string;
  income: number;
  spent: number;
  left: number;
  top: { cat: Cat; label: string; total: number; share: number; beats: number }; // beats: % of students who spend less on it
  count: { raw: string; plural: string; count: number; total: number; perDay: number; busRides: number } | null;
  weeks: number[];
  peakWeek: number;
  personality: Personality;
  roast: Record<Tone, string>;
};

const DAYS_IN_OCTOBER = 31;
const PLURAL: Record<string, string> = {
  Coffee: "coffees",
  "Eating out": "meals out",
  "Taxi / Bolt": "taxi rides",
  "Public transport": "bus rides",
  Shopping: "shopping trips",
  Tech: "tech buys",
  Entertainment: "nights out",
  Sport: "sport sessions",
  Travel: "trips",
  Subscriptions: "subscription payments",
  Other: "other buys",
};
const BUS_TICKET = 1; // Vilnius 30-minute public transport ticket, €

const personalityOf = (m: StudentModel, top: Cat, coffee: number, eatingOut: number): Personality => {
  const left = m.income - m.history.spent;
  if (left < 0) return { title: "The Tightrope Walker", line: "Spending ran ahead of income this month. Brave. Let's make next month a little less brave.", mood: "shocked" };
  if (left / m.income >= 0.15) return { title: "The Quiet Saver", line: "You kept a real chunk of your income. Most students in our data don't.", mood: "proud" };
  switch (top) {
    case "eatingOut":
      return coffee >= eatingOut
        ? { title: "The Café Philosopher", line: "Big thoughts need small coffees. Lots of small coffees.", mood: "watching" }
        : { title: "The Foodie", line: "You know every lunch spot near campus. Your kitchen knows you less well.", mood: "watching" };
    case "fun":
      return { title: "The Weekend Adventurer", line: "Concerts, sport, trips. You spend on memories, not things.", mood: "happy" };
    case "shopping":
      return { title: "The Cart Collector", line: "If it's on sale, it's in your cart. Some of it is even on your wishlist.", mood: "watching" };
    case "subscriptions":
      return { title: "The Streaming Royalty", line: "A subscription for every mood. Are you still watching all of them?", mood: "watching" };
    default:
      return { title: "The Balanced One", line: "No single habit runs your month. That's rarer than you think.", mood: "proud" };
  }
};

export const wrappedFor = (studentId: string): Wrapped => {
  const m = modelFor(studentId);
  const h = m.history;

  // The #1 habit: biggest flexible category that isn't an essential
  const wants = m.flexible.filter((c) => !catMeta(c).need);
  const topCat = [...wants].sort((a, b) => h.byCategory(b) - h.byCategory(a))[0] ?? m.flexible[0];
  const topTotal = h.byCategory(topCat);
  const others = STUDENTS.map((s) => modelFor(s.id).history.byCategory(topCat));
  const beats = Math.round((others.filter((v) => v < topTotal).length / others.length) * 100);

  // The thing bought most often
  const counted = wants.flatMap((c) => h.breakdown(c)).sort((a, b) => b.count - a.count)[0];
  const coffee = h.breakdown("eatingOut").find((b) => b.raw === "Coffee")?.count ?? 0;
  const eatingOut = h.breakdown("eatingOut").find((b) => b.raw === "Eating out")?.count ?? 0;

  const weeks = [0, 1, 2, 3].map((i) => Math.round(m.flexible.reduce((s, c) => s + h.weekly(c)[i], 0)));
  const peakWeek = weeks.indexOf(Math.max(...weeks));
  const personality = personalityOf(m, topCat, coffee, eatingOut);
  const label = catMeta(topCat).label;

  return {
    name: m.student.name,
    month: h.name,
    income: Math.round(m.income),
    spent: Math.round(h.spent),
    left: Math.round(m.income - h.spent),
    top: { cat: topCat, label, total: Math.round(topTotal), share: Math.round((topTotal / h.spent) * 100), beats },
    count: counted
      ? { raw: counted.raw, plural: PLURAL[counted.raw] ?? counted.raw.toLowerCase(), count: counted.count, total: counted.total, perDay: Math.round((counted.count / DAYS_IN_OCTOBER) * 10) / 10, busRides: Math.floor(counted.total / BUS_TICKET) }
      : null,
    weeks,
    peakWeek,
    personality,
    roast: m.income < h.spent
      ? {
          gentle: `${m.history.byCategory("housing") > m.income / 2 ? "Rent and bills took most of October, and that part is hard to change. " : ""}Brokie will help you find the rest, one category at a time.`,
          savage: `October cost €${Math.round(h.spent - m.income)} more than came in. Brokie has seen scarier numbers. Not many, but some.`,
        }
      : {
      gentle: `${label} was your biggest choice in October. One small change there would make November feel very different.`,
      savage: `€${Math.round(topTotal)} on ${label.toLowerCase()}. Brokie isn't mad. Brokie is just doing the maths, very loudly.`,
        },
  };
};
