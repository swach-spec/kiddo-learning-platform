import { ActivityResult } from "@/types/activity";
import { Grade, Skill } from "@/types/content";
import { MATHEMATICS_CURRICULUM, MathCurriculumNode } from "@/content/curriculum/mathematics";

export type MathLearningContext = {
  curriculumId?: string;
  strand?: string;
  subStrand?: string;
  concept: string;
};

const SKILL_CONTEXT: Record<Skill, { strand: string; subStrandHints: string[]; concept: string }> = {
  number_sense: { strand: "Numbers", subStrandHints: ["Whole Numbers", "Number Concept", "Number Activities"], concept: "Number sense" },
  addition_subtraction: { strand: "Numbers", subStrandHints: ["Addition", "Subtraction"], concept: "Addition and subtraction" },
  multiplication_division: { strand: "Numbers", subStrandHints: ["Multiplication", "Division", "Whole Numbers"], concept: "Multiplication and division" },
  fractions_decimals: { strand: "Numbers", subStrandHints: ["Fractions", "Decimals"], concept: "Fractions and decimals" },
  measurement_geometry: { strand: "Measurement", subStrandHints: ["Length", "Area", "Volume", "Capacity", "Mass", "Time", "Money"], concept: "Measurement and geometry" },
  problem_solving: { strand: "Numbers", subStrandHints: ["Whole Numbers", "Addition", "Subtraction", "Multiplication", "Division", "Fractions"], concept: "Mathematical problem solving" },
  vocabulary: { strand: "Numbers", subStrandHints: ["Whole Numbers"], concept: "Mathematical vocabulary" },
  reading_comprehension: { strand: "Numbers", subStrandHints: ["Whole Numbers"], concept: "Reading mathematical information" },
  spelling: { strand: "Numbers", subStrandHints: ["Whole Numbers"], concept: "Mathematical notation" },
  grammar: { strand: "Numbers", subStrandHints: ["Whole Numbers"], concept: "Mathematical language" },
  sentence_construction: { strand: "Numbers", subStrandHints: ["Whole Numbers"], concept: "Mathematical statements" },
  writing: { strand: "Numbers", subStrandHints: ["Whole Numbers"], concept: "Mathematical notation" },
};

function gradeNumber(grade: Grade): number {
  return Number(String(grade).replace(/\D/g, "")) || 1;
}

export function getMathLearningContext(grade: Grade, skill: Skill): MathLearningContext {
  const config = SKILL_CONTEXT[skill] ?? SKILL_CONTEXT.problem_solving;
  const gradeValue = gradeNumber(grade);
  const candidates = MATHEMATICS_CURRICULUM.filter(
    (node) => node.grade === gradeValue && node.strandName === config.strand,
  );
  const node = candidates.find((candidate) =>
    config.subStrandHints.some((hint) => candidate.subStrand.toLowerCase().includes(hint.toLowerCase())),
  );
  if (!node) return { concept: config.concept };
  return {
    curriculumId: node.id,
    strand: node.strandName,
    subStrand: node.subStrand,
    concept: config.concept,
  };
}

export type MathSkillInsight = {
  concept: string;
  attempts: number;
  correct: number;
  accuracy: number;
  averageResponseTimeMs: number | null;
  mastery: "emerging" | "developing" | "secure";
};

export function getMathSkillInsights(results: ActivityResult[]): MathSkillInsight[] {
  const mathResults = results.filter(
    (result) => result.activityType === "practice_challenge" && Boolean(result.curriculumId || result.strand),
  );
  const groups = new Map<string, ActivityResult[]>();
  for (const result of mathResults) {
    const key = result.concept ?? result.skills[0] ?? "mathematics";
    const group = groups.get(key) ?? [];
    group.push(result);
    groups.set(key, group);
  }
  return Array.from(groups.entries()).map(([concept, group]) => {
    const correct = group.filter((result) => result.correct === true).length;
    const responseTimes = group.map((result) => result.responseTimeMs).filter((value): value is number => typeof value === "number");
    const accuracy = group.length ? Math.round((correct / group.length) * 100) : 0;
    return {
      concept,
      attempts: group.length,
      correct,
      accuracy,
      averageResponseTimeMs: responseTimes.length ? Math.round(responseTimes.reduce((sum, value) => sum + value, 0) / responseTimes.length) : null,
      mastery: accuracy >= 80 ? "secure" : accuracy >= 50 ? "developing" : "emerging",
    };
  });
}

export function getNextMathRecommendation(results: ActivityResult[]): string | null {
  const insights = getMathSkillInsights(results);
  if (!insights.length) return null;
  const weakest = [...insights].sort((a, b) => a.accuracy - b.accuracy)[0];
  return weakest.accuracy < 80 ? `Practise ${weakest.concept}` : "Try a new mathematics challenge";
}

export function findCurriculumNode(curriculumId?: string): MathCurriculumNode | null {
  if (!curriculumId) return null;
  return MATHEMATICS_CURRICULUM.find((node) => node.id === curriculumId) ?? null;
}
