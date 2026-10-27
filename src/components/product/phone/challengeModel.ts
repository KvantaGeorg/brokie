import { CHALLENGE_DEFS, CHECK_DAYS_GOAL, GOAL_ADD_TARGET, type ChallengeId, type ChallengeStatus, type ProgressSource } from "@/data/challenges";
import { catMeta, modelFor } from "@/data/students";
import { goalAdded, type GameState } from "@/hooks/use-game";

/* What a challenge card shows, computed from the shared state so every screen agrees. */
export type ChallengeView = {
  id: ChallengeId;
  title: string;
  description: string;
  value: number;
  max: number;
  progressText: string;
  xp: number;
  status: ChallengeStatus;
  source: ProgressSource;
  blocked?: string; // why it can't progress yet
};

export const SOURCE_LABEL: Record<ProgressSource, string> = {
  transactions: "From your transactions",
  app: "Tracked in the app",
  you: "Recorded by you",
};

const eur = (n: number) => `€${Number.isInteger(n) ? n : n.toFixed(2)}`;

export const challengeViews = (s: GameState): ChallengeView[] =>
  CHALLENGE_DEFS.map(({ id, xp, source }) => {
    const status = s.challenges[id];
    switch (id) {
      case "goal-add": {
        const added = Math.min(GOAL_ADD_TARGET, goalAdded(s));
        return {
          id,
          xp,
          source,
          status,
          title: `Add €${GOAL_ADD_TARGET} to your savings goal`,
          description: s.goal ? `Set a little aside for ${s.goal.name}.` : "Create a savings goal to start.",
          value: added,
          max: GOAL_ADD_TARGET,
          progressText: `${eur(added)} of €${GOAL_ADD_TARGET}`,
          blocked: s.goal ? undefined : "Needs a goal",
        };
      }
      case "check-budget":
        return {
          id,
          xp,
          source,
          status,
          title: `Check your budget ${CHECK_DAYS_GOAL} days in a row`,
          description: "Open your budget once a day.",
          value: Math.min(CHECK_DAYS_GOAL, s.checks.days),
          max: CHECK_DAYS_GOAL,
          progressText: `${Math.min(CHECK_DAYS_GOAL, s.checks.days)} of ${CHECK_DAYS_GOAL} days`,
        };
      case "focus-budget": {
        const { focus, current } = modelFor(s.studentId);
        const label = catMeta(focus).label.toLowerCase();
        const spent = current.byCategory(focus);
        const limit = s.budget[focus];
        return {
          id,
          xp,
          source,
          status,
          title: `Stay under €${limit} on ${label} this month`,
          description: spent <= limit ? `${eur(Math.round((limit - spent) * 100) / 100)} left for ${label}.` : `${eur(Math.round((spent - limit) * 100) / 100)} over your ${label} budget.`,
          value: Math.min(spent, limit),
          max: Math.max(limit, 1),
          progressText: `${eur(spent)} of €${limit} used`,
        };
      }
    }
  });

/* The challenge Brokie suggests next: goal first, then the daily check, then the month-long one. */
export const featuredChallenge = (s: GameState) => challengeViews(s).find((c) => c.status === "active" && !c.blocked) ?? challengeViews(s)[0];
