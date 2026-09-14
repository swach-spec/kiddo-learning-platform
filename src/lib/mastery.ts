import { ActivityResult } from "@/types/activity";
import { CurriculumNodeKind } from "@/types/curriculum-path";

export type MasteryPolicy = {
  minAttempts: number;
  minAccuracy: number;
  maxHintsPerAttempt: number;
};

const POLICIES: Record<Extract<CurriculumNodeKind, "guided_practice" | "independent_practice" | "mastery">, MasteryPolicy> = {
  guided_practice: { minAttempts: 3, minAccuracy: 0.6, maxHintsPerAttempt: 2 },
  independent_practice: { minAttempts: 3, minAccuracy: 0.8, maxHintsPerAttempt: 1 },
  mastery: { minAttempts: 3, minAccuracy: 0.9, maxHintsPerAttempt: 0.5 },
};

export function getMasteryPolicy(kind: CurriculumNodeKind): MasteryPolicy | null {
  if (!(kind in POLICIES)) return null;
  return POLICIES[kind as keyof typeof POLICIES];
}

/**
 * Mastery is measured from completed learning sessions, not individual
 * questions. Remediation sessions can reset a learner's support state, but
 * they do not count toward mastery attempts.
 */
export function getMasteryEvidence(results: ActivityResult[], nodeId: string) {
  return results.filter(
    (result) => result.curriculumNodeId === nodeId
      && result.isSessionSummary === true
      && result.isRemediation !== true
  );
}

export function meetsMasteryThreshold(results: ActivityResult[], nodeId: string, kind: CurriculumNodeKind): boolean {
  const policy = getMasteryPolicy(kind);
  if (!policy) return false;

  const evidence = getMasteryEvidence(results, nodeId);
  if (evidence.length < policy.minAttempts) return false;

  const accuracy = evidence.filter((result) => result.correct === true).length / evidence.length;
  const hintsPerAttempt = evidence.reduce((sum, result) => sum + result.hintsUsed, 0) / evidence.length;

  return accuracy >= policy.minAccuracy && hintsPerAttempt <= policy.maxHintsPerAttempt;
}

export function getMasteryProgress(results: ActivityResult[], nodeId: string, kind: CurriculumNodeKind) {
  const policy = getMasteryPolicy(kind);
  if (!policy) return { attempts: 0, accuracy: 0, hintsPerAttempt: 0, complete: false, requiredAttempts: 0, requiredAccuracy: 0 };

  const evidence = getMasteryEvidence(results, nodeId);
  const attempts = evidence.length;
  const accuracy = attempts ? evidence.filter((result) => result.correct === true).length / attempts : 0;
  const hintsPerAttempt = attempts ? evidence.reduce((sum, result) => sum + result.hintsUsed, 0) / attempts : 0;

  return {
    attempts,
    accuracy,
    hintsPerAttempt,
    complete: meetsMasteryThreshold(results, nodeId, kind),
    requiredAttempts: policy.minAttempts,
    requiredAccuracy: policy.minAccuracy,
  };
}
