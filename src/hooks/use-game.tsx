import { createContext, useContext, useReducer, type ReactNode } from "react";
import { CHALLENGES, PROFILE, XP_PER_LOG, levelXp, stepFor, type Challenge } from "@/data/challenges";

/* Live game state for one phone: XP, level and challenge progress. Front-end only, resets on reload. */

export type XpGain = { key: number; challengeId: string; amount: number; completed: boolean };

type GameState = {
  xp: number; // progress inside the current level
  totalXp: number;
  weekXp: number;
  level: number;
  challenges: Challenge[];
  lastGain: XpGain | null;
  levelUp: number | null; // the level just reached, while the celebration is showing
};

type Action = { type: "log"; id: string } | { type: "dismissLevelUp" } | { type: "reset" };

const initialState = (): GameState => ({
  xp: PROFILE.xp,
  totalXp: PROFILE.totalXp,
  weekXp: PROFILE.weekXp,
  level: PROFILE.level,
  challenges: CHALLENGES.map((c) => ({ ...c })),
  lastGain: null,
  levelUp: null,
});

const reducer = (state: GameState, action: Action): GameState => {
  switch (action.type) {
    case "log": {
      const c = state.challenges.find((ch) => ch.id === action.id);
      if (!c || c.status === "done") return state;

      const progress = Math.min(c.goal, c.progress + stepFor(c));
      const completed = progress >= c.goal;
      const amount = XP_PER_LOG + (completed ? c.xp : 0);

      // Carry leftover XP into the next level
      let xp = state.xp + amount;
      let level = state.level;
      while (xp >= levelXp(level)) {
        xp -= levelXp(level);
        level += 1;
      }

      return {
        xp,
        totalXp: state.totalXp + amount,
        weekXp: state.weekXp + amount,
        level,
        challenges: state.challenges.map((ch) => (ch.id === c.id ? { ...ch, progress, status: completed ? "done" : "active" } : ch)),
        lastGain: { key: Date.now(), challengeId: c.id, amount, completed },
        levelUp: level > state.level ? level : state.levelUp,
      };
    }
    case "dismissLevelUp":
      return { ...state, levelUp: null };
    case "reset":
      return initialState();
  }
};

const GameContext = createContext<{ state: GameState; logProgress: (id: string) => void; dismissLevelUp: () => void; reset: () => void } | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  return (
    <GameContext.Provider
      value={{
        state,
        logProgress: (id) => dispatch({ type: "log", id }),
        dismissLevelUp: () => dispatch({ type: "dismissLevelUp" }),
        reset: () => dispatch({ type: "reset" }),
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
};
