import { Challenge } from "@/types/challenge";
import { Grade, Skill, Subject } from "@/types/content";
import { UnitStage } from "@/types/learning-unit";
import { Working } from "@/types/working";

/** Shared curriculum coordinates for every question in one unit. */
export type UnitMeta = {
  unitId: string;
  grade: Grade;
  subject: Subject;
  skill: Skill;
  strand: string;
  subStrand: string;
  concept: string;
};

const ACTIVITY_TYPE: Record<UnitStage, string> = {
  guided: "guided_practice",
  independent: "independent_practice",
  apply: "use_it",
  mastery: "mastery",
  support: "support",
};

const DIFFICULTY: Record<UnitStage, 1 | 2 | 3> = { support: 1, guided: 1, independent: 2, apply: 2, mastery: 3 };
const XP: Record<UnitStage, number> = { support: 5, guided: 10, independent: 10, apply: 10, mastery: 15 };

/** A question as authored: the correct answer is always written FIRST; the session shuffles options. */
export type Q = { prompt: string; answer: string; wrong: string[]; why: string; working?: Working };

/**
 * Turns authored questions into Challenges with stable ids
 * (`<unitId>--<stage>-<n>`). Ids are positional, so append new questions at
 * the end of a bank rather than inserting them, to keep learners' history valid.
 */
export function bank(meta: UnitMeta, stage: UnitStage, questions: Q[]): Challenge[] {
  return questions.map((question, index) => {
    const texts = [question.answer, ...question.wrong];
    return {
      id: `${meta.unitId}--${stage}-${index + 1}`,
      subject: meta.subject,
      grade: meta.grade,
      skill: meta.skill,
      prompt: question.prompt,
      options: texts.map((text, optionIndex) => ({ id: String.fromCharCode(97 + optionIndex), text })),
      correctOptionId: "a",
      explanation: question.why,
      xp: XP[stage],
      difficulty: DIFFICULTY[stage],
      curriculumId: meta.unitId,
      strand: meta.strand,
      subStrand: meta.subStrand,
      concept: meta.concept,
      activityType: ACTIVITY_TYPE[stage],
      ...(question.working ? { working: question.working } : {}),
    };
  });
}

/** Formats a number the way Kenyan textbooks print it: 12,450. */
export function fmt(value: number): string {
  return value.toLocaleString("en-US");
}

/** Formats shillings: "sh. 1,250". */
export function sh(value: number): string {
  return `sh. ${fmt(value)}`;
}

/**
 * Picks up to `count` distractors that differ from the answer and from each
 * other, in the order given. Used by generated maths questions so wrong
 * options are plausible mistakes rather than random numbers.
 */
export function distinct(answer: string, candidates: string[], count = 3): string[] {
  const out: string[] = [];
  for (const candidate of candidates) {
    if (candidate !== answer && !out.includes(candidate)) out.push(candidate);
    if (out.length === count) break;
  }
  return out;
}
