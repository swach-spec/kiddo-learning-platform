import { ActivityResult } from "@/types/activity";
import { CurriculumNode, NextLearningDecision } from "@/types/curriculum-path";
import { getEnglishPath } from "@/content/curriculum/english-path";
import { getActivityResults, getLearnerProgress, updateLearnerPosition } from "@/lib/player";
import { getNextLearningDecision, isNodeComplete } from "@/lib/curriculum-path";

export type GuidedLearningPosition = {
  node: CurriculumNode | null;
  decision: NextLearningDecision | null;
  source: "saved" | "next" | "complete";
};

function findSavedNode(path: CurriculumNode[], progress: ReturnType<typeof getLearnerProgress>) {
  if (!progress) return null;
  if (progress.currentCurriculumNodeId) {
    const byNode = path.find((node) => node.id === progress.currentCurriculumNodeId);
    if (byNode) return byNode;
  }
  if (progress.currentActivityId) {
    const byActivity = path.find((node) => node.activityId === progress.currentActivityId);
    if (byActivity) return byActivity;
  }
  return null;
}

function getNextNode(path: CurriculumNode[], node: CurriculumNode) {
  const index = path.findIndex((candidate) => candidate.id === node.id);
  return index >= 0 ? path[index + 1] ?? null : null;
}

export function getCurrentLearningPosition(
  playerId: string,
  grade: number,
  subject: "english" | "mathematics" = "english",
): GuidedLearningPosition {
  if (subject !== "english") return { node: null, decision: null, source: "next" };

  const path = getEnglishPath(grade);
  const results = getActivityResults(playerId);
  const progress = getLearnerProgress(playerId);
  const savedNode = findSavedNode(path, progress);

  if (savedNode && !isNodeComplete(results, savedNode)) {
    return { node: savedNode, decision: getNextLearningDecision(results, grade), source: "saved" };
  }

  // A completed saved node must not trap the learner on the same step.
  // Advance to the next node in the curriculum sequence.
  if (savedNode && isNodeComplete(results, savedNode)) {
    const nextNode = getNextNode(path, savedNode);
    if (nextNode) {
      const decision = getNextLearningDecision(results, grade);
      return {
        node: nextNode,
        decision: decision?.node.id === nextNode.id
          ? decision
          : {
              node: nextNode,
              route: "main",
              action: nextNode.kind === "lesson" ? "learn" : nextNode.kind === "mastery" ? "challenge" : "practise",
              reason: "You completed the previous step. Here is the next step in your learning adventure.",
            },
        source: "next",
      };
    }
  }

  const decision = getNextLearningDecision(results, grade);
  if (decision) return { node: decision.node, decision, source: "next" };

  return { node: null, decision: null, source: "complete" };
}

export function getNextLearningActivity(playerId: string, grade: number): CurriculumNode | null {
  return getCurrentLearningPosition(playerId, grade).node;
}

export function startLearningNode(playerId: string, node: CurriculumNode) {
  updateLearnerPosition(playerId, {
    currentSubject: node.subject,
    currentCurriculumNodeId: node.id,
    currentActivityId: node.activityId ?? node.id,
  });
}

export function getLearningResults(playerId: string): ActivityResult[] {
  return getActivityResults(playerId);
}
