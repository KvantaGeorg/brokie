import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Clock, GraduationCap, X } from "lucide-react";
import BrokieMascot from "../../brand/BrokieMascot";
import { ProgressBar } from "../GameUI";
import { LESSON_XP, lessonsFor, type Lesson } from "@/data/lessons";
import { useGame, useStudent } from "@/hooks/use-game";

/* One lesson: a few short cards with the student's own numbers, then one question. */
const LessonView = ({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) => {
  const { state, finishLesson } = useGame();
  const still = useReducedMotion() ?? false;
  const backRef = useRef<HTMLButtonElement>(null);
  const done = state.lessons[lesson.id] != null;
  const [page, setPage] = useState(done ? lesson.cards.length : 0);
  const [choice, setChoice] = useState<number | null>(null);
  const onQuiz = page === lesson.cards.length;
  const answered = choice != null || done;

  useEffect(() => {
    backRef.current?.focus({ preventScroll: true });
  }, []);

  const answer = (i: number) => {
    if (answered) return;
    setChoice(i);
    finishLesson(lesson.id, lesson.title, i === lesson.quiz.answer);
  };

  return (
    <div className="pb-2" onKeyDown={(e) => e.key === "Escape" && onBack()}>
      <button ref={backRef} type="button" onClick={onBack} className="inline-flex items-center gap-0.5 -ml-1.5 rounded-lg px-1.5 py-1 text-[12px] font-extrabold text-white/60 hover:text-white">
        <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Lessons
      </button>
      <h2 className="text-[19px] font-black leading-tight mt-2">{lesson.title}</h2>

      {/* progress through the lesson */}
      <div className="flex gap-1 mt-3" aria-label={`Part ${page + 1} of ${lesson.cards.length + 1}`}>
        {[...lesson.cards, "quiz"].map((_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i <= page ? "bg-accent" : "bg-white/15"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={page} initial={still ? { opacity: 0 } : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} className="mt-4">
          {!onQuiz ? (
            <div className="rounded-2xl bg-white/[0.06] border border-white/10 p-4 min-h-[150px] flex gap-3">
              <BrokieMascot mood={page === 1 ? "watching" : "happy"} size={34} className="shrink-0" title="" />
              <p className="text-[14px] font-bold leading-snug">{lesson.cards[page]}</p>
            </div>
          ) : (
            <div>
              <p className="text-[11px] font-extrabold text-accent">Quick question</p>
              <p className="text-[14.5px] font-extrabold leading-snug mt-1">{lesson.quiz.question}</p>
              <ul className="mt-3 space-y-2" role="list">
                {lesson.quiz.options.map((o, i) => {
                  const right = i === lesson.quiz.answer;
                  const picked = choice === i;
                  const reveal = answered && (right || picked);
                  return (
                    <li key={o}>
                      <button
                        type="button"
                        onClick={() => answer(i)}
                        disabled={answered}
                        aria-pressed={picked}
                        className={`w-full flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[13px] font-extrabold transition-colors ${
                          reveal ? (right ? "border-chart-2 bg-chart-2/15" : "border-destructive bg-destructive/15") : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08]"
                        } disabled:cursor-default`}
                      >
                        {o}
                        {reveal && (right ? <Check className="w-4 h-4 text-chart-2" strokeWidth={3} aria-label="Correct" /> : <X className="w-4 h-4 text-destructive" strokeWidth={3} aria-label="Not quite" />)}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {answered && (
                <p role="status" className="mt-3 text-[12.5px] font-bold leading-snug text-white/80">
                  {choice != null && (choice === lesson.quiz.answer ? "Right. " : "Not quite. ")}
                  {lesson.quiz.explain}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-2 mt-4">
        {page > 0 && (
          <button type="button" onClick={() => setPage((p) => p - 1)} className="h-10 px-3 rounded-xl bg-white/10 text-[13px] font-black hover:bg-white/15">
            Back
          </button>
        )}
        {!onQuiz ? (
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            className="flex-1 h-10 rounded-xl bg-accent text-accent-foreground text-[13px] font-black shadow-[0_3px_0_hsl(var(--accent-deep))] active:translate-y-0.5 active:shadow-none"
          >
            {page === lesson.cards.length - 1 ? "To the question" : "Next"}
          </button>
        ) : (
          answered && (
            <button type="button" onClick={onBack} className="flex-1 h-10 rounded-xl bg-accent text-accent-foreground text-[13px] font-black shadow-[0_3px_0_hsl(var(--accent-deep))]">
              Done
            </button>
          )
        )}
      </div>
    </div>
  );
};

/* Learn tab: bite-size money lessons. Each finished lesson pays XP once (more for a right answer). */
const LearnScreen = () => {
  const { state } = useGame();
  const m = useStudent();
  const lessons = lessonsFor(m, state.goal);
  const [open, setOpen] = useState<Lesson["id"] | null>(null);
  const done = lessons.filter((l) => state.lessons[l.id] != null).length;
  const lesson = lessons.find((l) => l.id === open);

  if (lesson) return <div className="px-5 pb-4"><LessonView lesson={lesson} onBack={() => setOpen(null)} /></div>;

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-3">
        <span className="w-11 h-11 shrink-0 rounded-xl bg-primary/30 flex items-center justify-center text-primary-glow">
          <GraduationCap className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-[19px] font-black leading-tight">Money basics</h2>
          <p className="text-[12px] font-bold text-white/55">Two minutes each, with your own numbers.</p>
        </div>
      </div>
      <ProgressBar value={done} max={lessons.length} label="Lessons finished" className="h-2 mt-4" />
      <p className="text-[11px] font-bold text-white/50 mt-1.5 tabular">
        {done} of {lessons.length} finished · +{LESSON_XP} XP for each right answer
      </p>

      <ul className="mt-4 space-y-2">
        {lessons.map((l, i) => {
          const result = state.lessons[l.id];
          const finished = result != null;
          return (
            <li key={l.id}>
              <button
                type="button"
                onClick={() => setOpen(l.id)}
                className={`w-full flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${finished ? "bg-chart-2/10 border-chart-2/30" : "bg-white/[0.06] border-white/10 hover:bg-white/[0.09]"}`}
              >
                <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-[12px] font-black ${finished ? "bg-chart-2 text-white" : "bg-white/10"}`}>
                  {finished ? <Check className="w-4 h-4" strokeWidth={3.5} aria-label="Finished" /> : i + 1}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-extrabold leading-snug">{l.title}</span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-white/45">
                    <Clock className="w-3 h-3" aria-hidden="true" /> {l.minutes} min{finished && ` · ${result ? "answered right" : "done"}`}
                  </span>
                </span>
                <ChevronRight className="w-4 h-4 text-white/35 shrink-0" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
      <p className="text-[10.5px] font-bold text-white/40 mt-3">General money education, not financial advice.</p>
    </div>
  );
};

export default LearnScreen;
