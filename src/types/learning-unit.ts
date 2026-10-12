import { Challenge } from "@/types/challenge";
import { Grade, Skill, Subject } from "@/types/content";
import { Lesson } from "@/types/lesson";

/**
 * The stages of one learning unit, following the KIDDO journey:
 * Discover (lesson) → Try together (guided) → Try independently →
 * Use it (apply, plus an optional reading adventure) → Mastery.
 * `support` is the side quest offered when evidence shows a struggle.
 */
export type UnitStage = "guided" | "independent" | "apply" | "mastery" | "support";

export const UNIT_STAGES: UnitStage[] = ["guided", "independent", "apply", "mastery", "support"];

/** Where a learning outcome came from, so content can be audited against KICD. */
export type CurriculumSource = {
  /** e.g. "KICD Grade 3 Mathematical Activities design" */
  document: string;
  /** Sub-strand number and name as printed in the design, e.g. "1.3 Addition". */
  subStrand: string;
  /** Set to false while the outcome is awaiting confirmation against the official design. */
  verified: boolean;
};

/**
 * A curriculum-aligned learning unit authored as data. One unit expands into
 * several learning-path steps (see `buildUnitNodes`) and every page in the app
 * runs it without unit-specific code.
 */
export type LearningUnit = {
  /** Stable id, e.g. "g3-math-place-value". Never rename once learners have progress. */
  id: string;
  grade: Grade;
  subject: Subject;
  strand: string;
  subStrand: string;
  concept: string;
  /** The CBC specific learning outcome(s) this unit evidences, in plain words. */
  objectives: string[];
  source: CurriculumSource;
  title: string;
  description: string;
  icon: string;
  skill: Skill;
  lesson: Lesson;
  banks: Record<UnitStage, Challenge[]>;
  /** Optional reading adventure used as the "Use it" step for English units. */
  storyId?: string;
};
