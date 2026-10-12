import { beforeEach, describe, expect, it } from "vitest";
import { getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { getAuthoritativeNextAction } from "@/lib/guided-learning";
import { prepareCurriculumAttempt, submitCurriculumCompletion } from "@/lib/learning-session-flow";
import { getChallengeSession } from "@/lib/challenge";
import { getLearningPath } from "@/content/curriculum/learning-path";
import { getUnitsForGrade } from "@/content/units";
import { CurriculumNode } from "@/types/curriculum-path";
import { getStoryById } from "@/content";

const store = new Map<string, string>();
const localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
};

function setup(grade: string) {
  store.clear();
  (globalThis as unknown as { window: unknown }).window = { localStorage };
  const player = { id: "p", accountId: "a", name: "A", avatar: "🙂", grade, level: 1, xp: 0, streak: 0, storiesCompleted: 0, badges: 0, completedStoryIds: [] };
  localStorage.setItem("kiddo-accounts", JSON.stringify([{ id: "a", email: "a@a.com", pin: "1234", familyName: "F", createdAt: "x" }]));
  localStorage.setItem("kiddo-session", JSON.stringify({ accountId: "a" }));
  localStorage.setItem("kiddo-players", JSON.stringify([player]));
  localStorage.setItem("kiddo-current-player", JSON.stringify(player));
}

function completeLesson(node: CurriculumNode) {
  recordActivityResult({ id: `lesson:p:${node.curriculumId}`, playerId: "p", activityType: "lesson", activityId: node.activityId ?? node.id, curriculumNodeId: node.id, skills: ["number_sense"], correct: true, attempts: 1, hintsUsed: 0, xpAwarded: 0, timestamp: new Date().toISOString() });
}

function playStep(grade: number, node: CurriculumNode, allCorrect: boolean, routeOverride?: string) {
  const routeId = (routeOverride ?? node.route ?? "").replace("/challenge/", "");
  const attempt = prepareCurriculumAttempt("p", node.id, routeId);
  const questions = getChallengeSession(routeId).challenges;
  return submitCurriculumCompletion({
    playerId: "p",
    grade,
    nodeId: node.id,
    routeId,
    sessionId: attempt.id,
    answers: questions.map((question, index) => ({ questionId: question.id, correct: allCorrect || index === 0, xp: question.xp, skills: [question.skill], difficulty: question.difficulty })),
  });
}

describe("a Grade 3 learner on the unit-based path", () => {
  beforeEach(() => setup("Grade 3"));

  it("starts with the first unit's Discover step instead of the old placeholder", () => {
    const first = getUnitsForGrade(3)[0];
    expect(getAuthoritativeNextAction("p", 3)?.node.id).toBe(`${first.id}--learn`);
    expect(getAuthoritativeNextAction("p", 3)?.action).toBe("learn");
  });

  it("walks a whole unit: Discover → Try together → Try on your own → Use it → Mastery, then moves to the next unit", () => {
    const path = getLearningPath(3);
    const unitId = path[0].curriculumId;
    const unitSteps = path.filter((node) => node.curriculumId === unitId);

    for (const node of unitSteps) {
      expect(getAuthoritativeNextAction("p", 3)?.node.id).toBe(node.id);
      if (node.kind === "lesson") {
        completeLesson(node);
        continue;
      }
      if (node.kind === "story") {
        const storyId = (node.route ?? "").replace("/story/", "");
        const story = getStoryById(storyId)!;
        const attempt = prepareCurriculumAttempt("p", node.id, storyId);
        const read = submitCurriculumCompletion({ playerId: "p", grade: 3, nodeId: node.id, routeId: storyId, sessionId: attempt.id, story: true, answers: story.questions.map((question) => ({ questionId: question.id, correct: true, xp: question.xp, skills: question.skills, difficulty: question.difficulty })) });
        expect(read.status, node.id).toBe("completed");
        continue;
      }
      const result = playStep(3, node, true);
      expect(result.status, node.id).toBe("completed");
      expect(result.score).toBe(result.totalQuestions);
    }

    const next = getAuthoritativeNextAction("p", 3);
    const afterUnit = path.find((node) => node.curriculumId !== unitId);
    expect(next?.node.id).toBe(afterUnit?.id ?? undefined);
    expect(getCurrentPlayer()?.xp).toBeGreaterThan(0);
  });

  it("offers the unit's own support activity after two weak sessions, and returns to the main step after it", () => {
    const path = getLearningPath(3);
    completeLesson(path[0]);
    const guided = path[1];
    playStep(3, guided, false);
    playStep(3, guided, false);
    const decision = getAuthoritativeNextAction("p", 3);
    expect(decision?.route).toBe("remediation");
    expect(decision?.node.route).toBe(guided.supportRoute);

    const support = playStep(3, guided, true, guided.supportRoute);
    expect(support.status).toBe("completed");
    expect(getAuthoritativeNextAction("p", 3)?.node.id).toBe(guided.id);
    expect(getAuthoritativeNextAction("p", 3)?.route).toBe("main");
    expect(getActivityResults("p").filter((result) => result.isRemediation && result.isSessionSummary)).toHaveLength(1);
  });

  it("rejects a unit bank submitted against another unit's step", () => {
    const path = getLearningPath(3);
    completeLesson(path[0]);
    const other = path.find((node) => node.kind === "guided_practice" && node.curriculumId !== path[0].curriculumId);
    if (!other) return; // only one unit published so far
    expect(playStep(3, path[1], true, other.route).status).toBe("invalid");
  });
});
