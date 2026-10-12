import { getChallengeSession } from "@/lib/challenge";
import { getLearningPath } from "@/content/curriculum/learning-path";
import { getStoryById } from "@/content";
import { getActivityResults, recordActivityResult, awardXP, markStoryCompleted, updateLearnerPosition } from "@/lib/player";
import { getNextLearningDecision } from "@/lib/curriculum-path";
import { ActivityResult } from "@/types/activity";
import { completeLearningAttempt } from "@/lib/learning-attempt";

export type SessionAnswer = { questionId: string; correct: boolean; xp: number; skills: ActivityResult["skills"]; difficulty?: 1 | 2 | 3 };
export type CompletionRequest = { playerId: string; grade: number; nodeId: string | null; routeId: string; sessionId: string; answers: SessionAnswer[]; story?: boolean };
export type CompletionResult = { status: "completed" | "duplicate" | "invalid"; score: number; totalQuestions: number; xpAwarded: number; nextAction: ReturnType<typeof getNextLearningDecision> };

function routeId(route: string | undefined) { return route?.split("/").filter(Boolean).at(-1); }
function threshold(kind: string) { return kind === "guided_practice" ? .6 : kind === "independent_practice" ? .8 : kind === "mastery" ? .9 : .6; }
function resultId(sessionId: string, suffix: string) { return `learning-session:${sessionId}:${suffix}`; }

/** The single client-side completion boundary for curriculum learning sessions. */
export function completeLearningSession(request: CompletionRequest): CompletionResult {
  const path = getLearningPath(request.grade);
  const node = request.nodeId ? path.find((item) => item.id === request.nodeId) : undefined;
  const expectedRoute = request.story ? routeId(node?.route) : routeId(node?.route);
  const supportRoute = routeId(node?.supportRoute);
  const isSupport = !request.story && request.routeId === supportRoute;
  const validRoute = Boolean(node && request.sessionId && (request.routeId === expectedRoute || isSupport));
  const expected = request.story ? getStoryById(request.routeId)?.questions : getChallengeSession(request.routeId).challenges;
  const expectedIds = new Set(expected?.map((item) => item.id) ?? []);
  const unique = new Set(request.answers.map((item) => item.questionId));
  if (!validRoute || !expected || request.answers.length !== expected.length || unique.size !== request.answers.length || request.answers.some((item) => !expectedIds.has(item.questionId))) {
    return { status: "invalid", score: 0, totalQuestions: expected?.length ?? 0, xpAwarded: 0, nextAction: getNextLearningDecision(getActivityResults(request.playerId), request.grade) };
  }
  const completionActivityId = request.story ? request.routeId : getChallengeSession(request.routeId).completionActivityId;
  const existing = getActivityResults(request.playerId).find((item) => item.id === resultId(request.sessionId, "summary"));
  if (existing) return { status: "duplicate", score: existing.score ?? 0, totalQuestions: existing.totalQuestions ?? expected.length, xpAwarded: 0, nextAction: getNextLearningDecision(getActivityResults(request.playerId), request.grade) };
  const now = new Date().toISOString(); const score = request.answers.filter((item) => item.correct).length; const xp = request.answers.filter((item) => item.correct).reduce((sum, item) => sum + item.xp, 0); const passed = score / expected.length >= threshold(isSupport ? "guided_practice" : node!.kind);
  request.answers.forEach((answer) => recordActivityResult({ id: resultId(request.sessionId, `question:${answer.questionId}`), playerId: request.playerId, activityType: request.story ? "story_question" : "practice_challenge", activityId: answer.questionId, curriculumNodeId: node!.id, storyId: request.story ? request.routeId : undefined, skills: answer.skills, correct: answer.correct, attempts: 1, hintsUsed: 0, difficulty: answer.difficulty, xpAwarded: answer.correct ? answer.xp : 0, timestamp: now, sessionId: request.sessionId, isRemediation: isSupport }));
  if (request.story) recordActivityResult({ id: resultId(request.sessionId, "reading"), playerId: request.playerId, activityType: "story_reading", activityId: request.routeId, storyId: request.routeId, curriculumNodeId: node!.id, skills: ["reading_comprehension"], correct: null, attempts: 1, hintsUsed: 0, xpAwarded: 0, timestamp: now, sessionId: request.sessionId });
  const recorded = recordActivityResult({ id: resultId(request.sessionId, "summary"), playerId: request.playerId, activityType: request.story ? "story_question" : "practice_challenge", activityId: completionActivityId, curriculumNodeId: node!.id, storyId: request.story ? request.routeId : undefined, skills: request.answers.flatMap((item) => item.skills), correct: passed, attempts: expected.length, hintsUsed: 0, xpAwarded: 0, timestamp: now, sessionId: request.sessionId, isSessionSummary: true, isRemediation: isSupport, score, totalQuestions: expected.length });
  if (!recorded) return { status: "duplicate", score, totalQuestions: expected.length, xpAwarded: 0, nextAction: getNextLearningDecision(getActivityResults(request.playerId), request.grade) };
  if (request.story) markStoryCompleted(request.playerId, request.routeId); if (xp) awardXP(request.playerId, xp); completeLearningAttempt(request.sessionId);
  const nextAction = getNextLearningDecision(getActivityResults(request.playerId), request.grade); if (nextAction) updateLearnerPosition(request.playerId, { currentSubject: nextAction.node.subject, currentCurriculumNodeId: nextAction.node.id, currentActivityId: nextAction.node.activityId ?? nextAction.node.id });
  return { status: "completed", score, totalQuestions: expected.length, xpAwarded: xp, nextAction };
}
export type FreePracticeRequest = { playerId: string; grade: number; routeId: string; sessionId: string; answers: SessionAnswer[] };

