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

  /** Subject this challenge belongs to. */
  subject: Subject;

  /** School grade this challenge targets. */
  grade: Grade;

  /** Learning skill being practiced. */
  skill: Skill;

  /** Present for English vocabulary challenges; not applicable to other subjects. */
  partOfSpeech?: PartOfSpeech;

  /** Human-readable challenge prompt. */
  prompt: string;

  /** Available answer choices. */
  options: QuestionOption[];

  /** Must match the id of one entry in `options`. */
  correctOptionId: string;

  /** Explanation shown after the learner answers. */
  explanation: string;

  /** XP earned for a correct answer on first attempt. */
  xp: number;

  difficulty?: 1 | 2 | 3;
};