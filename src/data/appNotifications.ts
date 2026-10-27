import { lastMonth, remaining } from "./budget";
import type { Mood, Tone } from "./notifications";
import type { AppEvent, GameState } from "@/hooks/use-game";

/* Brokie's in-app banners, built from the user's own numbers. Jokes target the situation, never the person,
   and essentials (rent, groceries) are never shamed. */

type Banner = { id: string; mood: Mood; text: string };

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

export const contextualBanners = (s: GameState, tone: Tone): Banner[] => {
  const savage = tone === "savage";
  const list: Banner[] = [];
  const delivery = Math.round(lastMonth.byCategory("delivery"));
  list.push({
    id: "delivery-last",
    mood: "watching",
    text: savage ? `€${delivery} on delivery last month. Your oven thinks you moved out.` : `€${delivery} on delivery last month. Your kitchen misses you.`,
  });

  const left = remaining(s.budget, "delivery");
  list.push(
    left > 0
      ? { id: "delivery-left", mood: "shocked", text: savage ? `${eur(left)} left for delivery. That's one pizza. Make it count.` : `Only ${eur(left)} left in your delivery budget. Choose wisely.` }
      : { id: "delivery-left", mood: "shocked", text: savage ? "Delivery budget: gone. Your kitchen just got promoted." : "Delivery budget used up for November. Cooking era starts now." },
  );

  if (s.goal) {
    const pct = Math.round((s.goal.saved / s.goal.target) * 100);
    const toGo = Math.max(0, s.goal.target - s.goal.saved);
    list.push({
      id: "goal",
      mood: "proud",
      text: savage ? `${s.goal.name}: ${eur(toGo)} to go. Brokie believes. Mostly.` : `${pct}% of the way to ${s.goal.name}. Keep going.`,
    });
  }

  list.push({ id: "groceries", mood: "happy", text: savage ? "Groceries on track this month. Look at you, adulting." : "Groceries are on track this month. Nice cooking." });
  return list;
};

export const eventBanner = (e: AppEvent, s: GameState, tone: Tone): Banner => {
  const savage = tone === "savage";
  const name = s.goal?.name ?? "your goal";
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
            : "Delivery stayed under budget all month.";
      return { id: `ev-${e.key}`, mood: "proud", text: `${what} Challenge complete: +${e.xp} XP.` };
    }
    case "challenge-missed":
      return { id: `ev-${e.key}`, mood: "watching", text: savage ? "Delivery won this round. Rematch next month." : "Delivery went over budget this month. New month, new try." };
  }
};
