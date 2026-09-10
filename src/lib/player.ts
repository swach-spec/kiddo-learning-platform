import { defaultPlayers, getLevelFromXP, Player } from "@/lib/kiddo";
import { ActivityResult } from "@/types/activity";
import { DEMO_ACCOUNT_ID, getAccount } from "@/lib/auth";

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

function normalizePlayer(raw: unknown): Player | null {
  if (!raw || typeof raw !== "object") return null;
  const candidate = raw as Partial<Player>;
  if (typeof candidate.id !== "string" || candidate.id.length === 0) return null;

  return {
    id: candidate.id,
    accountId: typeof candidate.accountId === "string" ? candidate.accountId : DEMO_ACCOUNT_ID,
    name: candidate.name ?? "",
    avatar: candidate.avatar ?? "🙂",
    grade: candidate.grade ?? "",
    level:
      typeof candidate.level === "number"
        ? candidate.level
        : getLevelFromXP(typeof candidate.xp === "number" ? candidate.xp : 0),
    xp: typeof candidate.xp === "number" ? candidate.xp : 0,
    streak: typeof candidate.streak === "number" ? candidate.streak : 0,
    storiesCompleted: typeof candidate.storiesCompleted === "number" ? candidate.storiesCompleted : 0,
    badges: typeof candidate.badges === "number" ? candidate.badges : 0,
    completedStoryIds: Array.isArray(candidate.completedStoryIds) ? candidate.completedStoryIds : [],
  };
}

function getAllPlayers(): Player[] {
  const saved = readJSON<unknown[]>(PLAYERS_KEY);
  if (saved) {
    const normalized = saved.map(normalizePlayer).filter((player): player is Player => player !== null);
    writeJSON(PLAYERS_KEY, normalized);
    return normalized;
  }

  writeJSON(PLAYERS_KEY, defaultPlayers);
  return defaultPlayers;
}

/** Returns only the explorers owned by the currently signed-in family. */
export function getPlayers(): Player[] {
  const account = getAccount();
  if (!account) return [];
  return getAllPlayers().filter((player) => player.accountId === account.id);
}

function saveAllPlayers(players: Player[]) {
  writeJSON(PLAYERS_KEY, players);
}

export function getCurrentPlayer(): Player | null {
  const current = normalizePlayer(readJSON<unknown>(CURRENT_PLAYER_KEY));
  const account = getAccount();
  if (!current || !account || current.accountId !== account.id) return null;
  return current;
}

export function setCurrentPlayer(player: Player) {
  const account = getAccount();
  if (account && player.accountId === account.id) writeJSON(CURRENT_PLAYER_KEY, player);
}

export function updatePlayer(playerId: string, updates: Partial<Player>): Player | null {
  const account = getAccount();
  if (!account) return null;

  const allPlayers = getAllPlayers();
  const index = allPlayers.findIndex((p) => p.id === playerId && p.accountId === account.id);
  if (index === -1) return null;

  const updated: Player = { ...allPlayers[index], ...updates, accountId: account.id };
  const nextPlayers = [...allPlayers];
  nextPlayers[index] = updated;
  saveAllPlayers(nextPlayers);

  const current = getCurrentPlayer();
  if (current?.id === playerId) setCurrentPlayer(updated);
  return updated;
}

export function awardXP(playerId: string, amount: number): Player | null {
  const players = getPlayers();
  const player = players.find((p) => p.id === playerId);
  if (!player) return null;
  const nextXP = player.xp + amount;
  return updatePlayer(playerId, { xp: nextXP, level: getLevelFromXP(nextXP) });
}

export function markStoryCompleted(playerId: string, storyId: string): Player | null {
  const players = getPlayers();
  const player = players.find((p) => p.id === playerId);
  if (!player) return null;
  if (player.completedStoryIds.includes(storyId)) return player;

  return updatePlayer(playerId, {
    completedStoryIds: [...player.completedStoryIds, storyId],
    storiesCompleted: player.storiesCompleted + 1,
  });
}

export function recordActivityResult(result: ActivityResult) {
  const existing = readJSON<ActivityResult[]>(ACTIVITY_RESULTS_KEY) ?? [];
  writeJSON(ACTIVITY_RESULTS_KEY, [...existing, result]);
}

export function getActivityResults(playerId: string): ActivityResult[] {
  const all = readJSON<ActivityResult[]>(ACTIVITY_RESULTS_KEY) ?? [];
  return all.filter((r) => r.playerId === playerId);
}
