/* Approximate Vilnius prices (EUR, 2026) used to translate spending into real-world equivalents.
   These are rough, rounded figures for jokes, not a price index. */

export type Equivalent = {
  id: string;
  price: number;
  singular: string;
  plural: string;
  emoji: string;
};

export const EQUIVALENTS_ARE_APPROXIMATE = true;

export const EQUIVALENTS: Equivalent[] = [
  { id: "bananas", price: 1.5, singular: "kg of bananas", plural: "kg of bananas", emoji: "🍌" },
  { id: "bus", price: 1, singular: "Vilnius bus ticket", plural: "Vilnius bus tickets", emoji: "🚌" },
  { id: "coffee", price: 3.5, singular: "cappuccino", plural: "cappuccinos", emoji: "☕" },
  { id: "doner", price: 6.5, singular: "döner", plural: "döners", emoji: "🥙" },
  { id: "cinema", price: 7.9, singular: "cinema ticket", plural: "cinema tickets", emoji: "🎬" },
  { id: "riga", price: 15, singular: "bus ticket to Riga", plural: "bus tickets to Riga", emoji: "🚍" },
  { id: "cepelinai", price: 6, singular: "plate of cepelinai", plural: "plates of cepelinai", emoji: "🥟" },
  { id: "noodles", price: 0.45, singular: "pack of instant noodles", plural: "packs of instant noodles", emoji: "🍜" },
  { id: "kibinai", price: 2.5, singular: "kibinas", plural: "kibinai", emoji: "🥐" },
  { id: "spotify", price: 3.99, singular: "month of Spotify Student", plural: "months of Spotify Student", emoji: "🎧" },
];

/* "€15 → 10 kg of bananas". Under 10 keeps one decimal, otherwise rounds to a whole number. */
export const toEquivalent = (amount: number, eq: Equivalent) => {
  const qty = amount / eq.price;
  const rounded = qty < 10 ? Math.round(qty * 10) / 10 : Math.round(qty);
  const label = rounded === 1 ? eq.singular : eq.plural;
  return { qty: rounded, text: `${rounded.toLocaleString("en-US")} ${label}`, emoji: eq.emoji };
};

/* Equivalents that give at least ~1 unit for the amount, so the joke lands. */
export const usableEquivalents = (amount: number) => {
  const list = EQUIVALENTS.filter((e) => amount / e.price >= 1);
  return list.length ? list : EQUIVALENTS.filter((e) => e.id === "noodles");
};
