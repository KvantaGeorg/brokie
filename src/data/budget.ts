import { CATEGORIES, TRANSACTIONS, type SpendCategory, type Transaction } from "./transactions";
import { NOV_TRANSACTIONS } from "./november";

/* Budget maths, shared by every screen so the numbers always agree.
   - Monthly balance  = income − actual expenses
   - Budget remaining = limit − actual category spending
   - Projected balance at month end = income − planned spending (an overspent category counts at what was actually spent)
   A budget is only a plan: it never moves or saves money by itself. */

export type Budget = Record<SpendCategory, number>;

const r2 = (n: number) => Math.round(n * 100) / 100;

/* Fixed costs are shown apart from what the student can actually steer. */
export const FIXED: SpendCategory[] = ["rent"];
export const FLEXIBLE = CATEGORIES.map((c) => c.id).filter((id) => !FIXED.includes(id));

/* Suggested from October: keep fixed costs, trim delivery and going out, round the rest. */
export const SUGGESTED_BUDGET: Budget = {
  rent: 290,
  groceries: 165,
  delivery: 55,
  goingOut: 50,
  transport: 35,
  subscriptions: 15,
  other: 25,
};

export const sumBudget = (b: Budget) => Object.values(b).reduce((s, v) => s + v, 0);

const spentIn = (list: Transaction[], cat: SpendCategory) => r2(list.filter((t) => t.category === cat).reduce((s, t) => s - t.amount, 0));
const incomeOf = (list: Transaction[]) => r2(list.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0));
const spentOf = (list: Transaction[]) => r2(list.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0));

/* Last month (analysed) */
export const lastMonth = {
  income: incomeOf(TRANSACTIONS),
  spent: spentOf(TRANSACTIONS),
  byCategory: (cat: SpendCategory) => spentIn(TRANSACTIONS, cat),
};

/* This month so far */
export const thisMonth = {
  income: incomeOf(NOV_TRANSACTIONS),
  spent: spentOf(NOV_TRANSACTIONS),
  byCategory: (cat: SpendCategory) => spentIn(NOV_TRANSACTIONS, cat),
  transactions: (cat: SpendCategory) => NOV_TRANSACTIONS.filter((t) => t.category === cat).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id),
};

export const remaining = (b: Budget, cat: SpendCategory) => r2(b[cat] - thisMonth.byCategory(cat));

export const projectedBalance = (income: number, b: Budget) =>
  r2(income - CATEGORIES.reduce((s, c) => s + Math.max(b[c.id], thisMonth.byCategory(c.id)), 0));
