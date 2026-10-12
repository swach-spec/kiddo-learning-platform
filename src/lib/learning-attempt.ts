export type LearningAttempt = {
  id: string;
  playerId: string;
  nodeId: string;
  activityId: string;
  status: "in_progress" | "completed";
  startedAt: string;
  completedAt?: string;
};

const KEY = "kiddo-learning-attempts";

function read(): LearningAttempt[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as LearningAttempt[];
  } catch {
    return [];
  }
}

function write(items: LearningAttempt[]) {
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, JSON.stringify(items));
}

/**
 * Returns the learner's unfinished attempt at this activity, or starts a new one.
 *
 * Only an IN-PROGRESS attempt is resumed, so a refresh mid-activity keeps the
 * same session identity (no double XP). A COMPLETED attempt is never reused:
 * returning to the activity after finishing it (for example a retry after a
 * weak score) must start a fresh session, otherwise the new answers would be
 * discarded as a duplicate of the old session.
 */
export function getOrStartLearningAttempt(playerId: string, nodeId: string, activityId: string, replay = false): LearningAttempt {
  const items = read();
  if (!replay) {
    const unfinished = [...items]
      .reverse()
      .find((item) => item.playerId === playerId && item.nodeId === nodeId && item.activityId === activityId && item.status === "in_progress");
    if (unfinished) return unfinished;
  }
  const attempt: LearningAttempt = {
    id: crypto.randomUUID(),
    playerId,
    nodeId,
    activityId,
    status: "in_progress",
    startedAt: new Date().toISOString(),
  };
  write([...items, attempt]);
  return attempt;
}

export function completeLearningAttempt(id: string) {
  const items = read();
  write(items.map((item) => (item.id === id ? { ...item, status: "completed" as const, completedAt: item.completedAt ?? new Date().toISOString() } : item)));
}
