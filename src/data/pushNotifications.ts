import type { Mood, Tone } from "./notifications";
import type { StudentModel, StudentTx } from "./students";
import { funnyEquivalent } from "./equivalents";
import type { GameState } from "@/hooks/use-game";

/* "Notify" in the demo: one push, as if a payment just went through or Brokie had something to say.
   Built from the student's own November transactions, budget and goal. Jokes target the situation, never the person. */

export type Push = { id: string; mood: Mood; time: string; text: string };

const eur = (n: number) => `€${Math.abs(n).toFixed(2)}`;
const eur0 = (n: number) => `€${Math.round(Math.abs(n))}`;
const pick = <T,>(list: T[], seed: number) => list[Math.abs(seed) % list.length];
const pad = (n: number) => String(n).padStart(2, "0");
const timeOf = (seed: number, late = false) => (late ? `0${1 + (seed % 3)}:${pad((seed * 7) % 60)}` : `${pad(9 + (seed % 12))}:${pad((seed * 13) % 60)}`);

type Builder = (ctx: { m: StudentModel; s: GameState; tone: Tone; seed: number }) => Push | null;

/* A payment from this month: what it was, a gently funny comparison for the month's total, and what's left. */
const purchase: Builder = ({ m, s, tone, seed }) => {
  const pool = (["eatingOut", "transport", "fun", "shopping", "groceries"] as const).flatMap((c) => m.current.transactions(c));
  if (!pool.length) return null;
  const t: StudentTx = pick(pool, seed);
  const cat = t.cat as Exclude<StudentTx["cat"], "income">;
  const left = m.remaining(s.budget, cat);
  const leftText = left >= 0 ? `${eur(left)} left for this month.` : `That's ${eur(left)} over this month's plan.`;
  const savage = tone === "savage";
  const late = seed % 4 === 0 && (t.raw === "Eating out" || t.raw === "Taxi / Bolt");
  const same = m.current.transactions(cat).filter((x) => x.raw === t.raw);
  const nth = same.length;
  const monthTotal = same.reduce((sum, x) => sum - x.amount, 0);
  const like = funnyEquivalent(monthTotal, seed); // "11 cinema tickets"

  const lines: Record<string, Record<"gentle" | "savage", string[]>> = {
    Coffee: {
      gentle: [
        `Coffee number ${nth} this month. Together that's ${eur(monthTotal)}, or ${like}. Delicious maths.`,
        `Coffee, ${eur(t.amount)}. This month's coffees add up to ${like}. Brokie isn't judging, just counting.`,
        `Coffee number ${nth}. At this rate your barista deserves a thank-you card. ${leftText}`,
      ],
      savage: [
        `Coffee number ${nth} this month, ${eur(t.amount)}. Your barista should send you a Christmas card. ${leftText}`,
        `${eur(monthTotal)} on coffee this month. That's ${like}. Brokie did the maths, so you didn't have to.`,
      ],
    },
    "Eating out": {
      gentle: late
        ? [`Late-night food, ${eur(t.amount)}. Tomorrow-you might like a snack waiting at home. ${leftText}`]
        : [
            `${eur(t.amount)} eating out. This month that's ${eur(monthTotal)}, about ${like}. Tasty, but worth a look.`,
            `Lunch out, ${eur(t.amount)}. Your kitchen sends its regards and a small reminder that it exists. ${leftText}`,
          ],
      savage: late
        ? [`${eur(t.amount)} on food at 2 AM. Late study session, we get it. Maybe keep some noodles at home.`]
        : [`${eur(t.amount)} eating out. Your kitchen just filed a missing person report. ${leftText}`, `Eating out this month: ${like}. The fridge is feeling very left out.`],
    },
    "Taxi / Bolt": {
      gentle: [`Bolt ride, ${eur(t.amount)}. This month's rides add up to ${like}. The bus misses you a little.`, `Bolt ride, ${eur(t.amount)}. Your bus pass would have done that one for free.`],
      savage: [`Bolt ride, ${eur(t.amount)}. Your bus pass is starting to feel ignored.`, `${nth} taxi rides this month. The bus driver has stopped asking about you.`],
    },
    Groceries: {
      gentle: [`Groceries, ${eur(t.amount)}. Cooking at home is cheaper than takeaway and twice as heroic.`, `Groceries, ${eur(t.amount)}. Future you, eating a home-made dinner, says thanks.`],
      savage: [`Groceries, ${eur(t.amount)}. Cooking at home? Look at you, adulting.`],
    },
  };
  const fallback = {
    gentle: [`${t.label}, ${eur(t.amount)}. This month's ${t.raw.toLowerCase()} adds up to ${like}. Hope it sparked joy. ${leftText}`],
    savage: [`${eur(t.amount)} on ${t.raw.toLowerCase()}. Was it on the wishlist, or did the wishlist find you? ${leftText}`],
  };
  const text = pick((lines[t.raw] ?? fallback)[tone], seed >> 1);
  return { id: `p-${seed}`, mood: left < 0 ? "shocked" : cat === "groceries" ? "proud" : savage ? "watching" : "happy", time: timeOf(seed, late), text };
};

const subscription: Builder = ({ m, tone, seed }) => {
  const subs = m.current.transactions("subscriptions").filter((t) => t.raw === "Subscriptions");
  if (!subs.length) return null;
  const t = pick(subs, seed);
  return {
    id: `s-${seed}`,
    mood: "watching",
    time: timeOf(seed),
    text:
      tone === "savage"
        ? `${t.label} renews tomorrow, ${eur(t.amount)}. Still watching, or just paying?`
        : `${t.label} renews tomorrow, ${eur(t.amount)}. Over a year that's ${funnyEquivalent(t.amount * 12, seed)}. Still using it?`,
  };
};

const goal: Builder = ({ s, tone, seed }) => {
  if (!s.goal) return null;
  const toGo = Math.max(0, s.goal.target - s.goal.saved);
  const pct = Math.round((s.goal.saved / s.goal.target) * 100);
  return {
    id: `g-${seed}`,
    mood: "proud",
    time: timeOf(seed),
    text: tone === "savage" ? `${s.goal.name}: ${eur0(toGo)} to go. Brokie believes. Mostly.` : `${pct}% of the way to ${s.goal.name}. ${eur0(toGo)} to go. Keep going.`,
  };
};

const weekly: Builder = ({ m, s, tone, seed }) => {
  const projected = m.projected(s.budget);
  return {
    id: `w-${seed}`,
    mood: projected >= 0 ? "happy" : "shocked",
    time: "Sun 19:00",
    text:
      projected >= 0
        ? tone === "savage"
          ? `Weekly check: on track to finish November with ${eur0(projected)} left. Who even are you?`
          : `Weekly check: you're on track to finish November with ${eur0(projected)} left.`
        : `Weekly check: this plan ends ${eur0(projected)} short. Open your budget and Brokie will show where to start.`,
  };
};

/* Mostly payments, sometimes a renewal, the goal or the weekly check */
const BUILDERS: Builder[] = [purchase, purchase, purchase, purchase, purchase, subscription, goal, weekly];

/* A different push each time: picks a builder from the seed, skipping ones that have nothing to say. */
export const nextPush = (m: StudentModel, s: GameState, tone: Tone, seed: number): Push => {
  const start = Math.floor(seed / 3);
  for (let i = 0; i < BUILDERS.length; i++) {
    const p = BUILDERS[(start + i) % BUILDERS.length]({ m, s, tone, seed: seed + i * 7 });
    if (p) return p;
  }
  return weekly({ m, s, tone, seed })!;
};
