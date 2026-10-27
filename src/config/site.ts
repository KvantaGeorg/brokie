/* One place for the brand: name, copy, links. */
export type SourceId = "fidelity" | "nerdwallet";

export const SITE = {
  name: "Brokie",
  tagline: "Level up out of broke.",
  description: "Brokie is the money sidekick for students: understand your spending, build a budget and reach your goals, one small win at a time.",
  heroTitle: ["Your money. Your goals.", "Your next level."],
  heroSubtitle: "Meet Brokie, the money sidekick that helps you understand your spending, build a budget, and reach your goals. One small win at a time.",

  /* Supporting evidence in the Problem section (both US surveys, figures checked against the sources) */
  stats: [
    { value: "59%", text: "of young Americans cringe at checking their bank balance", source: "fidelity" as SourceId },
    { value: "72%", text: "of Gen Z regret their spending at least sometimes", source: "nerdwallet" as SourceId },
  ],

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

  demoPath: "/demo",

  footerNote: "Student project for the FinTech Ecosystem and Management course. The demo runs on the Brokie student dataset; bank connections are not real.",
};
