import { Player } from "@/lib/kiddo";
import { ActivityResult } from "@/types/activity";

export type LearnerRepository = {
  getLearners(): Player[];
  getLearner(playerId: string): Player | null;
  getCurrentLearner(): Player | null;
  setCurrentLearner(player: Player): void;
  createLearner(player: Player): Player;
  updateLearner(playerId: string, updates: Partial<Player>): Player | null;
};

export type ActivityRepository = {
  recordResult(result: ActivityResult): void;
  getResults(playerId: string): ActivityResult[];
  getResultsForActivity(playerId: string, activityId: string): ActivityResult[];
};

export type ProgressRepository = {
  getLearnerProgress(playerId: string): Record<string, unknown> | null;
  saveLearnerProgress(playerId: string, progress: Record<string, unknown>): void;
};

export type RevisionRepository = {
  getRevisionItems(playerId: string): Record<string, unknown>[];
  saveRevisionItems(playerId: string, items: Record<string, unknown>[]): void;
};

export type AnalyticsRepository = {
  recordEvent(event: AnalyticsEvent): void;
};

export type AnalyticsEvent = {
  eventType: string;
  entityType?: string;
  entityId?: string;
  childId?: string;
  familyId?: string;
  sessionId?: string;
  occurredAt?: string;
  metadata?: Record<string, unknown>;
};

export type KiddoRepositories = {
  learners: LearnerRepository;
  activities: ActivityRepository;
  progress: ProgressRepository;
  revision: RevisionRepository;
  analytics: AnalyticsRepository;
};
