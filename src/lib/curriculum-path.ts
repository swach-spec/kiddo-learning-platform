import { ActivityResult } from "@/types/activity";
import { CurriculumNode, NextLearningDecision } from "@/types/curriculum-path";
import { getSkillSnapshot } from "@/lib/adaptive-learning";
import { getEnglishPath } from "@/content/curriculum/english-path";

function nodeEvidence(results: ActivityResult[], node: CurriculumNode) {
  return results.filter(
    (r) => r.curriculumId === node.curriculumId || r.activityId === node.activityId
  );
}

export function isNodeComplete(results: ActivityResult[], node: CurriculumNode): boolean {
  const evidence = nodeEvidence(results, node);
  if (!evidence.length) return false;
  if (node.kind === "lesson") return evidence.some((r) => r.correct === true);
  const accuracy = evidence.filter((r) => r.correct === true).length / evidence.length;
  return evidence.length >= 2 && accuracy >= 0.7;
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
  const path = getEnglishPath(grade);
  const node = getNextCurriculumNode(results, path);
  if (!node) return null;

  const evidence = nodeEvidence(results, node);
  const skill = node.concept.includes("agreement") ? "grammar" : node.subject === "english" ? "reading" : "number_sense";
  const snapshot = getSkillSnapshot(results, skill);

  if (evidence.length && (snapshot.state === "needs_support" || snapshot.accuracy < 0.6)) {
    return {
      node,
      route: "remediation",
      action: "support",
      reason: "Your recent work shows that this idea needs another supported attempt before you move on.",
    };
  }

  if (node.kind === "lesson") {
    return { node, route: "main", action: "learn", reason: "This is the next required idea on your grade pathway." };
  }

  if (snapshot.state === "secure" && snapshot.accuracy >= 0.9 && snapshot.hints === 0) {
    return {
      node,
      route: "acceleration",
      action: "challenge",
      reason: "You are showing strong understanding, so KIDDO can reduce repetition and give you a stronger task.",
    };
  }

  if (node.kind === "mastery") {
    return { node, route: "mastery", action: "challenge", reason: "You have reached a mastery checkpoint for this part of the pathway." };
  }

  return { node, route: "main", action: "practise", reason: "Practise this idea, then KIDDO will use your performance to decide what comes next." };
}
