import { getOrStartLearningAttempt } from "@/lib/learning-attempt";
import { completeLearningSession, CompletionRequest } from "@/lib/learning-completion";

/** The page-facing bridge from in-memory answers to authoritative curriculum completion. */
export function isCurriculumLaunch(nodeId: string | null): nodeId is string { return Boolean(nodeId); }
export function prepareCurriculumAttempt(playerId: string, nodeId: string, activityId: string, replay = false) {
  return getOrStartLearningAttempt(playerId, nodeId, activityId, replay);
}

export function submitCurriculumCompletion(request: CompletionRequest) {
  return completeLearningSession(request);
}