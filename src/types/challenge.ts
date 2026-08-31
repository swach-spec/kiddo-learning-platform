import { PartOfSpeech, QuestionOption, Skill } from "@/types/content";

// Isolated vocabulary-practice content. These challenges are deliberately
// distinct from Story questions and are not part of the Story catalogue.
export type VocabularyChallenge = {
  id: string;
  label: "demo_foundation";
  skill: Skill;
  partOfSpeech: PartOfSpeech;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  /** XP earned only for this challenge, never as story-question XP. */
  xp: number;
  difficulty?: 1 | 2 | 3;
};
