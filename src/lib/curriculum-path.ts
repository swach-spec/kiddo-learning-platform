import { ActivityResult } from "@/types/activity";
import { CurriculumNode, NextLearningDecision } from "@/types/curriculum-path";
import { getSkillSnapshot } from "@/lib/adaptive-learning";
import { getEnglishPath } from "@/content/curriculum/english-path";

function nodeEvidence(results: ActivityResult[], node: CurriculumNode) {
  return results.filter((result) => result.activityId === node.activityId || result.activityId === node.id);
}

export function isNodeComplete(results: ActivityResult[], node: CurriculumNode): boolean {
  const evidence = nodeEvidence(results, node);
  if (!evidence.length) return false;
  if (node.kind === "lesson" || node.kind === "story") return evidence.some((result) => result.correct === true);
  const answered = evidence.filter((result) => typeof result.correct === "boolean");
  if (answered.length < 1) return false;
  return answered.some((result) => result.correct === true);
}

export function getPathProgress(results: ActivityResult[], path: CurriculumNode[]) {
  const required = path.filter((node) => node.required);
  const completed = required.filter((node) => isNodeComplete(results, node)).length;
  return { completed, total: required.length, percent: required.length ? Math.round((completed / required.length) * 100) : 0 };
}

export function getNextCurriculumNode(results: ActivityResult[], path: CurriculumNode[]): CurriculumNode | null {
  return path.find((node) => !isNodeComplete(results, node)) ?? null;
}

export function getNextLearningDecision(results: ActivityResult[], grade: number): NextLearningDecision | null {
  const node = getNextCurriculumNode(results, getEnglishPath(grade));
  if (!node) return null;
  const snapshot = getSkillSnapshot(results, node.concept.includes("word") ? "vocabulary" : "grammar");
  if (snapshot.state === "needs_support") return { node, route: "remediation", action: "support", reason: "KIDDO noticed that this idea needs more support before you move on." };
  if (node.kind === "lesson") return { node, route: "main", action: "learn", reason: "This is the next required idea on your grade pathway." };
  if (node.kind === "mastery") return { node, route: "mastery", action: "challenge", reason: "You have reached a mastery checkpoint for this part of the pathway." };
  if (snapshot.state === "secure" && snapshot.accuracy >= 0.9 && snapshot.hints === 0) return { node, route: "acceleration", action: "challenge", reason: "You are showing strong understanding, so KIDDO can reduce repetition and give you a stronger task." };
  return { node, route: "main", action: "practise", reason: "Practise this idea, then KIDDO will use your performance to decide what comes next." };
}
