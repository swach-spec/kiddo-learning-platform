import { GRADE_ENTRY_TIERS, GAME_TIERS } from "@/content/game-progression";
import { GameProgress, GameTierId } from "@/types/game-progress";

const STORAGE_KEY = "kiddo-game-progress";

function getTierIndex(tier: GameTierId) {
  return GAME_TIERS.findIndex((item) => item.id === tier);
}

function getGradeNumber(grade: string) {
  const match = grade.match(/(\d+)/);
  const parsed = match ? Number(match[1]) : 1;
  return Math.min(6, Math.max(1, parsed));
}

export function getGameEntryTier(grade: string): GameTierId {
  return GRADE_ENTRY_TIERS[getGradeNumber(grade)] ?? "novice";
}

export function getGameProgress(
  playerId: string,
  gameId: string,
  grade: string
): GameProgress {
  if (typeof window === "undefined") {
    const entryTier = getGameEntryTier(grade);
    return {
      gameId,
      playerId,
      gradeEntry: getGradeNumber(grade),
      currentTier: entryTier,
      wins: 0,
      losses: 0,
      attempts: 0,
      masteryScore: 0,
      highestTier: entryTier,
    };
  }

  const all = readProgress();
  const existing = all.find(
    (item) => item.playerId === playerId && item.gameId === gameId
  );

  const entryTier = getGameEntryTier(grade);
  if (!existing) {
    return {
      gameId,
      playerId,
      gradeEntry: getGradeNumber(grade),
      currentTier: entryTier,
      wins: 0,
      losses: 0,
      attempts: 0,
      masteryScore: 0,
      highestTier: entryTier,
    };
  }

  const minimumTierIndex = getTierIndex(entryTier);
  const currentTierIndex = Math.max(
    minimumTierIndex,
    getTierIndex(existing.currentTier)
  );
  const highestTierIndex = Math.max(
    minimumTierIndex,
    getTierIndex(existing.highestTier)
  );

  return {
    ...existing,
    gradeEntry: getGradeNumber(grade),
    currentTier: GAME_TIERS[currentTierIndex]?.id ?? entryTier,
    highestTier: GAME_TIERS[highestTierIndex]?.id ?? entryTier,
  };
}

export function recordGameResult(
  playerId: string,
  gameId: string,
  grade: string,
  result: "won" | "lost"
): GameProgress {
  const progress = getGameProgress(playerId, gameId, grade);
  const wins = progress.wins + (result === "won" ? 1 : 0);
  const losses = progress.losses + (result === "lost" ? 1 : 0);
  const attempts = wins + losses;

  const entryTier = getGameEntryTier(grade);
  const entryTierIndex = getTierIndex(entryTier);
  let unlockedIndex = entryTierIndex;

  for (let index = 0; index < GAME_TIERS.length; index += 1) {
    if (wins >= GAME_TIERS[index].unlockWins) {
      unlockedIndex = Math.max(unlockedIndex, index);
    }
  }

  const currentTier = GAME_TIERS[unlockedIndex]?.id ?? entryTier;
  const highestIndex = Math.max(
    getTierIndex(progress.highestTier),
    unlockedIndex
  );
  const highestTier = GAME_TIERS[highestIndex]?.id ?? currentTier;
  const masteryScore = attempts === 0 ? 0 : Math.round((wins / attempts) * 100);

  const next: GameProgress = {
    gameId,
    playerId,
    gradeEntry: getGradeNumber(grade),
    currentTier,
    wins,
    losses,
    attempts,
    masteryScore,
    highestTier,
  };

  writeProgress(
    readProgress().filter(
      (item) => !(item.playerId === playerId && item.gameId === gameId)
    ).concat(next)
  );

  return next;
}

export function getNextGameTier(progress: GameProgress) {
  const currentIndex = getTierIndex(progress.currentTier);
  return GAME_TIERS[currentIndex + 1] ?? null;
}

export function getGameTiers() {
  return GAME_TIERS;
}

function readProgress(): GameProgress[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProgress(progress: GameProgress[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Keep the game playable if browser storage is unavailable.
  }
}
