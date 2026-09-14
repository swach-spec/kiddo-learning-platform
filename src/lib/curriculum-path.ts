import { ActivityResult } from "@/types/activity";
import { CurriculumNode, NextLearningDecision } from "@/types/curriculum-path";
import { getOverallLearningState } from "@/lib/adaptive-learning";
import { getEnglishPath } from "@/content/curriculum/english-path";
import { getMasteryPolicy, meetsMasteryThreshold } from "@/lib/mastery";

function nodeEvidence(results: ActivityResult[], node: CurriculumNode) {
  const nodeSpecific = results.filter((result) => result.curriculumNodeId === node.id);
  if (nodeSpecific.length) return nodeSpecific;

  // Practice stages intentionally share one challenge implementation, so
  // legacy activityId matching must not make every stage appear complete.
  if (node.kind === "guided_practice" || node.kind === "independent_practice" || node.kind === "mastery") return [];

  // The adjective lesson predates curriculumNodeId. Keep existing learner
  // progress valid while the curriculum layer is being introduced.
  const legacyLessonIds = [`english-g${node.grade}-describing-words`, `english-g${node.grade}-adjectives`];
  return results.filter((result) => result.activityId === node.activityId || result.activityId === node.id || (node.kind === "lesson" && legacyLessonIds.includes(result.activityId)));
}

export function getNodeLearningState(results: ActivityResult[], node: CurriculumNode) {
  let evidence = nodeEvidence(results, node);

  if (node.kind === "guided_practice" || node.kind === "independent_practice" || node.kind === "mastery") {
    evidence = evidence
      .filter((result) => result.isSessionSummary === true)
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    if (!evidence.length) return "developing" as const;

    // A remediation session is a reset point for the support decision. A
    // successful support session clears the old failure streak; a failed one
    // keeps the learner in support rather than silently sending them back to
    // the same failing activity.
    const latest = evidence[evidence.length - 1];
    const previous = evidence[evidence.length - 2];
    if (latest?.isRemediation === true) {
      return latest.correct === true ? "developing" as const : "needs_support" as const;
    }

    // Remediation should respond to a current pattern of difficulty, not make
    // an old failure permanently sticky. Two consecutive failed sessions are
    // enough to trigger support. A passing session clears that remediation
    // state and lets the learner keep building mastery evidence.
    if (latest?.correct === false && previous?.correct === false) return "needs_support" as const;

    const policy = getMasteryPolicy(node.kind);
    if (policy && meetsMasteryThreshold(results, node.id, node.kind)) return "secure" as const;

    return "developing" as const;
  }

  if (!evidence.length) return "developing" as const;
  const skills = [...new Set(evidence.flatMap((result) => result.skills))];
  return getOverallLearningState(evidence, skills);
}

export function isNodeComplete(results: ActivityResult[], node: CurriculumNode): boolean {
  const evidence = nodeEvidence(results, node);
  if (!evidence.length) return false;
  if (node.kind === "lesson") return evidence.some((result) => result.correct === true);
  if (node.kind === "story") return evidence.some((result) => result.activityType === "story_reading");
  if (node.kind === "guided_practice" || node.kind === "independent_practice" || node.kind === "mastery") {
    return meetsMasteryThreshold(results, node.id, node.kind);
  }
  return evidence.some((result) => result.correct === true);
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
  const state = getNodeLearningState(results, node);

  if (state === "needs_support") {
    const supportNode = node.supportRoute ? { ...node, route: node.supportRoute } : node;
    return { node: supportNode, route: "remediation", action: "support", reason: "KIDDO noticed that this idea needs more support before you move on." };
  }
  if (node.kind === "lesson") return { node, route: "main", action: "learn", reason: "This is the next required idea on your grade pathway." };
  if (node.kind === "mastery") return { node, route: "mastery", action: "challenge", reason: "You have reached a mastery checkpoint for this part of the pathway." };
  if (state === "secure") return { node, route: "acceleration", action: "challenge", reason: "You are showing strong understanding, so KIDDO can reduce repetition and give you a stronger task." };
  return { node, route: "main", action: "practise", reason: "Practise this idea, then KIDDO will use your performance to decide what you need next." };
}
