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
 * prompts, the activity becomes temporarily restricted. Completing another
 * activity is the signal that the learner has tried something else; the next
 * balance cycle can then recommend the original activity again.
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
    (state.homePrompts[activityId] ?? 0) >= HOME_PROMPT_LIMIT
  );
}

export function getBalancedActivityIds(activityIds: string[]): string[] {
  return activityIds.filter((activityId) => !isActivityRestricted(activityId));
}

export function getNextActivityRecommendation(_playerId: string): BalancedActivityRecommendation | null {
  return RECOMMENDABLE_ACTIVITIES.find((activity) => shouldPromptActivity(activity.activityId)) ?? null;
}

export function getKnownActivityIds(playerId: string): string[] {
  // Kept as a compatibility helper for callers that still need the legacy
  // activity-result list. Balance decisions themselves use completion state.
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem("kiddo-activity-results");
    if (!raw) return [];
    const results = JSON.parse(raw) as Array<{ playerId?: string; activityId?: string }>;
    return [...new Set(results.filter((result) => result.playerId === playerId && result.activityId).map((result) => result.activityId as string))];
  } catch {
    return [];
  }
}
