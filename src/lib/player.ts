import { getLevelFromXP, Player } from "@/lib/kiddo";
import { ActivityResult } from "@/types/activity";
import { getRepositories } from "@/data/repositories";

/**
 * Compatibility facade for the existing UI.
 *
 * New code should use repositories directly. Keeping these functions means
 * current screens can migrate incrementally without a large-bang rewrite.
 */
const repositories = getRepositories();

/** Re-exported for legacy consumers while ActivityResult moves to the data layer. */
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
