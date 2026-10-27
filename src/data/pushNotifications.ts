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

/* A payment from this month, with a short joke or a funny comparison for the month's total. */
const purchase: Builder = ({ m, s, tone, seed }) => {
  // Fixed costs like the bus pass aren't news, so they never get a push
  const pool = (["eatingOut", "transport", "fun", "shopping", "groceries"] as const).flatMap((c) => m.current.transactions(c)).filter((t) => t.raw !== "Transport pass" && t.raw !== "Public transport");
  if (!pool.length) return null;
  const t: StudentTx = pick(pool, seed);
  const cat = t.cat as Exclude<StudentTx["cat"], "income">;
  const left = m.remaining(s.budget, cat);
  const late = seed % 4 === 0 && (t.raw === "Eating out" || t.raw === "Taxi / Bolt");
  const same = m.current.transactions(cat).filter((x) => x.raw === t.raw);
  const nth = same.length;
  const total = eur0(same.reduce((sum, x) => sum - x.amount, 0));
  // "11 CINEMA TICKETS" (coffee is never compared with cappuccinos)
  const LIKE = funnyEquivalent(same.reduce((sum, x) => sum - x.amount, 0), seed, t.raw === "Coffee" ? "coffee" : undefined).toUpperCase();
  const over = left < 0 ? ` ${eur0(left)} over budget.` : "";

  // Short and silly: one fact, one joke. CAPS for the punchline.
  const lines: Record<string, Record<Tone, string[]>> = {
    Coffee: {
      gentle: [`Coffee #${nth} this month. Your barista knows your BIRTHDAY now.`, `${total} on coffee = ${LIKE}. Bean there, done that.`, `Coffee #${nth}. Hydration, but make it ESPRESSO.`],
      savage: [`Coffee #${nth}. Blink twice if you need help.`, `${total} on coffee = ${LIKE}. CAFFEINE IS NOT A FOOD GROUP.${over}`],
    },
    "Eating out": {
      gentle: late ? ["Food at 2 AM. Bold. VERY bold."] : ["Eating out again. Your fridge feels a little GHOSTED.", `${total} eating out = ${LIKE}. Tasty maths.`],
      savage: late ? [`2 AM food, ${eur(t.amount)}. Your future self says: WHY.`] : [`Eating out AGAIN? Your kitchen filed a missing person report.${over}`, `${total} eating out = ${LIKE}. Home cooking? NEVER HEARD OF IT.`],
    },
    "Taxi / Bolt": {
      gentle: ["Bolt again. The bus is SAD but supportive.", `${nth} taxi rides = ${LIKE}. Legs are free, just saying.`],
      savage: [`Taxi #${nth}. Legs: still included, FREE OF CHARGE.`, "Bolt again? The bus driver stopped waving."],
    },
    Groceries: {
      gentle: ["Groceries! Look at you, ADULTING.", "Groceries bought. Chef mode: ON."],
      savage: ["Groceries? Who are you and what did you do with the old you?"],
    },
    Shopping: {
      gentle: [`Shopping, ${eur(t.amount)}. Did it spark JOY?`, `${total} on shopping = ${LIKE}. Just so you know.`],
      savage: [`Shopping again. Your cart has a FAN CLUB.${over}`, `${eur(t.amount)} on stuff. Your closet says: NO VACANCY.`],
    },
    Tech: {
      gentle: [`New tech, ${eur(t.amount)}. Charge it with PRIDE.`],
      savage: [`${eur(t.amount)} on tech. Another cable for THE DRAWER.`],
    },
    Entertainment: {
      gentle: [`Fun, ${eur(t.amount)}. Memories > money. MOSTLY.`],
      savage: [`${eur(t.amount)} on fun. Worth it? Your wallet is UNDECIDED.`],
    },
    Sport: {
      gentle: [`Sport, ${eur(t.amount)}. Healthy body, healthy BUDGET.`],
      savage: [`${eur(t.amount)} on sport. Now actually GO.`],
    },
    Travel: {
      gentle: [`Travel, ${eur(t.amount)}. Adventure mode: ON.`],
      savage: [`${eur(t.amount)} on travel. Bon voyage, savings.`],
    },
  };
  const fallback: Record<Tone, string[]> = {
    gentle: [`${t.label}, ${eur(t.amount)}. Treat yourself. RESPONSIBLY.`, `${t.label}, ${eur(t.amount)}. Brokie saw that. Brokie is FINE.`],
    savage: [`${t.label}, ${eur(t.amount)}. Your wallet just SIGHED.${over}`, `${t.label}? Bold choice. BOLD.`],
  };
  const text = pick((lines[t.raw] ?? fallback)[tone], seed >> 1);
  return { id: `p-${seed}`, mood: left < 0 ? "shocked" : cat === "groceries" ? "proud" : tone === "savage" ? "watching" : "happy", time: timeOf(seed, late), text };
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
        ? `${t.label} renews tomorrow. Paying for VIBES again?`
        : `${t.label} renews tomorrow. A year of it = ${funnyEquivalent(t.amount * 12, seed).toUpperCase()}.`,
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
    text: tone === "savage" ? `${s.goal.name}: ${eur0(toGo)} to go. Brokie believes. MOSTLY.` : `${s.goal.name}: ${pct}% DONE. Keep going.`,
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
          ? `Week check: ${eur0(projected)} left at month end. Who ARE you?`
          : `Week check: ${eur0(projected)} left at month end. NICE.`
        : `Week check: heading ${eur0(projected)} into the red. Let's fix it.`,
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
