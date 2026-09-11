import { ActivityResult } from "@/lib/player";

export type LearningState = "secure" | "developing" | "needs_support";
export type LearningAction = "advance" | "practice" | "support" | "challenge";

export type SkillSnapshot = {
  skill: string;
  state: LearningState;
  accuracy: number;
  attempts: number;
  hints: number;
  averageResponseTimeMs: number | null;
};

const MIN_ATTEMPTS = 3;

function getSkillResults(results: ActivityResult[], skill: string) {
  return results.filter((result) => result.skills.includes(skill as never));
}

export function getSkillSnapshot(results: ActivityResult[], skill: string): SkillSnapshot {
  const relevant = getSkillResults(results, skill);
  if (relevant.length === 0) {
    return { skill, state: "developing", accuracy: 0, attempts: 0, hints: 0, averageResponseTimeMs: null };
  }

  const accuracy = relevant.filter((r) => r.correct === true).length / relevant.length;
  const hints = relevant.reduce((sum, r) => sum + r.hintsUsed, 0);
  const timed = relevant.filter((r) => typeof r.responseTimeMs === "number");
  const averageResponseTimeMs = timed.length
    ? Math.round(timed.reduce((sum, r) => sum + (r.responseTimeMs ?? 0), 0) / timed.length)
    : null;

  let state: LearningState = "developing";
  if (relevant.length >= MIN_ATTEMPTS && accuracy >= 0.8 && hints / relevant.length <= 1) state = "secure";
  if (accuracy < 0.6 || (relevant.length >= MIN_ATTEMPTS && hints / relevant.length >= 2)) state = "needs_support";

  return { skill, state, accuracy, attempts: relevant.length, hints, averageResponseTimeMs };
}

export function recommendNextAction(results: ActivityResult[], skill: string): LearningAction {
  const snapshot = getSkillSnapshot(results, skill);
  if (snapshot.state === "needs_support") return "support";
  if (snapshot.state === "secure" && snapshot.accuracy >= 0.9 && snapshot.hints === 0) return "challenge";
  if (snapshot.state === "secure") return "advance";
  return "practice";
}

export function getOverallLearningState(results: ActivityResult[], skills: string[]): LearningState {
  if (!skills.length) return "developing";
  const snapshots = skills.map((skill) => getSkillSnapshot(results, skill));
  if (snapshots.some((s) => s.state === "needs_support")) return "needs_support";
  if (snapshots.every((s) => s.state === "secure")) return "secure";
  return "developing";
}
