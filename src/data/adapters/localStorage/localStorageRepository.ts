import { defaultPlayers, getLevelFromXP, Player } from "@/lib/kiddo";
import { DEMO_ACCOUNT_ID, getAccount } from "@/lib/auth";
import { ActivityResult } from "@/types/activity";
import {
  ActivityRepository,
  AnalyticsEvent,
  AnalyticsRepository,
  KiddoRepositories,
  LearnerRepository,
  ProgressRepository,
  RevisionRepository,
} from "@/data/repositories/types";

const PLAYERS_KEY = "kiddo-players";
const CURRENT_PLAYER_KEY = "kiddo-current-player";
const ACTIVITY_RESULTS_KEY = "kiddo-activity-results";
const PROGRESS_KEY = "kiddo-learner-progress";
const REVISION_KEY = "kiddo-revision-items";
const ANALYTICS_KEY = "kiddo-analytics-events";

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
    level: typeof candidate.level === "number" ? candidate.level : getLevelFromXP(candidate.xp ?? 0),
    xp: typeof candidate.xp === "number" ? candidate.xp : 0,
    streak: typeof candidate.streak === "number" ? candidate.streak : 0,
    storiesCompleted: typeof candidate.storiesCompleted === "number" ? candidate.storiesCompleted : 0,
    badges: typeof candidate.badges === "number" ? candidate.badges : 0,
    completedStoryIds: Array.isArray(candidate.completedStoryIds) ? candidate.completedStoryIds : [],
  };
}

function allPlayers(): Player[] {
  const saved = readJSON<unknown[]>(PLAYERS_KEY);
  if (saved) {
    const normalized = saved.map(normalizePlayer).filter((p): p is Player => p !== null);
    writeJSON(PLAYERS_KEY, normalized);
    return normalized;
  }
  writeJSON(PLAYERS_KEY, defaultPlayers);
  return defaultPlayers;
}

function currentAccountId() {
  return getAccount()?.id ?? null;
}

const learners: LearnerRepository = {
  getLearners() {
    const accountId = currentAccountId();
    if (!accountId) return [];
    return allPlayers().filter((p) => p.accountId === accountId);
  },

  getLearner(playerId) {
    return this.getLearners().find((p) => p.id === playerId) ?? null;
  },

  getCurrentLearner() {
    const player = normalizePlayer(readJSON<unknown>(CURRENT_PLAYER_KEY));
    const accountId = currentAccountId();
    return player && accountId && player.accountId === accountId ? player : null;
  },

  setCurrentLearner(player) {
    const accountId = currentAccountId();
    if (accountId && player.accountId === accountId) writeJSON(CURRENT_PLAYER_KEY, player);
  },

  createLearner(player) {
    const accountId = currentAccountId();
    if (!accountId || player.accountId !== accountId) return player;
    const players = allPlayers();
    writeJSON(PLAYERS_KEY, [...players.filter((p) => p.id !== player.id), player]);
    return player;
  },

  updateLearner(playerId, updates) {
    const accountId = currentAccountId();
    if (!accountId) return null;
    const players = allPlayers();
    const index = players.findIndex((p) => p.id === playerId && p.accountId === accountId);
    if (index < 0) return null;
    const updated = { ...players[index], ...updates, accountId };
    const next = [...players];
    next[index] = updated;
    writeJSON(PLAYERS_KEY, next);
    if (this.getCurrentLearner()?.id === playerId) this.setCurrentLearner(updated);
    return updated;
  },
};

const activities: ActivityRepository = {
  recordResult(result) {
    const existing = readJSON<ActivityResult[]>(ACTIVITY_RESULTS_KEY) ?? [];
    writeJSON(ACTIVITY_RESULTS_KEY, [...existing, result]);
  },

  getResults(playerId) {
    return (readJSON<ActivityResult[]>(ACTIVITY_RESULTS_KEY) ?? []).filter((r) => r.playerId === playerId);
  },

  getResultsForActivity(playerId, activityId) {
    return this.getResults(playerId).filter((r) => r.activityId === activityId);
  },
};

const progress: ProgressRepository = {
  getLearnerProgress(playerId) {
    const all = readJSON<Record<string, Record<string, unknown>>>(PROGRESS_KEY) ?? {};
    return all[playerId] ?? null;
  },

  saveLearnerProgress(playerId, value) {
    const all = readJSON<Record<string, Record<string, unknown>>>(PROGRESS_KEY) ?? {};
    writeJSON(PROGRESS_KEY, { ...all, [playerId]: value });
  },
};

const revision: RevisionRepository = {
  getRevisionItems(playerId) {
    const all = readJSON<Record<string, Record<string, unknown>[]>>(REVISION_KEY) ?? {};
    return all[playerId] ?? [];
  },

  saveRevisionItems(playerId, items) {
    const all = readJSON<Record<string, Record<string, unknown>[]>>(REVISION_KEY) ?? {};
    writeJSON(REVISION_KEY, { ...all, [playerId]: items });
  },
};

const analytics: AnalyticsRepository = {
  recordEvent(event: AnalyticsEvent) {
    const existing = readJSON<AnalyticsEvent[]>(ANALYTICS_KEY) ?? [];
    writeJSON(ANALYTICS_KEY, [...existing, { ...event, occurredAt: event.occurredAt ?? new Date().toISOString() }]);
  },
};

export const localStorageRepositories: KiddoRepositories = {
  learners,
  activities,
  progress,
  revision,
  analytics,
};
