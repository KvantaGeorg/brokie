/* Mock month (October 2026) for one student in Vilnius. Amounts in EUR: negative = spending, positive = income. */

export type SpendCategory = "rent" | "groceries" | "delivery" | "transport" | "subscriptions" | "goingOut" | "other";
export type Category = SpendCategory | "income";

export type Transaction = {
  id: number;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number;
  category: Category;
};

/* Display order, labels and chart colour token (see --chart-* in index.css) for each spending category. */
export const CATEGORIES: { id: SpendCategory; label: string; emoji: string; color: string }[] = [
  { id: "rent", label: "Rent", emoji: "🏠", color: "hsl(var(--chart-1))" },
  { id: "groceries", label: "Groceries", emoji: "🛒", color: "hsl(var(--chart-2))" },
  { id: "delivery", label: "Food delivery", emoji: "🛵", color: "hsl(var(--chart-3))" },
  { id: "transport", label: "Transport", emoji: "🚌", color: "hsl(var(--chart-4))" },
  { id: "subscriptions", label: "Subscriptions", emoji: "📺", color: "hsl(var(--chart-5))" },
  { id: "goingOut", label: "Going out", emoji: "🍻", color: "hsl(var(--chart-6))" },
  { id: "other", label: "Other", emoji: "🧾", color: "hsl(var(--chart-7))" },
];

export const TRANSACTIONS: Transaction[] = [
  { id: 1, date: "2026-10-01", merchant: "Social stipend", amount: 180, category: "income" },
  { id: 2, date: "2026-10-01", merchant: "Rent, shared flat in Naujamiestis", amount: -290, category: "rent" },
  { id: 3, date: "2026-10-02", merchant: "Maxima", amount: -23.4, category: "groceries" },
  { id: 4, date: "2026-10-02", merchant: "Vilnius transport, 30-day student pass", amount: -7.25, category: "transport" },
  { id: 5, date: "2026-10-03", merchant: "Wolt · Hesburger", amount: -12.9, category: "delivery" },
  { id: 6, date: "2026-10-03", merchant: "Caffeine", amount: -3.8, category: "goingOut" },
  { id: 7, date: "2026-10-04", merchant: "Spotify Student", amount: -3.99, category: "subscriptions" },
  { id: 8, date: "2026-10-05", merchant: "Lidl", amount: -18.75, category: "groceries" },
  { id: 9, date: "2026-10-06", merchant: "Bolt ride", amount: -6.4, category: "transport" },
  { id: 10, date: "2026-10-07", merchant: "Part-time job (café shifts)", amount: 205, category: "income" },
  { id: 11, date: "2026-10-08", merchant: "Maxima", amount: -14.2, category: "groceries" },
  { id: 12, date: "2026-10-09", merchant: "Bolt Food · Čili Pica", amount: -13.5, category: "delivery" },
  { id: 13, date: "2026-10-10", merchant: "Bar in Užupis", amount: -16, category: "goingOut" },
  { id: 14, date: "2026-10-10", merchant: "Bolt ride (02:14)", amount: -8.9, category: "transport" },
  { id: 15, date: "2026-10-11", merchant: "Eurovaistinė", amount: -6.49, category: "other" },
  { id: 16, date: "2026-10-12", merchant: "Netflix", amount: -9.99, category: "subscriptions" },
  { id: 17, date: "2026-10-13", merchant: "Rimi", amount: -21.6, category: "groceries" },
  { id: 18, date: "2026-10-14", merchant: "Vero Cafe", amount: -4.2, category: "goingOut" },
  { id: 19, date: "2026-10-15", merchant: "Transfer from parents", amount: 100, category: "income" },
  { id: 20, date: "2026-10-15", merchant: "Lidl", amount: -16.3, category: "groceries" },
  { id: 21, date: "2026-10-16", merchant: "Wolt · Sushi", amount: -15, category: "delivery" },
  { id: 22, date: "2026-10-17", merchant: "Forum Cinemas", amount: -7.9, category: "goingOut" },
  { id: 23, date: "2026-10-17", merchant: "Bolt ride", amount: -5.8, category: "transport" },
  { id: 24, date: "2026-10-18", merchant: "Pildyk top-up", amount: -5, category: "other" },
  { id: 25, date: "2026-10-19", merchant: "Maxima", amount: -19.85, category: "groceries" },
  { id: 26, date: "2026-10-20", merchant: "Caffeine", amount: -3.8, category: "goingOut" },
  { id: 27, date: "2026-10-21", merchant: "Part-time job (café shifts)", amount: 205, category: "income" },
  { id: 28, date: "2026-10-22", merchant: "Bolt Food · McDonald's", amount: -11.4, category: "delivery" },
  { id: 29, date: "2026-10-23", merchant: "Wolt · Kebab", amount: -9.8, category: "delivery" },
  { id: 30, date: "2026-10-24", merchant: "Bar on Vilniaus g.", amount: -14.5, category: "goingOut" },
  { id: 31, date: "2026-10-25", merchant: "Bolt Food · Pizza (02:07)", amount: -14.9, category: "delivery" },
  { id: 32, date: "2026-10-25", merchant: "Bolt ride", amount: -7.6, category: "transport" },
  { id: 33, date: "2026-10-26", merchant: "Lidl", amount: -15.1, category: "groceries" },
  { id: 34, date: "2026-10-27", merchant: "Wolt · Hesburger", amount: -12.6, category: "delivery" },
  { id: 35, date: "2026-10-27", merchant: "iCloud+ 50 GB", amount: -0.99, category: "subscriptions" },
  { id: 36, date: "2026-10-28", merchant: "Vinted", amount: -12, category: "other" },
  { id: 37, date: "2026-10-29", merchant: "Rimi", amount: -22.3, category: "groceries" },
  { id: 38, date: "2026-10-30", merchant: "Vero Cafe", amount: -4.2, category: "goingOut" },
  { id: 39, date: "2026-10-31", merchant: "Halloween party entry", amount: -10, category: "goingOut" },
  { id: 40, date: "2026-10-31", merchant: "Maxima", amount: -9.4, category: "groceries" },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

/* Week number within the month: 1–4 for days 1–7, 8–14, 15–21, 22–28; days 29–31 count as week 4. */
const weekOf = (date: string) => Math.min(4, Math.ceil(Number(date.slice(8, 10)) / 7));

export const spendingByCategory = () =>
  CATEGORIES.map((c) => ({
    ...c,
    total: round2(TRANSACTIONS.filter((t) => t.category === c.id).reduce((s, t) => s - t.amount, 0)),
    count: TRANSACTIONS.filter((t) => t.category === c.id).length,
  }));

export const weeklyTotals = (category: SpendCategory) => {
  const weeks = [0, 0, 0, 0];
  TRANSACTIONS.filter((t) => t.category === category).forEach((t) => (weeks[weekOf(t.date) - 1] -= t.amount));
  return weeks.map(round2);
};

export const totalIncome = () => round2(TRANSACTIONS.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0));
export const totalSpent = () => round2(TRANSACTIONS.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0));
