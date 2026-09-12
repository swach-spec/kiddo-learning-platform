import { Challenge } from "@/types/challenge";

export type ChallengeSession = { challenges: Challenge[]; completionActivityId: string };
export function buildChallengeSession(pool: Challenge[], completionActivityId: string, size = 5): ChallengeSession {
  const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(size, pool.length));
  return { challenges: shuffled, completionActivityId };
}
export function evaluateChallengeSession(score: number, total: number, passRate = 0.7) {
  return { score, total, passed: total > 0 && score / total >= passRate };
}
