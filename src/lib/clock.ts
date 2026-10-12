/**
 * Wall-clock helpers for event handlers. Reading the clock inside a component
 * body is impure during render; keeping it behind these helpers makes intent
 * explicit and keeps the call sites in handlers.
 */
export function nowMs(): number {
  return Date.now();
}

/** A unique id for a recorded result, e.g. `checkers-<player>-<timestamp>`. */
export function timestampedId(prefix: string, playerId: string): string {
  return `${prefix}-${playerId}-${Date.now()}`;
}
