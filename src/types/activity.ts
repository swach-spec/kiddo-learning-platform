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
  activityId: string;
  storyId?: string;
  skills: Skill[];
  curriculumId?: string;
  strand?: string;
  subStrand?: string;
  concept?: string;
  responseTimeMs?: number;
  correct: boolean | null;
  attempts: number;
  hintsUsed: number;
  difficulty?: 1 | 2 | 3;
  xpAwarded: number;
  timestamp: string;
};
