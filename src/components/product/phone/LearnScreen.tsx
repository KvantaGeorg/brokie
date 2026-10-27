import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ChevronLeft, GraduationCap, Lock, Star, X } from "lucide-react";
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

/* Units on the learning map. Only the first one exists in the demo; the rest show where the course goes. */
const LOCKED_UNITS = [
  { title: "Saving and goals", lessons: 5 },
  { title: "Banks, cards and payments", lessons: 6 },
  { title: "Credit and loans", lessons: 5 },
  { title: "Investing basics", lessons: 6 },
];

/* Zigzag offsets for the path, like a winding trail */
const OFFSETS = [0, 46, 70, 46, 0, -46, -70, -46];

/* Learn tab: a Duolingo-style map. Unit 1, Money basics, is open; finishing a lesson pays XP once. */
const LearnScreen = () => {
  const { state } = useGame();
  const m = useStudent();
  const still = useReducedMotion() ?? false;
  const lessons = lessonsFor(m, state.goal);
  const [open, setOpen] = useState<Lesson["id"] | null>(null);
  const done = lessons.filter((l) => state.lessons[l.id] != null).length;
  const current = lessons.findIndex((l) => state.lessons[l.id] == null);
  const lesson = lessons.find((l) => l.id === open);

  if (lesson) return <div className="px-5 pb-4"><LessonView lesson={lesson} onBack={() => setOpen(null)} /></div>;

  return (
    <div className="px-5 pb-6">
      {/* unit 1 banner */}
      <div className="rounded-2xl bg-[linear-gradient(120deg,hsl(262_83%_55%),hsl(262_70%_42%))] p-3.5 flex items-center gap-3">
        <span className="w-10 h-10 shrink-0 rounded-xl bg-white/15 flex items-center justify-center">
          <GraduationCap className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-wide text-white/70">Unit 1</p>
          <h2 className="text-[17px] font-black leading-tight">Money basics</h2>
        </div>
        <span className="text-[12px] font-black tabular">
          {done}/{lessons.length}
        </span>
      </div>
      <ProgressBar value={done} max={lessons.length} label="Money basics lessons finished" className="h-2 mt-3" />
      <p className="text-[11px] font-bold text-white/50 mt-1.5">+{LESSON_XP} XP for each right answer</p>

      {/* the path */}
      <ol className="relative mt-12 flex flex-col items-center gap-10" aria-label="Money basics lessons">
        {lessons.map((l, i) => {
          const result = state.lessons[l.id];
          const finished = result != null;
          const isCurrent = i === current;
          const dx = OFFSETS[i % OFFSETS.length];
          return (
            <li key={l.id} className="relative flex flex-col items-center" style={{ transform: `translateX(${dx}px)` }}>
              {isCurrent && (
                <motion.span
                  animate={still ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-7 whitespace-nowrap rounded-lg bg-white text-[hsl(258_42%_12%)] px-2 py-0.5 text-[11px] font-black"
                  aria-hidden="true"
                >
                  {done ? "Next" : "Start"}
                </motion.span>
              )}
              <button
                type="button"
                onClick={() => setOpen(l.id)}
                aria-label={`Lesson ${i + 1}: ${l.title}${finished ? ", finished" : ""}`}
                className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-transform active:translate-y-1 ${
                  finished
                    ? "bg-accent text-accent-foreground shadow-[0_5px_0_hsl(var(--accent-deep))]"
                    : isCurrent
                      ? "bg-primary text-white shadow-[0_5px_0_hsl(var(--primary-deep))] ring-4 ring-primary/30"
                      : "bg-[hsl(258_30%_24%)] text-white/80 shadow-[0_5px_0_hsl(258_30%_15%)]"
                }`}
              >
                {finished ? <Check className="w-7 h-7" strokeWidth={3.5} aria-hidden="true" /> : <Star className="w-7 h-7" strokeWidth={2.5} fill={isCurrent ? "currentColor" : "none"} aria-hidden="true" />}
              </button>
              <span className="mt-2 max-w-[120px] text-center text-[11px] font-extrabold leading-tight text-white/75">{l.title}</span>
            </li>
          );
        })}
      </ol>

      {/* mascot at the end of the unit */}
      <div className="flex justify-center mt-4">
        <BrokieMascot mood={done === lessons.length ? "proud" : "happy"} size={56} title="" />
      </div>

      {/* what comes next: locked units */}
      <ul className="mt-6 space-y-3">
        {LOCKED_UNITS.map((u, k) => (
          <li key={u.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 shrink-0 rounded-xl bg-white/[0.06] flex items-center justify-center text-white/40">
                <Lock className="w-4 h-4" aria-hidden="true" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase tracking-wide text-white/40">Unit {k + 2}</p>
                <p className="text-[14.5px] font-black text-white/60 leading-tight">{u.title}</p>
              </div>
              <span className="text-[11px] font-bold text-white/40">{u.lessons} lessons</span>
            </div>
            <div className="flex gap-2 mt-3" aria-hidden="true">
              {Array.from({ length: u.lessons }).map((_, j) => (
                <span key={j} className="w-7 h-7 rounded-full bg-white/[0.06]" />
              ))}
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[11px] font-bold text-white/45 mt-3 text-center">Finish Money basics to unlock Unit 2. More units coming soon.</p>
      <p className="text-[10.5px] font-bold text-white/35 mt-2 text-center">General money education, not financial advice.</p>
    </div>
  );
};

export default LearnScreen;
