// Content-layer types for KIDDO learning material.
//
// These describe *what* a learner can do (a Story, its scenes, its
// questions) as opposed to player/persistence types, which live in
// src/lib/kiddo.ts and src/types/activity.ts.

// Only English exists today. The union is written so adding a subject
// later (kiswahili, mathematics, science, social_studies) is a type
// change in one place, not a rewrite.
export type Subject = "english";

// Grade is the specific school grade (1-6). GradeBand is the coarser
// grouping used for navigation/unlocking, matching the long-term
// KIDDO structure (Kindergarten, Lower Primary 1-3, Grade 4-5, Grade 6).
export type Grade = 1 | 2 | 3 | 4 | 5 | 6;

export type GradeBand =
  | "kindergarten"
  | "lower_primary"
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
  | "writing";

// Parts of speech currently supported by the vocabulary foundation.
// Keeping this as a closed union makes new categories an explicit
// content-model decision rather than an untyped string scattered through
// questions and challenges.
export type PartOfSpeech = "adjective" | "noun" | "verb";

export type QuestionOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  prompt: string;
  options: QuestionOption[];
  /** Must match the id of one entry in `options`. */
  correctOptionId: string;
  explanation: string;
  skills: Skill[];
  /** The explicit vocabulary word this question teaches, when verified. */
  word?: string;
  /** Present only when `word` has verified part-of-speech metadata. */
  partOfSpeech?: PartOfSpeech;
  /** XP awarded for a correct answer on first attempt. */
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
  /**
   * Legacy numeric id from the original prototype (story/page.tsx used
   * `/story/${numericId}` links). Preserved so old bookmarks/links keep
   * resolving to the same content under the new string `id` scheme.
   * NOT VERIFIED FROM REPOSITORY beyond the 4 ids HEAD's catalogue used
   * (1-4) — there is no evidence any numeric id outside that range was
   * ever valid.
   */
  legacyId?: number;
  title: string;
  description: string;
  subject: Subject;
  grade: Grade;
  gradeBand: GradeBand;
  /**
   * The exact reading-level label from the original catalogue (e.g.
   * "Level 2"). Kept verbatim for display so the card badge doesn't
   * show an invented value — separate from the structural `grade`
   * field above, which is Phase 1's own typed mapping and was not
   * present in the original data.
   */
  levelLabel: string;
  icon: string;
  /** Tailwind gradient stop classes, e.g. "from-sky-400 to-blue-600". */
  gradient: string;
  estimatedMinutes: number;
  /** Headline XP shown on the story card (sum of question XP, when ready). */
  xp: number;
  /** Player level required to unlock this story. 1 = always unlocked. */
  unlocksAtLevel: number;
  /**
   * "ready" stories have real, provenance-checked scenes/questions and
   * are playable. "coming_soon" stories exist in the catalogue (title,
   * description, icon, xp, etc. are real) but have no verified reading
   * or quiz content yet — scenes/questions MUST be empty arrays, and
   * nothing should render them as playable.
   */
  status: "ready" | "coming_soon";
  scenes: StoryScene[];
  questions: Question[];
};
