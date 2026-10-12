import { Challenge } from "@/types/challenge";
import { LearningUnit, UnitStage } from "@/types/learning-unit";
import { g3EngSubjectVerbAgreement } from "@/content/units/grade-3/english-subject-verb-agreement";
import { g3EngIrregularPlurals } from "@/content/units/grade-3/english-irregular-plurals";
import { g3EngButBecause } from "@/content/units/grade-3/english-conjunctions";
import { g3MathPlaceValue } from "@/content/units/grade-3/math-place-value";
import { g3MathAddSubtract } from "@/content/units/grade-3/math-add-subtract";
import { g3MathMoney } from "@/content/units/grade-3/math-money";
import { g6EngAdverbs } from "@/content/units/grade-6/english-adverbs";
import { g6EngReportedSpeech } from "@/content/units/grade-6/english-reported-speech";
import { g6EngLinkingWords } from "@/content/units/grade-6/english-linking-words";
import { g6MathWholeNumbers } from "@/content/units/grade-6/math-whole-numbers";
import { g6MathFractions } from "@/content/units/grade-6/math-fractions";
import { g6MathDecimals } from "@/content/units/grade-6/math-decimals";

/**
 * Every published learning unit, in curriculum order within each grade and
 * subject. The learning path is built from this list; adding a unit here is
 * all it takes to put it in front of learners.
 */
export const LEARNING_UNITS: LearningUnit[] = [
  // Grade 3 — pilot grade
  g3EngSubjectVerbAgreement,
  g3EngIrregularPlurals,
  g3EngButBecause,
  g3MathPlaceValue,
  g3MathAddSubtract,
  g3MathMoney,
  // Grade 6 — pilot grade (English outcomes awaiting confirmation against the KICD design)
  g6EngAdverbs,
  g6EngReportedSpeech,
  g6EngLinkingWords,
  g6MathWholeNumbers,
  g6MathFractions,
  g6MathDecimals,
];

export function getUnitsForGrade(grade: number): LearningUnit[] {
  return LEARNING_UNITS.filter((unit) => unit.grade === grade);
}

export function getUnit(unitId: string): LearningUnit | undefined {
  return LEARNING_UNITS.find((unit) => unit.id === unitId);
}

export function getUnitBank(unitId: string, stage: UnitStage): Challenge[] {
  return getUnit(unitId)?.banks[stage] ?? [];
}

/** All unit questions, so a single question can be looked up by id. */
export function getAllUnitChallenges(): Challenge[] {
  return LEARNING_UNITS.flatMap((unit) => Object.values(unit.banks).flat());
}
