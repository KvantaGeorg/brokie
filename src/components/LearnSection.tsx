import { Check, Clock } from "lucide-react";
import { SectionHeader } from "./product/ProductUI";
import BrokieMascot from "./brand/BrokieMascot";
import { LESSON_XP, lessonsFor } from "@/data/lessons";
import { FEATURED_ID, modelFor } from "@/data/students";

const featured = modelFor(FEATURED_ID);
const lessons = lessonsFor(featured, { ...featured.student.goal, date: featured.student.goal.date ?? undefined });
const example = lessons.find((l) => l.id === "small-buys")!;

/* Financial literacy inside the app: short lessons that use the student's own numbers. */
const LearnSection = () => (
  <section id="learn" className="section section-alt">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader
        label="Learn"
        title="Money basics, in two minutes."
        desc="Most of us never learned this at school. Brokie teaches it one short lesson at a time, with your own numbers instead of made-up examples. Each lesson ends with one question and pays XP."
      />

      <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-start">
        <ol className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
          {lessons.map((l, i) => (
            <li key={l.id} className="border-t border-white/10 pt-4">
              <span className="text-[13px] font-black text-primary-glow tabular">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-[19px] mt-2 leading-snug">{l.title}</h3>
              <p className="flex items-center gap-1.5 text-[13px] font-bold text-muted-foreground mt-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" /> {l.minutes} min · +{LESSON_XP} XP
              </p>
            </li>
          ))}
        </ol>

        {/* one lesson, as the app shows it */}
        <figure className="surface rounded-3xl p-6 sm:p-8" aria-label={`Example lesson: ${example.title}`}>
          <p className="micro-label">Lesson for {featured.student.name}</p>
          <p className="text-[22px] font-black mt-3">{example.title}</p>
          <div className="flex gap-3 mt-4 rounded-2xl bg-white/[0.05] p-4">
            <BrokieMascot mood="watching" size={40} className="shrink-0" title="" />
            <p className="text-[15px] font-bold leading-snug">{example.cards[0]}</p>
          </div>
          <p className="text-[13px] font-extrabold text-accent mt-6">Quick question</p>
          <p className="text-[16px] font-extrabold mt-1">{example.quiz.question}</p>
          <ul className="mt-3 space-y-2">
            {example.quiz.options.map((o, i) => {
              const right = i === example.quiz.answer;
              return (
                <li key={o} className={`flex items-center justify-between rounded-xl border px-4 py-2.5 text-[15px] font-extrabold ${right ? "border-chart-2 bg-chart-2/10" : "border-white/10"}`}>
                  {o}
                  {right && <Check className="w-4 h-4 text-chart-2" strokeWidth={3} aria-label="Correct answer" />}
                </li>
              );
            })}
          </ul>
          <figcaption className="text-[13px] font-semibold text-muted-foreground mt-4">{example.quiz.explain} General money education, not financial advice.</figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default LearnSection;
