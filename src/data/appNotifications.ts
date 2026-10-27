import { catMeta, modelFor, type Cat } from "./students";
import type { Mood, Tone } from "./notifications";
import type { AppEvent, GameState } from "@/hooks/use-game";

/* Brokie's in-app banners, built from the student's own numbers. Jokes target the situation, never the person,
   and essentials (rent, groceries, study, health) are never shamed. */

type Banner = { id: string; mood: Mood; text: string };

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

/* Lines for the habit Brokie is helping with: last month, money left, budget used up. */
const FOCUS_LINES: Partial<Record<Cat, { last: Record<Tone, string>; left: Record<Tone, string>; gone: Record<Tone, string> }>> = {
  eatingOut: {
    last: { gentle: "on eating out and coffee last month. Your kitchen misses you.", savage: "on eating out and coffee last month. Your oven thinks you moved out." },
    left: { gentle: "left for eating out. Choose wisely.", savage: "left for eating out. That's a few lattes. Make them count." },
    gone: { gentle: "Eating-out budget used up for November. Home cooking era starts now.", savage: "Eating-out budget: gone. Your kitchen just got promoted." },
  },
  fun: {
    last: { gentle: "on fun and sport last month. Fun is good, planned fun is better.", savage: "on fun and sport last month. Living your best life, on a budget, hopefully." },
    left: { gentle: "left for fun this month. Plan something good.", savage: "left for fun. Pick your party carefully." },
    gone: { gentle: "Fun budget used up for November. Free plans count too.", savage: "Fun budget: spent. Parks are free. Just saying." },
  },
  shopping: {
    last: { gentle: "on shopping and tech last month. Worth a second look.", savage: "on shopping and tech last month. Your cart has a fan club." },
    left: { gentle: "left for shopping. Wishlist first, checkout later.", savage: "left for shopping. Put it in the cart and walk away for a day." },
    gone: { gentle: "Shopping budget used up for November. The wishlist can wait.", savage: "Shopping budget: done. The cart is closed for the season." },
  },
};

const linesFor = (cat: Cat) =>
  FOCUS_LINES[cat] ?? {
    last: { gentle: `on ${catMeta(cat).label.toLowerCase()} last month.`, savage: `on ${catMeta(cat).label.toLowerCase()} last month. Brokie saw that.` },
    left: { gentle: "left in this budget.", savage: "left. Spend it like you mean it." },
    gone: { gentle: "This budget is used up for November.", savage: "Budget: gone. New month, new you." },
  };

export const focusBanner = (s: GameState, tone: Tone): Banner => {
  const m = modelFor(s.studentId);
  const lines = linesFor(m.focus);
  const left = m.remaining(s.budget, m.focus);
  return left > 0
    ? { id: "focus-left", mood: "shocked", text: `${tone === "savage" ? "" : "Only "}${eur(left)} ${lines.left[tone]}` }
    : { id: "focus-left", mood: "shocked", text: lines.gone[tone] };
};

/* Home's headline: a plan that ends in the red comes first, otherwise the focus habit. */
export const homeBanner = (s: GameState, tone: Tone): Banner => {
  const m = modelFor(s.studentId);
  const short = -m.projected(s.budget);
  if (short <= 0) return focusBanner(s, tone);
  const rentOverIncome = m.history.byCategory("housing") > m.income;
  const text = rentOverIncome
    ? `This month ends ${eur(Math.round(short))} short: rent and bills alone are more than your income. Brokie can't fix rent, but it can help with the rest.`
    : tone === "savage"
      ? `Heading ${eur(Math.round(short))} into the red this month. Plan B starts with ${catMeta(m.focus).label.toLowerCase()}.`
      : `This plan ends ${eur(Math.round(short))} short. ${catMeta(m.focus).label} is the easiest place to start.`;
  return { id: "short", mood: "shocked", text };
};

export const contextualBanners = (s: GameState, tone: Tone): Banner[] => {
  const m = modelFor(s.studentId);
  const savage = tone === "savage";
  const list: Banner[] = [];
  list.push({ id: "focus-last", mood: "watching", text: `€${Math.round(m.history.byCategory(m.focus))} ${linesFor(m.focus).last[tone]}` });
  list.push(focusBanner(s, tone));

  if (s.goal) {
    const pct = Math.round((s.goal.saved / s.goal.target) * 100);
    const toGo = Math.max(0, s.goal.target - s.goal.saved);
    list.push({
      id: "goal",
      mood: "proud",
      text: savage ? `${s.goal.name}: ${eur(toGo)} to go. Brokie believes. Mostly.` : `${pct}% of the way to ${s.goal.name}. Keep going.`,
    });
  }

  const groceriesOk = m.remaining(s.budget, "groceries") >= 0;
  if (groceriesOk) list.push({ id: "groceries", mood: "happy", text: savage ? "Groceries on track this month. Look at you, adulting." : "Groceries are on track this month. Nice cooking." });
  if (Object.keys(s.lessons).length < 6) list.push({ id: "learn", mood: "happy", text: savage ? "Two-minute money lesson in Learn. Shorter than a TikTok scroll." : "New money lesson waiting in Learn. Two minutes, one question." });
  return list;
};

export const eventBanner = (e: AppEvent, s: GameState, tone: Tone): Banner => {
  const savage = tone === "savage";
  const name = s.goal?.name ?? "your goal";
  const focusLabel = catMeta(modelFor(s.studentId).focus).label;
  switch (e.kind) {
    case "goal-add":
      return { id: `ev-${e.key}`, mood: "proud", text: savage ? `+${eur(e.amount)} for ${name}. Future you says thanks.` : `You just gave ${name} another ${eur(e.amount)}. Nice.` };
    case "goal-created":
      return { id: `ev-${e.key}`, mood: "happy", text: `${name} is on the board. ${eur(s.goal?.target ?? 0)} target. You've got this.` };
    case "budget-checked":
      return e.days >= 3
        ? { id: `ev-${e.key}`, mood: "proud", text: savage ? "Three days in a row. Who even are you? Brokie approves." : "Three days of checking your budget. Brokie approves." }
        : { id: `ev-${e.key}`, mood: "happy", text: `Budget checked. Day ${e.days} of 3.` };
    case "challenge-done": {
      // Say what was done, then the reward
      const what =
        e.id === "goal-add"
          ? `You just gave ${name} another €${s.contributions[0]?.amount ?? 10}. Nice.`
          : e.id === "check-budget"
            ? savage
              ? "Three days in a row. Who even are you? Brokie approves."
              : "Three days of checking your budget. Brokie approves."
            : `${focusLabel} stayed under budget all month.`;
      return { id: `ev-${e.key}`, mood: "proud", text: `${what} Challenge complete: +${e.xp} XP.` };
    }
    case "challenge-missed":
      return { id: `ev-${e.key}`, mood: "watching", text: savage ? `${focusLabel} won this round. Rematch next month.` : `${focusLabel} went over budget this month. New month, new try.` };
    case "lesson-done":
      return {
        id: `ev-${e.key}`,
        mood: e.correct ? "proud" : "happy",
        text: e.correct ? `Lesson done: ${e.title}. Right answer, +${e.xp} XP.` : `Lesson done: ${e.title}. Now you know. +${e.xp} XP.`,
      };
  }
};
