import { CurriculumNode } from "@/types/curriculum-path";
import { LearningUnit } from "@/types/learning-unit";
import { getEnglishPath } from "@/content/curriculum/english-path";
import { getUnitsForGrade } from "@/content/units";
import { buildUnitNodes } from "@/lib/unit-path";

/**
 * Orders a grade's units into one journey, alternating subjects
 * (English 1, Maths 1, English 2, Maths 2, …) so a daily session mixes both
 * while each subject still follows its own curriculum order.
 */
function interleave(units: LearningUnit[]): LearningUnit[] {
  const english = units.filter((unit) => unit.subject === "english");
  const maths = units.filter((unit) => unit.subject === "mathematics");
  const ordered: LearningUnit[] = [];
  for (let index = 0; index < Math.max(english.length, maths.length); index += 1) {
    if (english[index]) ordered.push(english[index]);
    if (maths[index]) ordered.push(maths[index]);
  }
  return ordered;
}

/**
 * The single learning path for a grade: what KIDDO uses to decide the
 * learner's next step. Grades with authored units use them; Grade 2 keeps its
 * original Describing Words path (existing learners' progress is keyed to it)
 * followed by any Grade 2 units; grades without units fall back to the
 * original starter path.
 */
export function getLearningPath(grade: number): CurriculumNode[] {
  const units = interleave(getUnitsForGrade(grade));
  const unitNodes = units.flatMap(buildUnitNodes);
  if (grade === 2) return [...getEnglishPath(2), ...unitNodes];
  return unitNodes.length ? unitNodes : getEnglishPath(grade);
}

/** Finds a step anywhere in the grade's path. */
export function findPathNode(grade: number, nodeId: string): CurriculumNode | undefined {
  return getLearningPath(grade).find((node) => node.id === nodeId);
}
