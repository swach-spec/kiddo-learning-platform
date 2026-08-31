import { Skill } from "@/types/content";

// What kind of step this is in the day's sequence. Phase 2 only ever
// has real content for "reading" (the Lost Kite story + its built-in
// comprehension quiz) — "practice" and "challenge" exist as named
// stages in the model because the product vision calls for them, but
// the repository currently has no content or mechanism to back them,
// so they are always represented as coming_soon (see lib/adventure.ts).
export type AdventureStepType = "reading" | "practice" | "challenge" | "reward";

// "completed": derived from persisted player/activity state.
// "available": the learner can act on this step right now.
// "coming_soon": no verified content/mechanism exists for this step yet
//   — never used to hide something that IS available, only to honestly
//   represent something that genuinely isn't there.
export type AdventureStepStatus = "completed" | "available" | "coming_soon";

export type AdventureStep = {
  id: string;
  type: AdventureStepType;
  title: string;
  description: string;
  status: AdventureStepStatus;
  /** Present when this step links into an existing story (e.g. "reading"). */
  storyId?: string;
  /** Present when this step links to a compatible vocabulary challenge. */
  challengeId?: string;
  /** Skills this step exercises, when known from real content metadata. */
  skills?: Skill[];
  /**
   * XP tied to this step. Always a real, already-persisted amount read
   * back from the activity log — never a projected/fabricated value,
   * and never itself a trigger that awards XP.
   */
  xp?: number;
};

export type TodayAdventure = {
  playerId: string;
  steps: AdventureStep[];
  /**
   * Distinct skills actually exercised so far, derived from the
   * player's recorded ActivityResults. Not scoped to a calendar day —
   * there is no day-boundary concept anywhere in the current
   * persistence model (see lib/adventure.ts for the full caveat).
   */
  skillsExercised: Skill[];
};
