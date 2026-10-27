import { catMeta, type Cat, type StudentModel } from "./students";
import { movedToSavings, type GameState } from "@/hooks/use-game";

/* "Can I afford it?": checks a purchase against this month's plan and the savings goal.
   Fits the category budget → yes. Over it but the month still ends positive → yes, with what it costs the goal.
   Month would end short → not this month. */

export type AffordResult =
  | { verdict: "yes"; leftInCategory: number }
  | { verdict: "tight"; over: number; endOfMonth: number; goalDelayDays: number | null; protect: number }
  | { verdict: "no"; short: number };

// The demo's "today" is 14 November 2026
const TODAY = new Date("2026-11-14");
const roundUp5 = (n: number) => Math.ceil(n / 5) * 5;

export const availableNow = (m: StudentModel, s: GameState) => Math.round((m.income - m.current.spent - movedToSavings(s)) * 100) / 100;

/* What the current account is expected to hold at month end, after money already moved to savings. */
export const endOfMonth = (m: StudentModel, s: GameState) => Math.round((m.projected(s.budget) - movedToSavings(s)) * 100) / 100;

/* How much a student can move to savings this month without the plan going negative. */
export const safeToMove = (m: StudentModel, s: GameState) => Math.max(0, Math.floor(Math.min(endOfMonth(m, s), availableNow(m, s)) / 5) * 5);

export const affordCheck = (m: StudentModel, s: GameState, cat: Cat, amount: number): AffordResult => {
  const leftInCategory = m.remaining(s.budget, cat);
  const over = Math.round(Math.max(0, amount - Math.max(0, leftInCategory)) * 100) / 100;
  if (!over) return { verdict: "yes", leftInCategory: Math.round((leftInCategory - amount) * 100) / 100 };

  const after = Math.round((endOfMonth(m, s) - over) * 100) / 100;
  if (after < 0) return { verdict: "no", short: -after };

  // Goal delay: the over-budget part, divided by what the goal needs per day to arrive on time
  let goalDelayDays: number | null = null;
  if (s.goal && s.goal.saved < s.goal.target) {
    const toGo = s.goal.target - s.goal.saved;
    const days = s.goal.date ? Math.max(7, (new Date(s.goal.date).getTime() - TODAY.getTime()) / 864e5) : 90;
    goalDelayDays = Math.max(1, Math.round(over / (toGo / days)));
  }
  // Move to savings first: as much as the month can still spare after the purchase, up to the amount over budget
  const protect = Math.max(0, Math.min(roundUp5(over), Math.floor(after / 5) * 5, safeToMove(m, s)));
  return { verdict: "tight", over, endOfMonth: after, goalDelayDays, protect };
};

export const categoryChoices = (m: StudentModel) => m.flexible.filter((c) => c !== "subscriptions").map((c) => ({ id: c, label: catMeta(c).label }));
