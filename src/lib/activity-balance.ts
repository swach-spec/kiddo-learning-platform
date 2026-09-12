import { getActivityResults } from "@/lib/player";

const BALANCE_KEY = "kiddo-activity-balance";
const HOME_PROMPT_LIMIT = 2;
const COMPLETION_LIMIT_BEFORE_RECOMMENDATION = 2;

type ActivityBalanceState = {
  completions: Record<string, number>;
  homePrompts: Record<string, number>;
  lastCompletedActivityId: string | null;
};

export type BalancedActivityRecommendation = {
  activityId: string;
  title: string;
  description: string;
  href: string;
};

const RECOMMENDABLE_ACTIVITIES: BalancedActivityRecommendation[] = [
  { activityId: "memory-match-v1", title: "Memory Match", description: "Train your memory and vocabulary.", href: "/games/memory-match" },
  { activityId: "checkers-v1", title: "Draughts", description: "Think ahead and make your next move.", href: "/games/checkers" },
  { activityId: "word-builder-v1", title: "Word Challenge", description: "Build words and sharpen your language skills.", href: "/games/word-builder" },
];

function isBrowser() {
  return typeof window !== "undefined";
}

function readState(): ActivityBalanceState {
  if (!isBrowser()) return { completions: {}, homePrompts: {}, lastCompletedActivityId: null };
  const raw = window.localStorage.getItem(BALANCE_KEY);
  if (!raw) return { completions: {}, homePrompts: {}, lastCompletedActivityId: null };
  try {
    const parsed = JSON.parse(raw) as Partial<ActivityBalanceState>;
    return {
      completions: parsed.completions ?? {},
      homePrompts: parsed.homePrompts ?? {},
      lastCompletedActivityId: parsed.lastCompletedActivityId ?? null,
    };
  } catch {
    return { completions: {}, homePrompts: {}, lastCompletedActivityId: null };
  }
}

function writeState(state: ActivityBalanceState) {
  if (!isBrowser()) return;
  window.localStorage.setItem(BALANCE_KEY, JSON.stringify(state));
}

/** Record one genuine completion of an activity, not an individual question answer. */
export function recordActivityCompletion(activityId: string) {
  const state = readState();
  state.completions[activityId] = (state.completions[activityId] ?? 0) + 1;
  state.lastCompletedActivityId = activityId;
  writeState(state);
}

export function getActivityCompletionCount(activityId: string): number {
  return readState().completions[activityId] ?? 0;
}

export function getActivityHomePromptCount(activityId: string): number {
  return readState().homePrompts[activityId] ?? 0;
}

/**
 * Home can deliberately surface a completed activity again. After two such
 * prompts, the activity is temporarily restricted until another activity is
 * completed. This creates healthy interleaving without making the child feel
 * punished for liking one activity.
 */
export function shouldPromptActivity(activityId: string): boolean {
  const state = readState();
  const completions = state.completions[activityId] ?? 0;
  const prompts = state.homePrompts[activityId] ?? 0;
  return completions >= COMPLETION_LIMIT_BEFORE_RECOMMENDATION && prompts < HOME_PROMPT_LIMIT;
}

export function recordHomePrompt(activityId: string) {
  const state = readState();
  state.homePrompts[activityId] = (state.homePrompts[activityId] ?? 0) + 1;
  writeState(state);
}

export function isActivityRestricted(activityId: string): boolean {
  const state = readState();
  return (
    (state.completions[activityId] ?? 0) >= COMPLETION_LIMIT_BEFORE_RECOMMENDATION &&
    (state.homePrompts[activityId] ?? 0) >= HOME_PROMPT_LIMIT &&
    state.lastCompletedActivityId !== activityId
  );
}

export function getBalancedActivityIds(activityIds: string[]): string[] {
  return activityIds.filter((activityId) => !isActivityRestricted(activityId));
}

export function getNextActivityRecommendation(playerId: string): BalancedActivityRecommendation | null {
  const knownIds = new Set(getActivityResults(playerId).map((result) => result.activityId));
  return RECOMMENDABLE_ACTIVITIES.find(
    (activity) => knownIds.has(activity.activityId) && shouldPromptActivity(activity.activityId)
  ) ?? null;
}

/**
 * Legacy localStorage results remain useful while the repository layer is
 * being adopted. This helper is intentionally read-only and does not infer
 * completion from question-level evidence.
 */
export function getKnownActivityIds(playerId: string): string[] {
  return [...new Set(getActivityResults(playerId).map((result) => result.activityId))];
}
