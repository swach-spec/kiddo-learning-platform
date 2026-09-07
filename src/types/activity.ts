import { Skill } from "@/types/content";

export type ActivityType =
  | "story_reading"
  | "story_question"
  | "practice_challenge"
  | "memory_match"
  | "checkers";

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
