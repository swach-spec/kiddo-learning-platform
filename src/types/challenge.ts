import {
  Grade,
  PartOfSpeech,
  QuestionOption,
  Skill,
  Subject,
} from "@/types/content";

/**
 * A standalone learning challenge.
 *
 * Challenges are deliberately separate from Story questions so KIDDO can
 * support independent practice across subjects without coupling the
 * challenge engine to the Story catalogue.
 */
export type Challenge = {
  id: string;
  subject: Subject;
  grade: Grade;
  skill: Skill;
  partOfSpeech?: PartOfSpeech;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  xp: number;
  difficulty?: 1 | 2 | 3;

  /** Optional curriculum coordinates used by KIDDO's learning-intelligence layer. */
  curriculumId?: string;
  strand?: string;
  subStrand?: string;
  concept?: string;
  activityType?: string;
};