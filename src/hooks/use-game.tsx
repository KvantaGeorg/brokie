import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import { CHALLENGE_DEFS, CHECK_DAYS_GOAL, GOAL_ADD_TARGET, PROFILE, levelXp, type ChallengeId, type ChallengeStatus } from "@/data/challenges";
import { FEATURED_ID, modelFor, type Budget, type Cat } from "@/data/students";
import { LESSON_XP, type LessonId } from "@/data/lessons";
import { BANKS } from "@/data/banks";

/* One shared state for the whole demo app: onboarding, budget, savings goal, challenges and XP.
   Front-end only. Money (budget, goal) and XP are tracked separately: XP never changes money and vice versa. */

export type OnboardingStep = "auth" | "student" | "banks" | "analyzing" | "results" | "budget" | "goal" | "done";
export const ONBOARDING_STEPS: OnboardingStep[] = ["auth", "student", "banks", "analyzing", "results", "budget", "goal", "done"];

export type Goal = { name: string; target: number; saved: number; date?: string };
export type Contribution = { id: number; amount: number; day: number };

export type AppEvent =
  | { key: number; kind: "goal-add"; amount: number }
  | { key: number; kind: "goal-created" }
  | { key: number; kind: "budget-checked"; days: number }
  | { key: number; kind: "challenge-done"; id: ChallengeId; xp: number }
  | { key: number; kind: "challenge-missed"; id: ChallengeId }
  | { key: number; kind: "lesson-done"; title: string; xp: number; correct: boolean };

export type GameState = {
  step: OnboardingStep;
  studentId: string; // which dataset student the demo runs on
  lessons: Partial<Record<LessonId, boolean>>; // finished lessons: true if the quiz was answered right
  banks: string[];
  budget: Budget;
  budgetConfirmed: boolean;
  goal: Goal | null;
  contributions: Contribution[];
  day: number; // demo days passed since the plan was made (moved only by "simulate next day")
  checks: { days: number; lastDay: number };
  challenges: Record<ChallengeId, ChallengeStatus>;
  xp: number; // progress inside the current level
  totalXp: number;
  weekXp: number;
  level: number;
  levelUp: number | null; // level just reached, while the celebration shows
  lastGain: { key: number; id: ChallengeId | LessonId; amount: number } | null;
  event: AppEvent | null;
};

type Action =
  | { type: "goTo"; step: OnboardingStep }
  | { type: "pickStudent"; id: string }
  | { type: "toggleBank"; id: string }
  | { type: "setLimit"; cat: Cat; value: number }
  | { type: "resetBudget" }
  | { type: "confirmBudget" }
  | { type: "saveGoal"; goal: Goal }
  | { type: "addToGoal"; amount: number }
  | { type: "checkBudget" }
  | { type: "nextDay" }
  | { type: "monthEnd" }
  | { type: "finishLesson"; id: LessonId; title: string; correct: boolean }
  | { type: "dismissLevelUp" }
  | { type: "restart" };

const bankIdOf = (studentId: string) => BANKS.find((b) => b.name === modelFor(studentId).student.bank)?.id;

export const freshState = (studentId = FEATURED_ID): GameState => ({
  step: "auth",
  studentId,
  lessons: {},
  banks: [bankIdOf(studentId)].filter(Boolean) as string[],
  budget: { ...modelFor(studentId).suggested },
  budgetConfirmed: false,
  goal: null,
  contributions: [],
  day: 0,
  checks: { days: 0, lastDay: -99 },
  challenges: { "goal-add": "active", "check-budget": "active", "focus-budget": "active" },
  xp: PROFILE.xp,
  totalXp: PROFILE.totalXp,
  weekXp: PROFILE.weekXp,
  level: PROFILE.level,
  levelUp: null,
  lastGain: null,
  event: null,
});

const now = () => Date.now() + Math.random();

/* Adds XP and handles level-ups. */
const award = (state: GameState, id: ChallengeId | LessonId, amount: number): GameState => {
  let xp = state.xp + amount;
  let level = state.level;
  while (xp >= levelXp(level)) {
    xp -= levelXp(level);
    level += 1;
  }
  return {
    ...state,
    xp,
    level,
    totalXp: state.totalXp + amount,
    weekXp: state.weekXp + amount,
    levelUp: level > state.level ? level : state.levelUp,
    lastGain: { key: now(), id, amount },
  };
};

/* Awards a challenge's XP once. A completed challenge can never pay out again. */
const complete = (state: GameState, id: ChallengeId): GameState => {
  if (state.challenges[id] !== "active") return state;
  const amount = CHALLENGE_DEFS.find((c) => c.id === id)!.xp;
  return {
    ...award(state, id, amount),
    challenges: { ...state.challenges, [id]: "done" },
    event: { key: now(), kind: "challenge-done", id, xp: amount },
  };
};

