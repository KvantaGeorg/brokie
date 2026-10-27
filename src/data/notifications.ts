import type { SpendCategory } from "./transactions";
import { toEquivalent, type Equivalent } from "./equivalents";

/* Brokie's notifications on the landing page. Tone rule: joke about the situation, never the person,
   never shame essentials, and mix in praise. No emoji. */

export type Tone = "gentle" | "savage";
export type Mood = "happy" | "proud" | "watching" | "shocked";

export type ExampleNotification = { id: string; label: string; mood: Mood; time: string; text: Record<Tone, string> };

export const EXAMPLES: ExampleNotification[] = [
  {
    id: "delivery-limit",
    label: "Budget heads-up",
    mood: "watching",
    time: "18:40",
    text: {
      gentle: "Your delivery spending is getting close to this month's limit. You've got this.",
      savage: "€12 left for delivery this month. That's one pizza. Make it count.",
    },
  },
  {
    id: "two-am",
    label: "Late-night order",
    mood: "shocked",
    time: "02:07",
    text: {
      gentle: "Bolt Food at 2 AM? Late study session, we get it. Maybe keep some noodles at home.",
      savage: "Bolt Food. At 2 AM. Again. Brokie is just watching.",
    },
  },
  {
    id: "bananas",
    label: "Funny equivalent",
    mood: "happy",
    time: "now",
    text: {
      gentle: "That €15 Wolt order could have bought 10 kg of bananas.",
      savage: "That €15 Wolt order could have bought 10 kg of bananas. Monkey king energy, wasted.",
    },
  },
];

/* Category phrasing used by the "Try Brokie" generator. */
export const DEMO_CATEGORIES: { id: SpendCategory; label: string; noun: string }[] = [
  { id: "delivery", label: "Food delivery", noun: "delivery order" },
  { id: "goingOut", label: "Going out", noun: "night out" },
  { id: "groceries", label: "Groceries", noun: "grocery run" },
  { id: "transport", label: "Taxi / Bolt", noun: "Bolt ride" },
  { id: "subscriptions", label: "Subscriptions", noun: "subscription" },
  { id: "other", label: "Shopping", noun: "shopping haul" },
];

const DEMO_TEMPLATES: Record<Tone, string[]> = {
  gentle: [
    "That €{amount} {noun} could have bought {equivalent}. Just saying.",
    "Fun fact: €{amount} on that {noun} is {equivalent}. No judgement, only maths.",
    "€{amount} {noun}? That's {equivalent}. Brokie believes in you anyway.",
  ],
  savage: [
    "That €{amount} {noun} = {equivalent}. Brokie did the maths so you didn't have to.",
    "€{amount} on a {noun}. Or {equivalent}. Brokie is not mad. Brokie is calculating.",
    "{equivalent}. That's what that €{amount} {noun} could have been. Think about it.",
  ],
};

export const buildDemoNotification = (amount: number, category: SpendCategory, tone: Tone, eq: Equivalent, variant: number) => {
  const cat = DEMO_CATEGORIES.find((c) => c.id === category) ?? DEMO_CATEGORIES[0];
  const e = toEquivalent(amount, eq);
  const templates = DEMO_TEMPLATES[tone];
  const amountText = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  const text = templates[variant % templates.length].replace("{amount}", amountText).replace("{noun}", cat.noun).replace("{equivalent}", e.text);
  return text.charAt(0).toUpperCase() + text.slice(1);
};
