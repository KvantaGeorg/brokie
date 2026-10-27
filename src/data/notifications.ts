
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
