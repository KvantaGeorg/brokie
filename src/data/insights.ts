import { TRANSACTIONS, spendingByCategory, totalSpent, weeklyTotals, type SpendCategory } from "./transactions";
import { EQUIVALENTS, toEquivalent } from "./equivalents";
import type { Mood } from "./notifications";

const eur = (n: number) => `€${n.toFixed(2)}`;
const sumOf = (pred: (merchant: string) => boolean, category: SpendCategory) =>
  TRANSACTIONS.filter((t) => t.category === category && pred(t.merchant)).reduce((s, t) => s - t.amount, 0);

/* One Brokie insight per category, computed from the mock month. */
export const categoryInsight = (id: SpendCategory): { text: string; mood: Mood; total: number; count: number; share: number } => {
  const cat = spendingByCategory().find((c) => c.id === id)!;
  const { total, count } = cat;
  const share = Math.round((total / totalSpent()) * 100);
  const bananas = toEquivalent(total, EQUIVALENTS[0]).text;
  const result = (text: string, mood: Mood) => ({ text, mood, total, count, share });

  switch (id) {
    case "delivery": {
      const weeks = weeklyTotals("delivery");
      const avg = weeks.reduce((a, b) => a + b, 0) / weeks.length;
      const last = weeks[weeks.length - 1];
      return result(`Food delivery reached ${eur(last)} in the final week. That's ${(last / avg).toFixed(1)} times your weekly average.`, "shocked");
    }
    case "rent":
      return result(`Rent is ${share}% of everything you spent. It's fixed, so Brokie leaves it alone and focuses on the rest.`, "happy");
    case "groceries":
      return result(`${count} shops, about ${eur(total / count)} per trip. Cooking at home is your best habit. Keep it up!`, "proud");
    case "transport": {
      const bolt = sumOf((m) => m.startsWith("Bolt ride"), "transport");
      return result(`Bolt rides cost ${eur(bolt)} this month. Your 30-day bus pass costs €7.25. Just saying.`, "watching");
    }
    case "subscriptions":
      return result(`${eur(total)} a month is ${eur(total * 12)} a year. Netflix renews on the 12th: still watching?`, "watching");
    case "goingOut": {
      const coffee = sumOf((m) => /caf/i.test(m), "goingOut");
      return result(`${eur(total)} on fun, including ${eur(coffee)} on coffee. Fun is allowed! That's ${bananas} though.`, "happy");
    }
    default:
      return result(`${eur(total)} on pharmacy, phone top-up and one Vinted find. Nothing scary here.`, "proud");
  }
};
