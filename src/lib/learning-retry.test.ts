import { beforeEach, describe, expect, it } from "vitest";
import { getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { getAuthoritativeNextAction } from "@/lib/guided-learning";
import { FREE_PRACTICE_NODE, prepareCurriculumAttempt, submitCurriculumCompletion } from "@/lib/learning-session-flow";
import { getChallengeSession } from "@/lib/challenge";
import { getStoryById } from "@/content";

const store = new Map<string, string>();
const localStorage = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
};

function setup() {
  store.clear();
  (globalThis as unknown as { window: unknown }).window = { localStorage };
  const player = { id: "p", accountId: "a", name: "A", avatar: "🙂", grade: "Grade 2", level: 1, xp: 0, streak: 0, storiesCompleted: 0, badges: 0, completedStoryIds: [] };
  localStorage.setItem("kiddo-accounts", JSON.stringify([{ id: "a", email: "a@a.com", pin: "1234", familyName: "F", createdAt: "x" }]));
  localStorage.setItem("kiddo-session", JSON.stringify({ accountId: "a" }));
  localStorage.setItem("kiddo-players", JSON.stringify([player]));
  localStorage.setItem("kiddo-current-player", JSON.stringify(player));
  recordActivityResult({ id: "lesson", playerId: "p", activityType: "lesson", activityId: "english-g2-describing-words", curriculumNodeId: "g2-describing-learn", skills: ["grammar"], correct: true, attempts: 1, hintsUsed: 0, xpAwarded: 0, timestamp: "x" });
}

/** Simulates the page: open the activity (prepare attempt), answer everything, finish. */
function playThroughPage(nodeId: string | null, routeId: string, correctCount: number) {
  const attempt = prepareCurriculumAttempt("p", nodeId ?? FREE_PRACTICE_NODE, routeId);
  const questions = getChallengeSession(routeId).challenges;
  return submitCurriculumCompletion({
    playerId: "p",
    grade: 2,
    nodeId,
    routeId,
    sessionId: attempt.id,
    answers: questions.map((question, index) => ({ questionId: question.id, correct: index < correctCount, xp: question.xp, skills: [question.skill], difficulty: question.difficulty })),
  });
}

describe("retry after a weak score", () => {
  beforeEach(setup);

  it("records a retry through the normal link as a new session and lets the learner pass", () => {
    const weak = playThroughPage("g2-describing-guided", "g2-guided-1", 2);
    expect(weak.status).toBe("completed");
    expect(getAuthoritativeNextAction("p", 2)?.node.id).toBe("g2-describing-guided");

    const retry = playThroughPage("g2-describing-guided", "g2-guided-1", 8);
    expect(retry.status).toBe("completed");
    expect(retry.score).toBe(8);
    expect(getActivityResults("p").filter((result) => result.isSessionSummary && result.curriculumNodeId === "g2-describing-guided")).toHaveLength(2);
    expect(getAuthoritativeNextAction("p", 2)?.node.id).toBe("g2-describing-independent");
  });

  it("reaches the support activity after two weak sessions played through the page", () => {
    playThroughPage("g2-describing-guided", "g2-guided-1", 1);
    playThroughPage("g2-describing-guided", "g2-guided-1", 1);
    expect(getAuthoritativeNextAction("p", 2)?.route).toBe("remediation");
  });

  it("resumes an unfinished attempt after a refresh instead of starting a new one", () => {
    const first = prepareCurriculumAttempt("p", "g2-describing-guided", "g2-guided-1");
    const afterRefresh = prepareCurriculumAttempt("p", "g2-describing-guided", "g2-guided-1");
    expect(afterRefresh.id).toBe(first.id);
  });
});

describe("free practice (no curriculum node)", () => {
  beforeEach(setup);

  it("saves the answers and awards XP once without touching curriculum progress", () => {
    const before = getAuthoritativeNextAction("p", 2)?.node.id;
    const routeId = "demo-adjective-describing-word";
    const total = getChallengeSession(routeId).challenges.length;
    const result = playThroughPage(null, routeId, total);
    expect(result.status).toBe("completed");
    expect(result.score).toBe(total);
    const xp = getCurrentPlayer()?.xp ?? 0;
    expect(xp).toBeGreaterThan(0);
    expect(getAuthoritativeNextAction("p", 2)?.node.id).toBe(before);
    expect(getActivityResults("p").some((r) => r.isSessionSummary && r.curriculumNodeId === undefined)).toBe(true);
  });

  it("can be practised again, and a duplicate submission pays no extra XP", () => {
    const routeId = "demo-adjective-describing-word";
    const attempt = prepareCurriculumAttempt("p", FREE_PRACTICE_NODE, routeId);
    const questions = getChallengeSession(routeId).challenges;
    const request = { playerId: "p", grade: 2, nodeId: null, routeId, sessionId: attempt.id, answers: questions.map((q) => ({ questionId: q.id, correct: true, xp: q.xp, skills: [q.skill], difficulty: q.difficulty })) };
    expect(submitCurriculumCompletion(request).status).toBe("completed");
    const xp = getCurrentPlayer()?.xp;
    expect(submitCurriculumCompletion(request).status).toBe("duplicate");
    expect(getCurrentPlayer()?.xp).toBe(xp);
    expect(playThroughPage(null, routeId, 1).status).toBe("completed");
  });
});

describe("weak story → support → back to the story (no endless support loop)", () => {
  beforeEach(setup);

  function playStory(correctCount: number) {
    const story = getStoryById("benchmark-grade-2-the-garden-clock")!;
    const attempt = prepareCurriculumAttempt("p", "g2-reading-describing", story.id);
    return submitCurriculumCompletion({ playerId: "p", grade: 2, nodeId: "g2-reading-describing", routeId: story.id, sessionId: attempt.id, story: true, answers: story.questions.map((q, i) => ({ questionId: q.id, correct: i < correctCount, xp: q.xp, skills: q.skills, difficulty: q.difficulty })) });
  }

  it("returns the learner to the story after a passed support activity, then moves on after a strong read", () => {
    playThroughPage("g2-describing-guided", "g2-guided-1", 8);
    playThroughPage("g2-describing-independent", "g2-independent-1", 8);
    expect(playStory(1).nextAction?.route).toBe("remediation");

    const support = playThroughPage("g2-reading-describing", "g2-support-1", 6);
    expect(support.status).toBe("completed");
    expect(getAuthoritativeNextAction("p", 2)?.node.id).toBe("g2-reading-describing");
    expect(getAuthoritativeNextAction("p", 2)?.route).toBe("main");

    expect(playStory(5).nextAction?.node.id).toBe("g2-composition-describing");
  });
});
