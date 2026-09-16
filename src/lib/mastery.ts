import { ActivityResult } from "@/types/activity";
import { CurriculumNodeKind } from "@/types/curriculum-path";
export type MasteryPolicy = { minAccuracy: number; maxHintsPerAttempt: number };
const POLICIES: Record<Extract<CurriculumNodeKind, "guided_practice" | "independent_practice" | "mastery">, MasteryPolicy> = {
  guided_practice: { minAccuracy: .6, maxHintsPerAttempt: 2 }, independent_practice: { minAccuracy: .8, maxHintsPerAttempt: 1 }, mastery: { minAccuracy: .9, maxHintsPerAttempt: .5 },
};
export function getMasteryPolicy(kind: CurriculumNodeKind): MasteryPolicy | null { return kind in POLICIES ? POLICIES[kind as keyof typeof POLICIES] : null; }
/** Session summaries are stage evidence. Repeating the same quiz does not itself create whole-skill mastery. */
export function getMasteryEvidence(results: ActivityResult[], nodeId: string) { return results.filter((result) => result.curriculumNodeId === nodeId && result.isSessionSummary === true && result.isRemediation !== true); }
export function meetsMasteryThreshold(results: ActivityResult[], nodeId: string, kind: CurriculumNodeKind): boolean { const policy=getMasteryPolicy(kind); const latest=getMasteryEvidence(results,nodeId).at(-1); return Boolean(policy && latest?.score !== undefined && latest.totalQuestions && latest.score/latest.totalQuestions >= policy.minAccuracy && latest.hintsUsed <= policy.maxHintsPerAttempt); }
export function getMasteryProgress(results: ActivityResult[], nodeId: string, kind: CurriculumNodeKind) { const policy=getMasteryPolicy(kind); const evidence=getMasteryEvidence(results,nodeId); const latest=evidence.at(-1); return { attempts:evidence.length, accuracy:latest?.score !== undefined && latest.totalQuestions ? latest.score/latest.totalQuestions : 0, hintsPerAttempt:latest?.hintsUsed ?? 0, complete:meetsMasteryThreshold(results,nodeId,kind), requiredAttempts:1, requiredAccuracy:policy?.minAccuracy ?? 0 }; }