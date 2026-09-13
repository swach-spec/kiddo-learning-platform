import { getLevelFromXP, Player } from "@/lib/kiddo";
import { ActivityResult } from "@/types/activity";
import { getRepositories } from "@/data/repositories";
import { ActivityProgressState } from "@/data/repositories/types";

/**
 * Compatibility facade for the existing UI.
 *
 * New code should use repositories directly. Keeping these functions means
 * current screens can migrate incrementally without a large-bang rewrite.
 */
const repositories = getRepositories();

/** Re-exported for legacy consumers while ActivityResult moves to data layer. */
export type { ActivityResult } from "@/types/activity";

export type LearnerProgress = {
  currentSubject?: "english" | "mathematics";
  currentCurriculumNodeId?: string;
  currentLearningUnitId?: string;
  currentActivityId?: string;
  learningState?: "secure" | "developing" | "needs_support";
  progressPercent?: number;
  lastActivityId?: string;
  updatedAt?: string;
};

/** Returns only the explorers owned by the currently signed-in family. */
export function getPlayers(): Player[] {
  return repositories.learners.getLearners();
}

export function getCurrentPlayer(): Player | null {
  return repositories.learners.getCurrentLearner();
}

export function setCurrentPlayer(player: Player) {
  repositories.learners.setCurrentLearner(player);
}

export function updatePlayer(playerId: string, updates: Partial<Player>): Player | null {
  return repositories.learners.updateLearner(playerId, updates);
}

export function awardXP(playerId: string, amount: number): Player | null {
  const player = repositories.learners.getLearner(playerId);
  if (!player) return null;

  const nextXP = player.xp + amount;
  return repositories.learners.updateLearner(playerId, {
    xp: nextXP,
    level: getLevelFromXP(nextXP),
  });
}

export function markStoryCompleted(playerId: string, storyId: string): Player | null {
  const player = repositories.learners.getLearner(playerId);
  if (!player) return null;
  if (player.completedStoryIds.includes(storyId)) return player;

  return repositories.learners.updateLearner(playerId, {
    completedStoryIds: [...player.completedStoryIds, storyId],
    storiesCompleted: player.storiesCompleted + 1,
  });
}

export function recordActivityResult(result: ActivityResult) {
  repositories.activities.recordResult(result);

  const now = new Date().toISOString();
  const previous = repositories.progress.getActivityProgress(result.playerId, result.activityId);
  const completionCount = (previous?.completionCount ?? 0) + (result.correct === true ? 1 : 0);
  const accuracy = result.correct === null
    ? previous?.accuracy
    : result.correct
      ? 1
      : 0;

  const activityProgress: ActivityProgressState = {
    activityId: result.activityId,
    status: result.correct === true ? "completed" : "in_progress",
    completionCount,
    bestScore: Math.max(previous?.bestScore ?? 0, result.correct === true ? 1 : 0),
    accuracy,
    firstStartedAt: previous?.firstStartedAt ?? result.timestamp,
    lastStartedAt: now,
    lastCompletedAt: result.correct === true ? now : previous?.lastCompletedAt,
  };

  repositories.progress.saveActivityProgress(result.playerId, activityProgress);

  const subject: LearnerProgress["currentSubject"] =
    result.activityType === "story_reading" || result.skills.includes("grammar") || result.skills.includes("reading_comprehension")
      ? "english"
      : "mathematics";

  const existing = repositories.progress.getLearnerProgress(result.playerId) as LearnerProgress | null;
  repositories.progress.saveLearnerProgress(result.playerId, {
    ...existing,
    currentSubject: subject,
    currentActivityId: result.activityId,
    lastActivityId: result.activityId,
    updatedAt: now,
  });
}

export function getActivityResults(playerId: string): ActivityResult[] {
  return repositories.activities.getResults(playerId);
}

/**
 * Persist the learner's current position separately from identity and XP.
 * This mirrors the production learner_progress entity without changing the
 * existing Player shape or localStorage compatibility keys.
 */
export function getLearnerProgress(playerId: string): LearnerProgress | null {
  return repositories.progress.getLearnerProgress(playerId) as LearnerProgress | null;
}

export function saveLearnerProgress(playerId: string, progress: LearnerProgress) {
  repositories.progress.saveLearnerProgress(playerId, {
    ...progress,
    updatedAt: progress.updatedAt ?? new Date().toISOString(),
  });
}

export function updateLearnerPosition(
  playerId: string,
  position: Pick<LearnerProgress, "currentSubject" | "currentCurriculumNodeId" | "currentLearningUnitId" | "currentActivityId">,
) {
  const existing = getLearnerProgress(playerId) ?? {};
  saveLearnerProgress(playerId, { ...existing, ...position });
}

export function getActivityProgress(playerId: string, activityId: string): ActivityProgressState | null {
  return repositories.progress.getActivityProgress(playerId, activityId);
}
