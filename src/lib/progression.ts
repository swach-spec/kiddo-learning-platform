import { ActivityResult } from "@/types/activity";
import { CurriculumNode } from "@/types/curriculum-path";
import { getNodeLearningState, isNodeComplete } from "@/lib/curriculum-path";

export type ProgressionOutcome = "advance" | "continue" | "support";

export type ProgressionDecision = {
  outcome: ProgressionOutcome;
  node: CurriculumNode;
  nextNode: CurriculumNode | null;
  state: ReturnType<typeof getNodeLearningState>;
  reason: string;
};

function nextNode(path: CurriculumNode[], node: CurriculumNode) {
  const index = path.findIndex((item) => item.id === node.id);
  return index >= 0 ? path[index + 1] ?? null : null;
}

export function getProgressionDecision(
  results: ActivityResult[],
  path: CurriculumNode[],
  node: CurriculumNode,
): ProgressionDecision {
  const state = getNodeLearningState(results, node);
  const next = nextNode(path, node);

  if (state === "needs_support") {
    return {
      outcome: "support",
      node: node.supportRoute ? { ...node, route: node.supportRoute } : node,
      nextNode: next,
      state,
      reason: "The learner needs more support before progressing on this idea.",
    };
  }

  if (!isNodeComplete(results, node)) {
    return {
      outcome: "continue",
      node,
      nextNode: next,
      state,
      reason: "The learner is still building evidence for this curriculum step.",
    };
  }

  return {
    outcome: "advance",
    node,
    nextNode: next,
    state,
    reason: next
      ? "The learner has met the evidence required for this step, so KIDDO can move to the next curriculum node."
      : "The learner has completed the final required step on this pathway.",
  };
}
