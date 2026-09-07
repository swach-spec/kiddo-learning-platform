import { Skill } from "@/types/content";

// The kind of activity an ActivityResult was generated from. Kept
// intentionally small for Phase 1 — new activity types (games,
// puzzles, spelling drills) can extend this union later without
// touching the shape of ActivityResult itself.
export type ActivityType =
  | "story_reading"
  | "story_question"
  | "practice_challenge"
  | "memory_match";
// A single recorded attempt at an activity. This is the foundational
// event KIDDO's future adaptive engine, mastery model and parent
// analytics will all read from — so every field here should be
// something we can capture honestly today, even before anything
// consumes it.
export type ActivityResult = {
  id: string;
  playerId: string;
  activityType: ActivityType;
  /** id of the story, question, or other content item attempted. */
  activityId: string;
  /** id of the parent story, when activityId refers to a question. */
  storyId?: string;
  skills: Skill[];
  /** null for non-graded activities (e.g. finishing a reading page). */
  correct: boolean | null;
  attempts: number;
  hintsUsed: number;
  difficulty?: 1 | 2 | 3;
  xpAwarded: number;
  timestamp: string;
};