export const goalAdded = (s: GameState) => s.contributions.reduce((sum, c) => sum + c.amount, 0);

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "goTo":
      return { ...state, step: action.step };
    case "pickStudent":
      // A new student starts the plan from their own numbers; XP and lessons stay with the demo user
      return {
        ...freshState(action.id),
        step: "banks",
        xp: state.xp,
        totalXp: state.totalXp,
        weekXp: state.weekXp,
        level: state.level,
        lessons: state.lessons,
      };
    case "toggleBank":
      return { ...state, banks: state.banks.includes(action.id) ? state.banks.filter((b) => b !== action.id) : [...state.banks, action.id] };
    case "setLimit":
      return { ...state, budget: { ...state.budget, [action.cat]: Math.max(0, Math.round(action.value)) } };
    case "resetBudget":
      return { ...state, budget: { ...modelFor(state.studentId).suggested } };
    case "confirmBudget":
      return { ...state, budgetConfirmed: true };
    case "saveGoal": {
      const created = !state.goal;
      return { ...state, goal: action.goal, event: created ? { key: now(), kind: "goal-created" } : state.event };
    }
    case "addToGoal": {
      if (!state.goal || action.amount <= 0) return state;
      const next: GameState = {
        ...state,
        goal: { ...state.goal, saved: Math.round((state.goal.saved + action.amount) * 100) / 100 },
        contributions: [{ id: now(), amount: action.amount, day: state.day }, ...state.contributions],
        event: { key: now(), kind: "goal-add", amount: action.amount },
      };
      return goalAdded(next) >= GOAL_ADD_TARGET ? complete(next, "goal-add") : next;
    }
    case "checkBudget": {
      if (state.checks.lastDay === state.day) return state;
      const days = state.checks.lastDay === state.day - 1 ? state.checks.days + 1 : 1;
      const next: GameState = { ...state, checks: { days, lastDay: state.day }, event: { key: now(), kind: "budget-checked", days } };
      return days >= CHECK_DAYS_GOAL ? complete(next, "check-budget") : next;
    }
    case "nextDay":
      return { ...state, day: state.day + 1 };
    case "monthEnd": {
      // Simulated: the rest of the month brings no further spending in the focus category
      if (state.challenges["focus-budget"] !== "active") return state;
      const { focus, current } = modelFor(state.studentId);
      if (current.byCategory(focus) <= state.budget[focus]) return complete(state, "focus-budget");
      return { ...state, challenges: { ...state.challenges, "focus-budget": "missed" }, event: { key: now(), kind: "challenge-missed", id: "focus-budget" } };
    }
    case "finishLesson": {
      if (state.lessons[action.id] != null) return state;
      const amount = action.correct ? LESSON_XP : Math.round(LESSON_XP / 3);
      return {
        ...award(state, action.id, amount),
        lessons: { ...state.lessons, [action.id]: action.correct },
        event: { key: now(), kind: "lesson-done", title: action.title, xp: amount, correct: action.correct },
      };
    }
    case "dismissLevelUp":
      return { ...state, levelUp: null };
    case "restart":
      return freshState(state.studentId);
  }
};

type Ctx = {
  state: GameState;
  goTo: (step: OnboardingStep) => void;
  pickStudent: (id: string) => void;
  toggleBank: (id: string) => void;
  setLimit: (cat: Cat, value: number) => void;
  resetBudget: () => void;
  confirmBudget: () => void;
  saveGoal: (goal: Goal) => void;
  addToGoal: (amount: number) => void;
  checkBudget: () => void;
  nextDay: () => void;
  monthEnd: () => void;
  finishLesson: (id: LessonId, title: string, correct: boolean) => void;
  dismissLevelUp: () => void;
  restart: () => void;
};

const GameContext = createContext<Ctx | null>(null);

/* Session persistence (optional): survives reloads and leaving /demo. Transient UI events are not stored. */
const load = (key?: string): GameState | null => {
  if (!key) return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? { ...freshState(), ...JSON.parse(raw), levelUp: null, lastGain: null, event: null } : null;
  } catch {
    return null;
  }
};

export const GameProvider = ({ children, persistKey, initial }: { children: ReactNode; persistKey?: string; initial?: Partial<GameState> }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => load(persistKey) ?? { ...freshState(), ...initial });

  useEffect(() => {
    if (!persistKey) return;
    try {
      const { levelUp: _l, lastGain: _g, event: _e, ...keep } = state;
      sessionStorage.setItem(persistKey, JSON.stringify(keep));
    } catch {
      /* storage unavailable: the demo still works for this page view */
    }
  }, [state, persistKey]);

  // Stable action functions, so effects can depend on them without re-running
  const actions = useMemo(
    () => ({
      goTo: (step: OnboardingStep) => dispatch({ type: "goTo", step }),
      pickStudent: (id: string) => dispatch({ type: "pickStudent", id }),
      toggleBank: (id: string) => dispatch({ type: "toggleBank", id }),
      setLimit: (cat: Cat, v: number) => dispatch({ type: "setLimit", cat, value: v }),
      resetBudget: () => dispatch({ type: "resetBudget" }),
      confirmBudget: () => dispatch({ type: "confirmBudget" }),
      saveGoal: (goal: Goal) => dispatch({ type: "saveGoal", goal }),
      addToGoal: (amount: number) => dispatch({ type: "addToGoal", amount }),
      checkBudget: () => dispatch({ type: "checkBudget" }),
      nextDay: () => dispatch({ type: "nextDay" }),
      monthEnd: () => dispatch({ type: "monthEnd" }),
      finishLesson: (id: LessonId, title: string, correct: boolean) => dispatch({ type: "finishLesson", id, title, correct }),
      dismissLevelUp: () => dispatch({ type: "dismissLevelUp" }),
      restart: () => dispatch({ type: "restart" }),
    }),
    [],
  );
  const value: Ctx = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};

/* The numbers of the student the demo currently runs on. */
export const useStudent = () => modelFor(useGame().state.studentId);
