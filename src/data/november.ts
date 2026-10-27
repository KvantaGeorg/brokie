import type { Transaction } from "./transactions";

/* "This month" in the demo: November 2026 up to day 14, the month the student plans a budget for.
   October (transactions.ts) is the month Brokie analyses to suggest that budget. */

export const MONTH = {
  name: "November",
  today: 14,
  days: 30,
};

export const NOV_TRANSACTIONS: Transaction[] = [
  { id: 101, date: "2026-11-01", merchant: "Social stipend", amount: 180, category: "income" },
  { id: 102, date: "2026-11-01", merchant: "Rent, shared flat in Naujamiestis", amount: -290, category: "rent" },
  { id: 103, date: "2026-11-02", merchant: "Vilnius transport, 30-day student pass", amount: -7.25, category: "transport" },
  { id: 104, date: "2026-11-03", merchant: "Transfer from parents", amount: 100, category: "income" },
  { id: 105, date: "2026-11-03", merchant: "Maxima", amount: -24.6, category: "groceries" },
  { id: 106, date: "2026-11-04", merchant: "Spotify Student", amount: -3.99, category: "subscriptions" },
  { id: 107, date: "2026-11-05", merchant: "Wolt · Hesburger", amount: -14.2, category: "delivery" },
  { id: 108, date: "2026-11-07", merchant: "Part-time job (café shifts)", amount: 205, category: "income" },
  { id: 109, date: "2026-11-08", merchant: "Lidl", amount: -19.3, category: "groceries" },
  { id: 110, date: "2026-11-09", merchant: "Bolt Food · Čili Pica", amount: -12.4, category: "delivery" },
  { id: 111, date: "2026-11-10", merchant: "Caffeine", amount: -3.8, category: "goingOut" },
  { id: 112, date: "2026-11-11", merchant: "Bolt ride", amount: -8.6, category: "transport" },
  { id: 113, date: "2026-11-12", merchant: "Netflix", amount: -9.99, category: "subscriptions" },
  { id: 114, date: "2026-11-13", merchant: "Rimi", amount: -28.4, category: "groceries" },
  { id: 115, date: "2026-11-13", merchant: "Forum Cinemas", amount: -7.9, category: "goingOut" },
  { id: 116, date: "2026-11-14", merchant: "Part-time job (café shifts)", amount: 205, category: "income" },
  { id: 117, date: "2026-11-14", merchant: "Wolt · Sushi", amount: -16.4, category: "delivery" },
  { id: 118, date: "2026-11-14", merchant: "Eurovaistinė", amount: -6.49, category: "other" },
];
