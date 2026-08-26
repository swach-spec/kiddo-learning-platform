import {
  defaultPlayers,
  getLevelFromXP,
  Player,
} from "@/lib/kiddo";
import { ActivityResult } from "@/types/activity";

// V1 persistence: localStorage. Every read/write in the app should go
// through this module rather than touching localStorage directly, so
// swapping this for a real backend later is a one-file change.
const PLAYERS_KEY = "kiddo-players";
const CURRENT_PLAYER_KEY = "kiddo-current-player";
const ACTIVITY_RESULTS_KEY = "kiddo-activity-results";

function isBrowser() {
  return typeof window !== "undefined";
}

function readJSON<T>(key: string): T | null {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as T;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Normalization boundary between raw storage and the application.
 *
 * Phase 1 added exactly one new required field to Player:
 * `completedStoryIds`. Data written by the pre-Phase-1 app (or anything
 * else malformed/partial) won't have it. This is the single place that
 * gap gets filled — every other field is passed through completely
 * untouched, so an existing player's name, id, avatar, grade, xp,
 * level, streak, storiesCompleted and badges are never altered or
 * reset, only ever read as-is.
 *
 * Returns null if the raw value isn't even a usable player record
 * (missing an id), so callers can treat it the same as "no data" rather
 * than crash on it.
 */
function normalizePlayer(raw: unknown): Player | null {
  if (!raw || typeof raw !== "object") return null;

  const candidate = raw as Partial<Player>;

  if (typeof candidate.id !== "string" || candidate.id.length === 0) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name ?? "",
    avatar: candidate.avatar ?? "🙂",
    grade: candidate.grade ?? "",
    // level/xp/streak/storiesCompleted/badges: pass through the stored
    // value untouched whenever it's already a valid number. Only a
    // genuinely missing/malformed value gets a safe fallback — this
    // never overwrites or "corrects" an existing valid value (e.g. it
    // does not recompute level from xp for players that already have
    // a stored level).
    level:
      typeof candidate.level === "number"
        ? candidate.level
        : getLevelFromXP(typeof candidate.xp === "number" ? candidate.xp : 0),
    xp: typeof candidate.xp === "number" ? candidate.xp : 0,
    streak: typeof candidate.streak === "number" ? candidate.streak : 0,
    storiesCompleted:
      typeof candidate.storiesCompleted === "number"
        ? candidate.storiesCompleted
        : 0,
    badges: typeof candidate.badges === "number" ? candidate.badges : 0,
    // The one field Phase 1 actually introduced. Missing on any
    // pre-Phase-1 record — normalizes to [], never to anything that
    // would imply completions that didn't happen.
    completedStoryIds: Array.isArray(candidate.completedStoryIds)
      ? candidate.completedStoryIds
      : [],
  };
}

/** All players on this device, seeding the defaults on first run. */
export function getPlayers(): Player[] {
  const saved = readJSON<unknown[]>(PLAYERS_KEY);

  if (saved) {
    return saved
      .map((entry) => normalizePlayer(entry))
      .filter((player): player is Player => player !== null);
  }

  writeJSON(PLAYERS_KEY, defaultPlayers);
  return defaultPlayers;
}

function savePlayers(players: Player[]) {
  writeJSON(PLAYERS_KEY, players);
}

/** The currently selected player, or null if nobody has been chosen yet. */
export function getCurrentPlayer(): Player | null {
  return normalizePlayer(readJSON<unknown>(CURRENT_PLAYER_KEY));
}

/** Selects a player as "currently playing" (the closest thing KIDDO has to login today). */
export function setCurrentPlayer(player: Player) {
  writeJSON(CURRENT_PLAYER_KEY, player);
}

/**
 * Applies a partial update to a player by id, keeping the players list
 * and the "current player" pointer in sync. Returns the updated player,
 * or null if no player with that id exists.
 */
export function updatePlayer(
  playerId: string,
  updates: Partial<Player>
): Player | null {
  const players = getPlayers();
  const index = players.findIndex((p) => p.id === playerId);

  if (index === -1) return null;

  const updated: Player = { ...players[index], ...updates };
  const nextPlayers = [...players];
  nextPlayers[index] = updated;
  savePlayers(nextPlayers);

  const current = getCurrentPlayer();
  if (current?.id === playerId) {
    setCurrentPlayer(updated);
  }

  return updated;
}

/**
 * Adds XP to a player and recalculates their level from the existing
 * XP formulas in lib/kiddo.ts. Does not touch storiesCompleted —
 * pair with markStoryCompleted when a story finishes.
 */
export function awardXP(playerId: string, amount: number): Player | null {
  const players = getPlayers();
  const player = players.find((p) => p.id === playerId);

  if (!player) return null;

  const nextXP = player.xp + amount;

  return updatePlayer(playerId, {
    xp: nextXP,
    level: getLevelFromXP(nextXP),
  });
}

/**
 * Marks a story as completed for a player (idempotent — completing the
 * same story twice does not double-count storiesCompleted).
 */
export function markStoryCompleted(
  playerId: string,
  storyId: string
): Player | null {
  const players = getPlayers();
  const player = players.find((p) => p.id === playerId);

  if (!player) return null;

  if (player.completedStoryIds.includes(storyId)) {
    return player;
  }

  return updatePlayer(playerId, {
    completedStoryIds: [...player.completedStoryIds, storyId],
    storiesCompleted: player.storiesCompleted + 1,
  });
}

/** Appends a single ActivityResult to this device's local activity log. */
export function recordActivityResult(result: ActivityResult) {
  const existing = readJSON<ActivityResult[]>(ACTIVITY_RESULTS_KEY) ?? [];
  writeJSON(ACTIVITY_RESULTS_KEY, [...existing, result]);
}

/** All recorded activity results for a given player, oldest first. */
export function getActivityResults(playerId: string): ActivityResult[] {
  const all = readJSON<ActivityResult[]>(ACTIVITY_RESULTS_KEY) ?? [];
  return all.filter((r) => r.playerId === playerId);
}
