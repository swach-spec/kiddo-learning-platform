import { DEFAULT_GRADE_ENTRY_TIERS, GAME_GRADE_ENTRY_TIERS, GAME_TIERS } from "@/content/game-progression";
import { GameProgress, GameTierId, TierStats } from "@/types/game-progress";
import { recordActivityCompletion } from "@/lib/activity-balance";

const STORAGE_KEY = "kiddo-game-progress";

function getTierIndex(tier: GameTierId) { return GAME_TIERS.findIndex((item) => item.id === tier); }
function getGradeNumber(grade: string) { const match = grade.match(/(\d+)/); const parsed = match ? Number(match[1]) : 1; return Math.min(6, Math.max(1, parsed)); }
function emptyTierStats(): TierStats { return { wins: 0, losses: 0, attempts: 0, masteryScore: 0 }; }

function normalizeTierStats(value: unknown): Partial<Record<GameTierId, TierStats>> {
  if (!value || typeof value !== "object") return {};
  const source = value as Record<string, unknown>;
  const normalized: Partial<Record<GameTierId, TierStats>> = {};
  for (const tier of GAME_TIERS) {
    const item = source[tier.id];
    if (!item || typeof item !== "object") continue;
    const stats = item as Partial<TierStats>;
    normalized[tier.id] = { wins: Number(stats.wins) || 0, losses: Number(stats.losses) || 0, attempts: Number(stats.attempts) || 0, masteryScore: Number(stats.masteryScore) || 0 };
  }
  return normalized;
}

function makeEmptyProgress(playerId: string, gameId: string, grade: string): GameProgress {
  const entryTier = getGameEntryTier(gameId, grade);
  return { gameId, playerId, gradeEntry: getGradeNumber(grade), currentTier: entryTier, wins: 0, losses: 0, attempts: 0, masteryScore: 0, highestTier: entryTier, tierStats: {} };
}

function normalizeProgress(existing: Partial<GameProgress>, playerId: string, gameId: string, grade: string): GameProgress {
  const fallback = makeEmptyProgress(playerId, gameId, grade);
  const entryTier = getGameEntryTier(gameId, grade);
  const minimumTierIndex = getTierIndex(entryTier);
  const currentIndex = Math.max(minimumTierIndex, getTierIndex(existing.currentTier ?? entryTier));
  const highestIndex = Math.max(minimumTierIndex, getTierIndex(existing.highestTier ?? entryTier));
  return { ...fallback, ...existing, gradeEntry: getGradeNumber(grade), currentTier: GAME_TIERS[currentIndex]?.id ?? entryTier, highestTier: GAME_TIERS[highestIndex]?.id ?? entryTier, wins: Number(existing.wins) || 0, losses: Number(existing.losses) || 0, attempts: Number(existing.attempts) || 0, masteryScore: Number(existing.masteryScore) || 0, tierStats: normalizeTierStats(existing.tierStats) };
}

export function getGameEntryTier(gameId: string, grade: string): GameTierId {
  const gradeNumber = getGradeNumber(grade);
  return GAME_GRADE_ENTRY_TIERS[gameId]?.[gradeNumber] ?? DEFAULT_GRADE_ENTRY_TIERS[gradeNumber] ?? "novice";
}

export function getGameProgress(playerId: string, gameId: string, grade: string): GameProgress {
  if (typeof window === "undefined") return makeEmptyProgress(playerId, gameId, grade);
  const existing = readProgress().find((item) => item.playerId === playerId && item.gameId === gameId);
  if (!existing) return makeEmptyProgress(playerId, gameId, grade);
  const normalized = normalizeProgress(existing, playerId, gameId, grade);
  if (Object.keys(normalized.tierStats).length === 0 && normalized.attempts > 0) {
    normalized.tierStats[normalized.currentTier] = { wins: normalized.wins, losses: normalized.losses, attempts: normalized.attempts, masteryScore: normalized.masteryScore };
  }
  return normalized;
}

export function recordGameResult(playerId: string, gameId: string, grade: string, result: "won" | "lost", performanceScore?: number): GameProgress {
  const progress = getGameProgress(playerId, gameId, grade);
  const score = Math.min(100, Math.max(0, Math.round(performanceScore ?? (result === "won" ? 100 : 0))));
  const previous = progress.tierStats[progress.currentTier] ?? emptyTierStats();
  const tierWins = previous.wins + (result === "won" ? 1 : 0);
  const tierLosses = previous.losses + (result === "lost" ? 1 : 0);
  const tierAttempts = tierWins + tierLosses;
  const tierMastery = tierAttempts === 0 ? 0 : Math.round(((previous.masteryScore * previous.attempts) + score) / tierAttempts);
  const tierStats: Partial<Record<GameTierId, TierStats>> = { ...progress.tierStats, [progress.currentTier]: { wins: tierWins, losses: tierLosses, attempts: tierAttempts, masteryScore: tierMastery } };

  const wins = progress.wins + (result === "won" ? 1 : 0);
  const losses = progress.losses + (result === "lost" ? 1 : 0);
  const attempts = wins + losses;
  const masteryScore = attempts === 0 ? 0 : Math.round(((progress.masteryScore * progress.attempts) + score) / attempts);
  let currentTier = progress.currentTier;
  let highestTier = progress.highestTier;
  const currentIndex = getTierIndex(currentTier);
  const nextTier = GAME_TIERS[currentIndex + 1];

  if (nextTier && tierWins >= nextTier.unlockWins && tierMastery >= nextTier.masteryRequired) {
    currentTier = nextTier.id;
    if (getTierIndex(highestTier) < currentIndex + 1) highestTier = nextTier.id;
  }

  const next: GameProgress = { gameId, playerId, gradeEntry: getGradeNumber(grade), currentTier, wins, losses, attempts, masteryScore, highestTier, tierStats };
  writeProgress(readProgress().filter((item) => !(item.playerId === playerId && item.gameId === gameId)).concat(next));
  recordActivityCompletion(`${gameId}`);
  return next;
}

export function getNextGameTier(progress: GameProgress) { return GAME_TIERS[getTierIndex(progress.currentTier) + 1] ?? null; }
export function getGameTiers() { return GAME_TIERS; }

function readProgress(): GameProgress[] {
  try { const raw = window.localStorage.getItem(STORAGE_KEY); if (!raw) return []; const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}
function writeProgress(progress: GameProgress[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch { /* Keep the game playable if browser storage is unavailable. */ }
}
