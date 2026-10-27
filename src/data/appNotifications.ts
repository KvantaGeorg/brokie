import { catMeta, modelFor } from "./students";
import type { Mood, Tone } from "./notifications";
import type { AppEvent, GameState } from "@/hooks/use-game";

/* Brokie's reactions to what the student just did in the demo app. Jokes target the situation, never the person,
   and essentials (rent, groceries, study, health) are never shamed. */

type Banner = { id: string; mood: Mood; text: string };

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

export const eventBanner = (e: AppEvent, s: GameState, tone: Tone): Banner => {
  const savage = tone === "savage";
  const name = s.goal?.name ?? "your goal";
  const focusLabel = catMeta(modelFor(s.studentId).focus).label;
  switch (e.kind) {
    case "goal-add":
      return { id: `ev-${e.key}`, mood: "proud", text: savage ? `+${eur(e.amount)} for ${name}. Future you says thanks.` : `You just gave ${name} another ${eur(e.amount)}. Nice.` };
    case "transfer":
      return {
        id: `ev-${e.key}`,
        mood: "proud",
        text: savage ? `${eur(e.amount)} moved to savings. ${name} just got closer, and your current account didn't even notice.` : `${eur(e.amount)} moved to your savings account for ${name}. Confirmed by your bank. Nice.`,
      };
    case "bought-anyway":
      return { id: `ev-${e.key}`, mood: "happy", text: savage ? `Enjoy the ${e.what}. Brokie will spot it when your bank does.` : `Enjoy your ${e.what}. Brokie will add it to your budget when it shows up in your bank.` };
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
          ? s.contributions[0]?.source === "bank"
            ? `${eur(s.contributions[0].amount)} moved to savings for ${name}.`
            : `You just gave ${name} another ${eur(s.contributions[0]?.amount ?? 10)}. Nice.`
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
