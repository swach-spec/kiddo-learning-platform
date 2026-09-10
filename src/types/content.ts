// Content-layer types for KIDDO learning material.
//
// These describe *what* a learner can do (a Story, its scenes, its
// questions) as opposed to player/persistence types, which live in
// src/lib/kiddo.ts and src/types/activity.ts.

export type Subject = "english" | "mathematics";

export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type GradeBand =
  | "kindergarten"
  | "lower_primary"
  | "upper_primary"
  | "grade_4_5"
  | "grade_6";

// Skills an activity/question can exercise. A question may target more
// than one skill, so Question.skills is always an array.
export type Skill =
  | "reading_comprehension"
  | "vocabulary"
  | "spelling"
  | "grammar"
  | "sentence_construction"
  | "writing"
  | "number_sense"
  | "addition_subtraction"
  | "multiplication_division"
  | "fractions_decimals"
  | "measurement_geometry"
  | "problem_solving";

export type PartOfSpeech = "adjective" | "noun" | "verb";

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string;
  skills: Skill[];
  word?: string;
  partOfSpeech?: PartOfSpeech;
  xp: number;
  difficulty?: 1 | 2 | 3;
};

export type StoryScene = {
  id: string;
  text: string;
  illustration: string;
};

export type Story = {
  id: string;
  legacyId?: number;
  title: string;
  description: string;
  subject: Subject;
  grade: Grade;
  gradeBand: GradeBand;
  levelLabel: string;
  icon: string;
  gradient: string;
  estimatedMinutes: number;
  xp: number;
  unlocksAtLevel: number;
  status: "ready" | "coming_soon";
  scenes: StoryScene[];
  questions: Question[];
};
