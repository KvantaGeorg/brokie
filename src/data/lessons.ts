import { STUDENT_CATEGORIES, catMeta, type StudentModel } from "./students";

/* Learn tab: short money lessons, each with the student's own numbers and one quiz question.
   General education only: no investment advice, no product recommendations. */

export type LessonId = "needs-wants" | "small-buys" | "emergency-fund" | "subscriptions" | "pay-yourself-first" | "borrowing";

export const LESSON_XP = 15;

export type Lesson = {
  id: LessonId;
  title: string;
  minutes: number;
  cards: string[];
  quiz: { question: string; options: string[]; answer: number; explain: string };
};

type GoalLike = { name: string; target: number; saved: number; date?: string } | null;

const eur = (n: number) => `€${Math.round(n).toLocaleString("en-GB")}`;
const eur2 = (n: number) => `€${n.toFixed(2)}`;
// The demo's "today" is 14 November 2026
const TODAY = new Date("2026-11-14");

export const lessonsFor = (m: StudentModel, goal: GoalLike): Lesson[] => {
  const h = m.history;
  const needs = STUDENT_CATEGORIES.filter((c) => c.need).reduce((s, c) => s + h.byCategory(c.id), 0);
  const wants = h.spent - needs;
  const pct = (n: number) => Math.round((n / m.income) * 100);
  const left = m.income - h.spent;

  const coffee = h.breakdown("eatingOut").find((b) => b.raw === "Coffee");
  const small = coffee && coffee.count ? coffee : h.breakdown(m.focus)[0];
  const smallName = coffee && coffee.count ? "coffees" : catMeta(m.focus).label.toLowerCase();

  const subs = h.byCategory("subscriptions");

  const goalLeft = goal ? Math.max(0, goal.target - goal.saved) : 0;
  const monthsToGoal = goal?.date ? Math.max(1, Math.round((new Date(goal.date).getTime() - TODAY.getTime()) / (30.4 * 864e5))) : 6;

  return [
    {
      id: "needs-wants",
      title: "Needs, wants and savings",
      minutes: 2,
      cards: [
        "A simple starting point is the 50/30/20 rule: about half of your income for needs, 30% for wants and 20% for savings. It's a guide, not a law.",
        `Your October: ${eur(needs)} on needs (${pct(needs)}%), ${eur(wants)} on wants (${pct(wants)}%) and ${left >= 0 ? `${eur(left)} left (${pct(left)}%)` : `${eur(-left)} more than came in`}.`,
        "Needs are what you can't skip: rent, groceries, getting to class, health. Wants make life fun. Both belong in a budget.",
      ],
      quiz: {
        question: `Your monthly income is ${eur(m.income)}. With 50/30/20, how much is the savings part?`,
        options: [eur(m.income * 0.1), eur(m.income * 0.2), eur(m.income * 0.3)],
        answer: 1,
        explain: `20% of ${eur(m.income)} is ${eur(m.income * 0.2)}. If that feels like a lot, start smaller and grow it.`,
      },
    },
    {
      id: "small-buys",
      title: "Small buys add up",
      minutes: 1,
      cards: [
        small
          ? `In October you had ${small.count} ${smallName}, ${eur2(small.total)} in total. Over a year that's about ${eur(small.total * 12)}.`
          : "Small, frequent purchases are the easiest to miss, because each one feels too small to matter.",
        "Nobody has to give up coffee. The trick is choosing it on purpose instead of on autopilot.",
        "Try setting a weekly amount for small treats. When it's gone, it's gone until Monday.",
      ],
      quiz: {
        question: "€3 a day, five days a week. Roughly how much is that in a year?",
        options: ["€156", "€780", "€1,560"],
        answer: 1,
        explain: "€3 × 5 days × 52 weeks = €780.",
      },
    },
    {
      id: "emergency-fund",
      title: "Your safety cushion",
      minutes: 2,
      cards: [
        "An emergency fund is money kept aside for surprises: a broken phone, a dentist bill, a month with fewer shifts.",
        `Your essentials cost about ${eur(needs)} a month. A common target is three months of essentials: ${eur(needs * 3)}.`,
        `That sounds big, so start with one month: ${eur(needs)}. Keep it apart from your spending money so it doesn't quietly disappear.`,
      ],
      quiz: {
        question: "What is an emergency fund for?",
        options: ["Concert tickets that just went on sale", "Unexpected costs like a medical bill or a broken laptop", "Paying for subscriptions"],
        answer: 1,
        explain: "It's for things you didn't plan and can't avoid. Fun things go in your budget or a savings goal.",
      },
    },
    {
      id: "subscriptions",
      title: "Subscriptions creep",
      minutes: 1,
      cards: [
        subs
          ? `You pay ${eur2(subs)} a month for subscriptions and your phone${m.student.subscriptions.length ? `, including ${m.student.subscriptions.join(", ")}` : ""}. That's ${eur(subs * 12)} a year.`
          : "Subscriptions are easy to start and easy to forget.",
        "Many services have student prices. Check before you renew, and cancel what you haven't used in a month.",
        "A free trial becomes a payment on a date. Put that date in your calendar when you sign up.",
      ],
      quiz: {
        question: "€9.99 a month is how much a year?",
        options: ["€99.90", "€119.88", "€59.94"],
        answer: 1,
        explain: "€9.99 × 12 = €119.88.",
      },
    },
    {
      id: "pay-yourself-first",
      title: "Pay yourself first",
      minutes: 2,
      cards: [
        "Saving what's left at the end of the month rarely works, because usually nothing is left. Set your savings aside the day your money arrives.",
        goal
          ? `${goal.name}: ${eur(goalLeft)} to go. Over ${monthsToGoal} month${monthsToGoal > 1 ? "s" : ""} that's about ${eur(goalLeft / monthsToGoal)} a month.`
          : "Pick a goal and divide what's left by the months until you need it. That's your monthly amount.",
        "Even a small automatic amount beats a big plan you never start.",
      ],
      quiz: {
        question: "When is the best moment to set money aside?",
        options: ["At the end of the month, from what's left", "Right when your income arrives", "Only when you get a bonus"],
        answer: 1,
        explain: "Setting it aside first means you plan your spending around savings, not the other way round.",
      },
    },
    {
      id: "borrowing",
      title: "Borrowing and buy now, pay later",
      minutes: 2,
      cards: [
        "Buy now, pay later splits a price into parts. It isn't free money: miss a payment and fees can follow, and it may affect your credit history.",
        "Interest is the price of borrowing. On a credit card, any amount you don't repay in full usually starts costing interest.",
        "Before borrowing, ask: would I buy this today if I had to pay the full price now?",
      ],
      quiz: {
        question: "You borrow €300 at 20% interest a year and repay it all after one year. Roughly how much interest do you pay?",
        options: ["€6", "€60", "€600"],
        answer: 1,
        explain: "20% of €300 is €60. Real loans can add fees on top, so always check the total cost.",
      },
    },
  ];
};
