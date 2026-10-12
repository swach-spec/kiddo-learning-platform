import { getOrStartLearningAttempt } from "@/lib/learning-attempt";
import { completeFreePracticeSession, completeLearningSession, CompletionRequest } from "@/lib/learning-completion";

/** The page-facing bridge from in-memory answers to authoritative completion. */
export function isCurriculumLaunch(nodeId: string | null): nodeId is string { return Boolean(nodeId); }

/** Practice opened without a curriculum node uses this pseudo-node for its attempt identity. */
export const FREE_PRACTICE_NODE = "free-practice";

export function prepareCurriculumAttempt(playerId: string, nodeId: string, activityId: string, replay = false) {
  return getOrStartLearningAttempt(playerId, nodeId, activityId, replay);
}

/** Curriculum launches go through the progression engine; free practice only records answers and XP. */
export function submitCurriculumCompletion(request: CompletionRequest) {
  if (!isCurriculumLaunch(request.nodeId) || request.nodeId === FREE_PRACTICE_NODE) {
    if (request.story) return completeLearningSession(request);
    return completeFreePracticeSession({ playerId: request.playerId, grade: request.grade, routeId: request.routeId, sessionId: request.sessionId, answers: request.answers });
  }
  return completeLearningSession(request);
}
