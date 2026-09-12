import { Challenge } from "@/types/challenge";

export type SessionResult = {
  score: number;
  total: number;
  passed: boolean;
};

export function buildPracticeSession(pool: Challenge[], size = 5): Challenge[] {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(size, shuffled.length));
}

export function evaluatePracticeSession(score: number, total: number, passRate = 0.7): SessionResult {
  return { score, total, passed: total > 0 && score / total >= passRate };
}
