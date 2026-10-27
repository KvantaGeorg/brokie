import { ScrollRevealText } from "./fx/Motion";
import { Blobs, FadeUp } from "./product/ProductUI";
import SourceLink from "./SourceLink";
import type { SourceId } from "@/config/site";

const problems: { emoji: string; title: string; desc: string; stat?: { value: string; text: string; source: SourceId } }[] = [
  {
    emoji: "😬",
    title: "Money anxiety",
    desc: "Lots of young people avoid opening their banking app because they're scared of what they'll see. Out of sight, out of budget.",
    stat: { value: "65%", text: "of 18–44 year-olds feel they should save more, but thinking about money is too stressful", source: "fidelity" },
  },
  {
    emoji: "🧋",
    title: "Invisible small spending",
    desc: "€4 coffee, €13 Wolt, €9.99 Netflix. None of it feels big, but in our demo month delivery, cafés and subscriptions cost more than groceries.",
    stat: { value: "52%", text: "of Gen Zers who regret their spending have regretted food delivery", source: "nerdwallet" },
  },
  {
    emoji: "📆",
    title: "Irregular student income",
    desc: "Stipends, part-time shifts, summer-job savings. Money arrives in lumps, so a neat monthly budget never quite fits.",
  },
];

const ProblemSection = () => (
  <section id="problem" className="relative py-24 lg:py-36">
    <Blobs variant={1} />
    <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <p className="micro-label mb-6">The problem</p>
        <ScrollRevealText
          className="text-[clamp(28px,4.4vw,58px)] font-black tracking-[-0.03em] leading-[1.12] text-foreground"
          text="Small spending is invisible. Brokie makes it visible, and a little bit funny."
          highlight={["visible,", "funny"]}
        />

        <ul className="grid md:grid-cols-3 gap-4 mt-14">
          {problems.map((p, i) => (
            <li key={p.title} className="h-full">
              <FadeUp delay={i * 0.08} className="glass rounded-3xl p-7 h-full flex flex-col transition-transform duration-300 hover:-translate-y-1.5">
                <span className="text-[40px] leading-none" aria-hidden="true">
                  {p.emoji}
                </span>
                <h3 className="text-[22px] mt-5 mb-2">{p.title}</h3>
                <p className="text-[16px] text-muted-foreground font-semibold leading-relaxed mb-5">{p.desc}</p>
                {p.stat && (
                  <p className="mt-auto pt-4 border-t border-white/10">
                    <span className="text-[24px] font-black text-accent leading-none">{p.stat.value}</span>{" "}
                    <span className="text-[14px] font-semibold text-foreground/90">{p.stat.text}</span>
                    <span className="block mt-1.5">
                      <SourceLink id={p.stat.source} />
                    </span>
                  </p>
                )}
              </FadeUp>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default ProblemSection;
