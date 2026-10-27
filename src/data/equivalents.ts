/* Approximate Vilnius prices (EUR, 2026) used to translate spending into real-world equivalents.
   These are rough, rounded figures for jokes, not a price index. */

export type Equivalent = {
  id: string;
  price: number;
  singular: string;
  plural: string;
};

export const EQUIVALENTS: Equivalent[] = [
  { id: "bananas", price: 1.5, singular: "kg of bananas", plural: "kg of bananas" },
  { id: "bus", price: 1, singular: "Vilnius bus ticket", plural: "Vilnius bus tickets" },
  { id: "coffee", price: 3.5, singular: "cappuccino", plural: "cappuccinos" },
  { id: "doner", price: 6.5, singular: "döner", plural: "döners" },
  { id: "cinema", price: 7.9, singular: "cinema ticket", plural: "cinema tickets" },
  { id: "riga", price: 15, singular: "bus ticket to Riga", plural: "bus tickets to Riga" },
  { id: "cepelinai", price: 6, singular: "plate of cepelinai", plural: "plates of cepelinai" },
  { id: "noodles", price: 0.45, singular: "pack of instant noodles", plural: "packs of instant noodles" },
  { id: "kibinai", price: 2.5, singular: "kibinas", plural: "kibinai" },
  { id: "spotify", price: 3.99, singular: "month of Spotify Student", plural: "months of Spotify Student" },
  { id: "pizza", price: 9, singular: "large pizza", plural: "large pizzas" },
  { id: "pool", price: 5, singular: "swimming pool visit", plural: "swimming pool visits" },
  { id: "trolleybus-month", price: 7.25, singular: "monthly student bus pass", plural: "monthly student bus passes" },
];

/* A comparison that reads well for this amount: between about 2 and 60 of something. The seed picks which. */
export const funnyEquivalent = (amount: number, seed: number) => {
  const fits = EQUIVALENTS.filter((e) => amount / e.price >= 2 && amount / e.price <= 60);
  const list = fits.length ? fits : EQUIVALENTS.filter((e) => e.id === "noodles");
  const e = list[Math.abs(seed) % list.length];
  const qty = Math.round(amount / e.price);
  return `${qty} ${qty === 1 ? e.singular : e.plural}`;
};
