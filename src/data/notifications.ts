import type { SpendCategory } from "./transactions";
import { toEquivalent, type Equivalent } from "./equivalents";

/* Brokie's push notifications. Tone rule: joke about the situation, never insult the person,
   and mix in praise regularly. */

export type Tone = "gentle" | "savage";
export type NotificationGroup = "couldve" | "watching" | "proud" | "headsUp";
export type Mood = "happy" | "proud" | "watching" | "shocked";

export type BrokieNotification = {
  id: string;
  group: NotificationGroup;
  mood: Mood;
  time: string;
  text: Record<Tone, string>;
};

export const GROUPS: { id: NotificationGroup; title: string }[] = [
  { id: "couldve", title: "You could've bought..." },
  { id: "watching", title: "Brokie is watching" },
  { id: "proud", title: "Proud moments" },
  { id: "headsUp", title: "Heads up" },
];

export const NOTIFICATIONS: BrokieNotification[] = [
  {
    id: "wolt-bananas",
    group: "couldve",
    mood: "shocked",
    time: "now",
    text: {
      gentle: "That €15 Wolt order = 10 kg of bananas. Just saying. 🍌",
      savage: "That €15 Wolt order = 10 kg of bananas. You could've been a monkey king. 🍌",
    },
  },
  {
    id: "coffee-riga",
    group: "couldve",
    mood: "shocked",
    time: "2h ago",
    text: {
      gentle: "This month's coffees add up to €16. That's a bus ticket to Riga, almost exactly. ☕🚍",
      savage: "€16 on coffee this month. Riga called. It wanted to be visited, not drunk. ☕🚍",
    },
  },
  {
    id: "two-am",
    group: "watching",
    mood: "watching",
    time: "02:07",
    text: {
      gentle: "Bolt Food at 2 AM? Late study session, we get it. Maybe stock some noodles next time. 🍜",
      savage: "Bolt Food. At 2 AM. Again. Brokie is just... watching.",
    },
  },
  {
    id: "miss-you",
    group: "watching",
    mood: "watching",
    time: "yesterday",
    text: {
      gentle: "Haven't seen you in 3 days! Pop in, your streak misses you. 👀",
      savage: "Brokie hasn't seen you in 3 days. Brokie is not crying. Brokie is fine.",
    },
  },
  {
    id: "no-delivery",
    group: "proud",
    mood: "proud",
    time: "9:41",
    text: {
      gentle: "No delivery for 5 days! Brokie is shedding a single proud tear. 🥹",
      savage: "5 days, zero delivery. Wolt couriers are asking if you moved. Legend. 🏆",
    },
  },
  {
    id: "saved-bananas",
    group: "proud",
    mood: "happy",
    time: "Sun",
    text: {
      gentle: "You saved €23 this week. That's 15 kg of bananas in the bank. 🍌🏦",
      savage: "€23 saved this week. 15 kg of bananas in the bank. The monkey king rises. 🍌👑",
    },
  },
  {
    id: "netflix",
    group: "headsUp",
    mood: "watching",
    time: "tomorrow",
    text: {
      gentle: "Netflix renews tomorrow. Still watching, or just vibes?",
      savage: "Netflix renews tomorrow. €9.99 for a show you fall asleep to. Your call. 📺",
    },
  },
  {
    id: "streak",
    group: "headsUp",
    mood: "shocked",
    time: "21:30",
    text: {
      gentle: "Your 12-day streak ends at midnight. One quick check-in keeps it alive! 🔥",
      savage: "Your streak is about to die. Like your bank balance. 💀",
    },
  },
];

/* Category phrasing used by the "make your own notification" demo. */
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
    "That €{amount} {noun} = {equivalent}. Just saying. {emoji}",
    "Fun fact: €{amount} on that {noun} is {equivalent}. No judgement, only maths. {emoji}",
    "€{amount} {noun}? That's {equivalent}. Brokie believes in you anyway. {emoji}",
  ],
  savage: [
    "That €{amount} {noun} = {equivalent}. Brokie did the maths so you didn't have to. {emoji}",
    "€{amount} on a {noun}. Or {equivalent}. Brokie is not mad. Brokie is calculating. {emoji}",
    "{equivalent}. That's what that €{amount} {noun} could've been. Think about it. {emoji}",
  ],
};

export const buildDemoNotification = (amount: number, category: SpendCategory, tone: Tone, eq: Equivalent, variant: number) => {
  const cat = DEMO_CATEGORIES.find((c) => c.id === category) ?? DEMO_CATEGORIES[0];
  const e = toEquivalent(amount, eq);
  const templates = DEMO_TEMPLATES[tone];
  const amountText = Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
  const text = templates[variant % templates.length]
    .replace("{amount}", amountText)
    .replace("{noun}", cat.noun)
    .replace("{equivalent}", e.text)
    .replace("{emoji}", e.emoji);
  return text.charAt(0).toUpperCase() + text.slice(1);
};
