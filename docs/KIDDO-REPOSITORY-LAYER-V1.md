# KIDDO Repository Layer v1

## Purpose

The repository layer separates KIDDO application logic from persistence. The current implementation uses browser LocalStorage; a future Supabase implementation can replace it without requiring the child-facing experience to be rewritten.

## Architecture

```text
UI / Components
      |
Application + Learning Services
      |
Repository interfaces
      |
LocalStorage adapter (current)
      |
Supabase adapter (future)
      |
PostgreSQL (future)
```

## Repository areas

### Learners

- List learners belonging to the signed-in family.
- Read a learner.
- Read/set the current learner.
- Create and update learner profiles.

### Activities

- Record activity results.
- Read all results for a learner.
- Read results for a specific activity.

### Progress

A lightweight persistence contract is provided now for learner-position data. It intentionally accepts a generic record until the production learner-progress domain types are introduced by the learning-engine phase.

### Revision

A lightweight persistence contract is provided for revision items. The production revision domain will define the durable shape when revision becomes first-class.

### Analytics

A first-party event contract is provided now so product instrumentation can be introduced without coupling screens to LocalStorage. The production event pipeline will later write to the `events` table through Supabase.

## Compatibility strategy

`src/lib/player.ts` remains as a compatibility facade. Existing screens can continue importing `getPlayers`, `getCurrentPlayer`, `updatePlayer`, `awardXP`, `markStoryCompleted`, `recordActivityResult`, and `getActivityResults`, but those functions now delegate to repositories.

This lets KIDDO migrate incrementally rather than performing a risky application-wide rewrite.

## Storage compatibility

The existing keys remain unchanged:

- `kiddo-players`
- `kiddo-current-player`
- `kiddo-activity-results`

New repository-managed keys are:

- `kiddo-learner-progress`
- `kiddo-revision-items`
- `kiddo-analytics-events`

Existing child-testing data therefore remains available during this phase.

## Rules for future development

1. New learning features should depend on repository interfaces, not `window.localStorage`.
2. Storage-specific code belongs under `src/data/adapters/`.
3. The repository composition root is `src/data/repositories/index.ts`.
4. Supabase must replace the adapter, not the UI.
5. The compatibility facade can be retired gradually after callers have migrated.
6. Learning logic must not be placed inside the LocalStorage adapter.

## Next migration step

Introduce the repository interfaces into the learning/progression services, then add the Supabase adapter behind the same interfaces. Do not remove LocalStorage until the Supabase path has been validated against the current child-testing workflow.