/**
 * Completion for practice opened outside the curriculum path (Practice page,
 * story follow-ups, Today's Adventure). It records the answers and awards XP
 * exactly once per session, but never counts as curriculum evidence: no
 * curriculum node is attached, so progression decisions are unaffected.
 */
export function completeFreePracticeSession(request: FreePracticeRequest): CompletionResult {
  const nextAction = () => getNextLearningDecision(getActivityResults(request.playerId), request.grade);
  const session = getChallengeSession(request.routeId);
  const expectedIds = new Set(session.challenges.map((item) => item.id));
  const unique = new Set(request.answers.map((item) => item.questionId));
  if (!request.sessionId || !session.challenges.length || request.answers.length !== session.challenges.length || unique.size !== request.answers.length || request.answers.some((item) => !expectedIds.has(item.questionId))) {
    return { status: "invalid", score: 0, totalQuestions: session.challenges.length, xpAwarded: 0, nextAction: nextAction() };
  }
  const total = session.challenges.length;
  const existing = getActivityResults(request.playerId).find((item) => item.id === resultId(request.sessionId, "summary"));
  if (existing) return { status: "duplicate", score: existing.score ?? 0, totalQuestions: existing.totalQuestions ?? total, xpAwarded: 0, nextAction: nextAction() };
  const now = new Date().toISOString();
  const score = request.answers.filter((item) => item.correct).length;
  const xp = request.answers.filter((item) => item.correct).reduce((sum, item) => sum + item.xp, 0);
  request.answers.forEach((answer) => recordActivityResult({ id: resultId(request.sessionId, `question:${answer.questionId}`), playerId: request.playerId, activityType: "practice_challenge", activityId: answer.questionId, skills: answer.skills, correct: answer.correct, attempts: 1, hintsUsed: 0, difficulty: answer.difficulty, xpAwarded: answer.correct ? answer.xp : 0, timestamp: now, sessionId: request.sessionId }));
  const recorded = recordActivityResult({ id: resultId(request.sessionId, "summary"), playerId: request.playerId, activityType: "practice_challenge", activityId: session.completionActivityId, skills: request.answers.flatMap((item) => item.skills), correct: score / total >= 0.6, attempts: total, hintsUsed: 0, xpAwarded: 0, timestamp: now, sessionId: request.sessionId, isSessionSummary: true, score, totalQuestions: total });
  if (!recorded) return { status: "duplicate", score, totalQuestions: total, xpAwarded: 0, nextAction: nextAction() };
  if (xp) awardXP(request.playerId, xp);
  completeLearningAttempt(request.sessionId);
  return { status: "completed", score, totalQuestions: total, xpAwarded: xp, nextAction: nextAction() };
}
