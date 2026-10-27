/* One place for the brand: name, copy, links. */
export type SourceId = "fidelity" | "nerdwallet";

export const SITE = {
  name: "Brokie",
  tagline: "Level up out of broke.",
  description: "Brokie shows students where their money really goes, roasts them a little, and turns better spending habits into a game.",
  heroTitle: ["Most students don't know", "where their money goes."],
  heroSubtitle: "Brokie shows you, roasts you a little, and helps you level up out of broke.",

  /* Hero stat chips, with sources */
  stats: [
    { value: "59%", text: "of young Americans cringe at checking their bank balance", source: "fidelity" as SourceId },
    { value: "72%", text: "of Gen Z regret their spending at least sometimes", source: "nerdwallet" as SourceId },
  ],

  /* Survey sources behind the stats (both US surveys) */
  sources: {
    fidelity: {
      name: "Fidelity",
      detail: "2022 Money Mindset Study, US adults 18–44",
      url: "https://newsroom.fidelity.com/pressreleases/fidelity-study-reveals-nearly-two-in-three-young-adults-feel-they-should-save-more--but-are-so-stres/s/c7671a4b-f10b-4b38-a41e-f414aa8917ba",
    },
    nerdwallet: {
      name: "NerdWallet",
      detail: "Harris Poll for NerdWallet, US Gen Z 18–23",
      url: "https://www.nerdwallet.com/finance/studies/generation-z-money-survey",
    },
  },

  tryHref: "#try",
  demoPath: "/demo",

  footerNote: "Student project for the FinTech Ecosystem and Management course. Demo uses mock data.",
};
