# KIDDO Supabase Schema v1

## Status

**Architecture baseline — ready for review and Supabase development.**

This document defines the production data model that will guide KIDDO moving forward. The executable PostgreSQL migration is:

`supabase/migrations/202609120001_schema_v1.sql`

The migration is intentionally not connected to the application yet. The next work is to review the schema/RLS design, create the Supabase environments, and then introduce repository adapters incrementally.

---

## 1. Architecture principle

KIDDO is a learner-centric platform, not a collection of independent pages and games.

The architecture separates five concerns:

1. **Identity & Family** — who owns the data.
2. **Curriculum & Content** — what KIDDO teaches.
3. **Learner State & Evidence** — what a learner has done and demonstrated.
4. **Learning Intelligence & Revision** — what KIDDO should recommend next.
5. **Analytics & Product Intelligence** — what the product team needs to understand behaviour and outcomes.

The curriculum remains the spine. Learner evidence influences pace, practice, support, acceleration and revision, but does not replace curriculum coverage.

---

## 2. Data ownership model

```text
Supabase Auth
    |
    v
profiles
    |
    v
families ---- family_members
    |
    +---- child_profiles
              |
              +---- learner_progress
              +---- activity_progress
              +---- skill_mastery
              +---- activity_attempts
              +---- question_attempts
              +---- revision_items
              +---- revision_attempts
              +---- xp_transactions
              +---- learner_achievements
              +---- streaks
              +---- sessions
              +---- events
```

A **family is the primary tenant/ownership boundary** for learner data.

A parent should only be able to access children belonging to a family of which they are a member. Platform administrators have controlled platform-wide access.

---

## 3. Identity tables

### `profiles`

Application profile for a Supabase Auth user.

- `id` — same UUID as `auth.users.id`
- `display_name`
- `created_at`
- `updated_at`

Passwords and authentication secrets are not duplicated in this table.

### `families`

Represents a customer/family account boundary.

- `id`
- `name`
- `status`: active, suspended, archived
- timestamps

### `family_members`

Connects authenticated users to families.

- `family_id`
- `user_id`
- `role`: owner, parent, guardian

### `admin_users`

Separates platform administration from ordinary family roles.

This is deliberate: an application-level `role = admin` field should not be the security boundary for platform administration.

### `child_profiles`

A learner identity owned by a family.

- `family_id`
- `display_name`
- `avatar`
- `grade_id`
- `status`: active, paused, archived

In v1, a child is a learner profile rather than a separate email/password identity. A child PIN/session model can be added later without redesigning learner data ownership.

---

## 4. Curriculum tables

### `grades`

Initial seed: G1–G6.

### `subjects`

Initial seed:

- English (`ENG`)
- Mathematics (`MAT`)

### `curriculum_nodes`

Represents the curriculum hierarchy:

```text
Grade
  -> Subject
      -> Strand
          -> Sub-strand
              -> Concept / Learning Objective
```

Every node carries `curriculum_version`, initially `2026-KICD`.

### `skills`

Skills are separate from curriculum nodes.

The curriculum describes **what is taught**; skills describe **what capability is being measured**.

Initial skills include:

- reading
- grammar
- spelling
- vocabulary
- numeracy
- calculation
- problem_solving
- measurement

### `learning_units`

A coherent learning unit under a curriculum node.

### `activities`

The actual learner experiences attached to the curriculum.

Types:

- story
- guided_practice
- independent_practice
- revision
- assessment
- game
- challenge

Activities carry sequence, difficulty, estimated duration, version and metadata.

### `activity_skills`

Many-to-many mapping between activities and skills, with a weight so an activity can measure multiple skills without pretending every skill contributes equally.

### `questions` and `question_options`

Question-level content and answer options.

Question metadata supports richer interactions without forcing every future game or activity into a rigid question schema.

---

## 5. Learner state

### `learner_progress`

One current learning position per child.

It answers:

> Where is this learner in the curriculum right now?

It stores the current subject, curriculum node, learning unit, activity, state and percentage.

States:

- not_started
- learning
- developing
- secure
- mastered

### `activity_progress`

Per-child progress against an activity.

It answers:

> What has this learner done with this activity?

Important fields:

- `completion_count`
- `best_score`
- `best_accuracy`
- first/last start
- last completion
- status

The status `deprioritised` gives the learning engine a place to temporarily reduce repetition without treating the learner as punished or permanently blocked.

### `skill_mastery`

Aggregated evidence for a child/skill pair.

This is where KIDDO will eventually determine whether a learner is:

- needs support
- developing
- secure
- mastered

The first implementation should use transparent rules rather than opaque machine learning.

---

## 6. Evidence

### `activity_attempts`

One record per attempt at an activity.

Captures:

- start/completion
- duration
- score
- accuracy
- attempt number
- hints
- XP
- session

### `question_attempts`

Question-level evidence.

This is critical for the future Admin Console because aggregate activity scores alone cannot explain where children struggle.

Example insight eventually supported by this model:

> Grade 3 learners complete a story quickly, but question 4 has low accuracy and long response time.

### `sessions`

Tracks learning sessions without relying on third-party advertising or tracking systems.

---

## 7. Revision system

Revision is a first-class learning system, not a folder of completed work.

### `revision_items`

A learner-specific knowledge item requiring future retrieval.

It connects:

- learner
- skill
- curriculum node
- source activity
- mastery state
- next revision date
- revision interval
- revision count

### `revision_attempts`

Records the result of each retrieval attempt.

The eventual revision engine will use:

- recency
- demonstrated weakness
- mastery state
- previous revision performance
- spacing
- interleaving

The first version should remain simple and explainable.

---

## 8. Gamification

### `xp_transactions`

XP is a ledger, not merely a mutable number.

This makes XP auditable and allows the product to understand why XP was awarded.

### `achievements` / `learner_achievements`

Defines and records earned badges/achievements.

### `streaks`

Stores the current and longest learning streak for fast display.

---

## 9. Analytics

### `events`

First-party product analytics.

Initial event families:

- authentication
- sessions
- navigation
- activities
- stories
- questions
- progression
- revision
- gamification

The event table deliberately keeps `entity_id` as text because the current prototype contains string identifiers such as story and game IDs. Analytics should not depend on every legacy identifier immediately becoming a UUID.

Child analytics should use internal pseudonymous UUIDs rather than unnecessary personal information.

KIDDO should not use advertising trackers for learner analytics.

---

## 10. Security model

Row Level Security is enabled for all application tables.

Core rules:

- A parent/member can access only their own family.
- Family members can access only children in their family.
- Platform admins can access platform data.
- Curriculum content is readable by authenticated users but writable by admins.
- Public users receive no learner data.

The database is the security boundary. React UI checks are not treated as sufficient protection.

The RLS helper functions are `SECURITY DEFINER` functions with an explicit `search_path` to reduce recursive-policy problems and search-path risk.

Before production, RLS must be tested with representative roles in a real Supabase project, including:

1. Parent A reading Child A.
2. Parent A attempting to read Child B from another family.
3. Admin reading both families.
4. Anonymous user attempting learner access.
5. Parent attempting curriculum mutation.
6. Parent attempting to create a child in another family.

---

## 11. Versioning

Curriculum versioning begins now.

Initial version:

`2026-KICD`

The goal is to preserve the meaning of historical learner evidence when curriculum content changes. We should not silently reinterpret old attempts against a newer curriculum version.

Full content versioning can become more sophisticated later, but the first schema establishes the correct boundary.

---

## 12. Repository architecture

The application should not move directly from React/localStorage to Supabase calls scattered throughout pages.

Target:

```text
UI
 |
v
Learning / Application Services
 |
v
Repository Interfaces
 |
+-------------------+
|                   |
v                   v
LocalStorage      Supabase
Adapter            Adapter
```

Recommended repository areas:

```text
data/
  repositories/
    learnerRepository.ts
    activityRepository.ts
    progressRepository.ts
    revisionRepository.ts
    analyticsRepository.ts
  adapters/
    localStorage/
    supabase/
```

This allows the current child-testing prototype to continue working while the production data layer is introduced safely.

---

## 13. Completion transaction

Eventually, completing an activity must become one application-level operation rather than several unrelated UI writes.

Conceptually:

```text
completeActivity()
    |
    +-- record activity attempt
    +-- record question attempts
    +-- update skill mastery
    +-- update activity progress
    +-- advance learner progress
    +-- create/update revision items
    +-- award XP transaction
    +-- update streak
    +-- emit analytics event
```

Where appropriate, these changes should execute transactionally on the server/database side so a partial completion cannot create inconsistent learner state.

---

## 14. Migration from the current prototype

The existing `Player` model is useful for the prototype but is not the production data model.

Current prototype concept:

```text
Player
  name
  avatar
  grade
  level
  xp
  streak
  storiesCompleted
  badges
  completedStoryIds
```

Production separation:

```text
Child Profile
  identity / family / grade

Learner Progress
  current curriculum position

Activity Progress
  completion and performance per activity

Skill Mastery
  demonstrated capability

XP Transactions
  reward ledger

Achievements
  earned badges

Streaks
  streak state
```

Migration should happen through a repository abstraction rather than rewriting every screen at once.

---

## 15. What this schema deliberately does NOT include yet

Do not prematurely add complexity for:

- chess multiplayer
- Scrabble multiplayer
- social feeds
- leaderboards
- teacher portal
- school administration
- payment processing
- subscription billing
- AI tutor infrastructure
- elaborate avatar economy
- complex CMS

These remain future capabilities. The schema leaves a clean path for them without allowing them to distort the MVP architecture.

---

## 16. Immediate implementation sequence

### Step 1 — Schema review

Review the SQL migration and RLS model.

### Step 2 — Supabase environments

Create separate development and production Supabase projects/environments.

### Step 3 — Repository abstraction

Refactor the current localStorage data access behind repository interfaces.

### Step 4 — Supabase adapter

Implement the same repository contracts against PostgreSQL/Supabase.

### Step 5 — Persistent learner identity

Move family, parent and child data to Supabase.

### Step 6 — Persistent learner evidence

Move activity attempts, question attempts, mastery, progress, XP and streaks.

### Step 7 — Central completion service

Make activity completion update all relevant systems consistently.

### Step 8 — Revision engine

Turn completed learning into spaced retrieval opportunities.

### Step 9 — Analytics pipeline

Instrument the product using the event taxonomy and build the Admin Console around the resulting data.

### Step 10 — Early-child testing

Use real learner behaviour to refine content, progression, UX and learning intelligence before commercial expansion.

---

## 17. Definition of success

The production foundation is successful when KIDDO can answer, reliably and securely:

> **Who is this learner, what curriculum are they following, what have they attempted, what have they demonstrated, what do they need next, what should they revise, what have they earned, and what is the product learning from their behaviour?**

That is the foundation on which the Parent Dashboard, subscriptions and eventual school deployment will be built.
