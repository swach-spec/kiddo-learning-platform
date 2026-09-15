# KIDDO Project Context

> Durable handover document for Sam, ChatGPT and Codex. Read this before making architectural or learner-journey changes.

## 1. Product definition

KIDDO is being built as a commercial children's learning product, not merely a technical prototype. It combines a child-facing educational application with a longer-term dedicated console/device concept, parent intelligence, administration, analytics and serviceability.

Initial curriculum scope is Kenya CBC/CBE-aligned Kindergarten through Grade 6, with the current implementation concentrating on a Grade 2 English pilot journey before scaling the curriculum engine.

The child experience must feel exciting, rewarding, aspirational and easy to understand. A child should not have to decide among many educational options or understand the adaptive engine. KIDDO should tell the learner what to do next.

Core loop:

**Learn -> Practise -> Apply -> Master -> Earn -> Play -> Continue**

Current learning-world vocabulary includes:
- Story Forest / Grammar
- Number World / STEM/Maths
- Game World
- Practice / Revision

Games are rewards and balanced activities, not the curriculum spine.

## 2. Product principles

### Curriculum is the spine
KIDDO must cover the learner's grade curriculum systematically. Adaptive learning may change pace, amount of practice, remediation, revision and challenge, but it must not abandon curriculum coverage.

### One obvious next action
The child should normally see one clear recommended next learning action. The internal system may have many decisions, but the child-facing experience should remain simple and progression-based, closer to a game map than a dashboard of school subjects.

### Evidence drives adaptation
Performance evidence determines whether the learner should:
- continue normal practice;
- receive targeted support/remediation;
- advance;
- receive a stronger challenge/acceleration;
- receive revision later.

### Completion is not the same as mastery
A learner may finish an activity without demonstrating mastery. This distinction must be explicit in the data model and progression rules.

### Child and parent views are different
Child-facing language should be encouraging and simple. Detailed states such as `developing`, `needs_support`, accuracy patterns and intervention history belong primarily in parent/admin intelligence rather than being exposed as clinical-looking labels to children.

## 3. Target learner journey

The intended journey is:

**Login -> Choose Explorer -> Home -> Start/Resume -> Learn -> Guided Practice -> Independent Practice -> Reading/Application -> Composition/Application -> Mastery -> Reward/Play -> Next Curriculum Skill**

Adaptive branches may occur inside that sequence:

- Struggling learner: main activity -> evidence of difficulty -> targeted support -> successful support -> return to main skill -> continue.
- Developing learner: additional relevant practice -> reassess.
- Strong learner: reduce unnecessary repetition and/or provide mastery challenge -> continue curriculum.
- Completed material: move into revision scheduling while new curriculum remains the primary journey.

A support activity is a side quest, not a new permanent curriculum node. It should help the child recover and return to the main journey without an endless support loop.

## 4. Current Grade 2 English pilot

The current pilot concept is **Describing Words**. For Grades 1-3, use age-appropriate language rather than unnecessarily introducing formal word-class terminology. In the child experience, prefer `describing words` rather than requiring the learner to understand `adjectives` as a technical label.

Current Grade 2 path:

1. `g2-describing-learn` - Describing Words - lesson - `/learn/adjectives`
2. `g2-describing-guided` - Guided Practice - `/challenge/g2-guided-1`
3. `g2-describing-independent` - Independent Practice - `/challenge/g2-independent-1`
4. `g2-reading-describing` - Reading Adventure - `/story/benchmark-grade-2-the-garden-clock`
5. `g2-composition-describing` - Sentence Builder - `/challenge/g2-sentence-1`
6. `g2-describing-mastery` - Mastery Mission - `/challenge/g2-mastery-1`

Practice/mastery nodes currently use `/challenge/g2-support-1` as their support route.

The benchmark Grade 2 story is **The Garden Clock**. Its broader learning intent includes age-appropriate reading, sequencing/past-tense context and application of the language concept.

## 5. Current adaptive/mastery model

Important implementation files include:
- `src/lib/adaptive-learning.ts`
- `src/lib/mastery.ts`
- `src/lib/curriculum-path.ts`
- `src/lib/progression.ts`
- `src/lib/guided-learning.ts`
- `src/app/challenge/[id]/page.tsx`

Learning states currently include:
- `secure`
- `developing`
- `needs_support`

Actions include concepts equivalent to:
- advance
- practice
- support
- challenge

Session summaries are intended to be the evidence unit for multi-question practice/mastery activities. Individual question attempts remain useful evidence but should not accidentally count as multiple completed sessions.

Remediation/support sessions are marked with `isRemediation`. They may clear a support state, but should not silently inflate mastery evidence.

### Recent stabilization
The branch has recently addressed:
- support-return navigation;
- stale/sticky remediation behavior;
- random session-length behavior;
- question/answer shuffling;
- remediation evidence separation;
- score double-counting that could display impossible values such as `9/8`;
- progression behavior for practice stages.

Do not assume these are correct merely because fixes were attempted. Regression-test the complete journey.

## 6. Story completion semantics still need stabilization

A known product/architecture issue remains around Story Forest completion.

Current behavior can mark a story as completed after the child finishes the story/questions even with a weak comprehension score, for example 2/5. Finishing a story may legitimately count as **activity completion**, but it must not automatically mean **skill mastery**.

Desired direction:
- preserve the positive emotional reward for finishing a story;
- store comprehension/performance evidence separately;
- let progression decide whether the learner advances, receives targeted practice or later revision;
- avoid telling a child that weak comprehension is equivalent to mastery;
- avoid unnecessarily punishing the child by making reading feel like a failed exam.

This should be resolved coherently rather than with UI wording alone.

## 7. Home and guided journey

Home has four major paths:
- Grammar -> `/story`
- STEM -> `/number-world-cbc`
- Game World -> `/games`
- Practice -> `/practice`

There is also a resume/next-step experience and a Learning Journey component.

The saved learner position and computed next curriculum node must agree. Home must not say `Continue: Reading Adventure` while the Learning Journey says the actual next step is `Sentence Builder`.

Relevant files include:
- `src/app/page.tsx`
- `src/components/AdventurePaths.tsx`
- `src/components/LearningJourney.tsx`
- `src/lib/guided-learning.ts`
- `src/lib/player.ts`

## 8. Authentication and family/player model

The MVP has local family authentication/player selection.

Flow:
**Login -> Family -> Choose Explorer -> Child experience**

Important routes/files include:
- `/login`
- `/players`
- `src/lib/auth.ts`
- `src/lib/kiddo.ts`
- `src/lib/player.ts`

An admin/head-of-family creates family and child/explorer accounts. Longer term, parents receive access to their children's progress and analytics.

Existing player data must not be casually destroyed during refactors.

## 9. Repository/data architecture

KIDDO is migrating away from UI code directly owning localStorage toward repository interfaces and replaceable adapters.

Important areas:

```text
src/data/repositories/
src/data/adapters/localStorage/
src/lib/player.ts
```

`src/lib/player.ts` is currently a compatibility facade so existing UI can migrate incrementally.

Legacy localStorage compatibility keys that must be preserved unless a deliberate migration is implemented:
- `kiddo-players`
- `kiddo-current-player`
- `kiddo-activity-results`

Migrations must be idempotent, non-destructive and tolerant of missing legacy fields.

Learner progress currently includes concepts such as:
- current subject
- current curriculum node
- current learning unit
- current activity
- learning state
- progress percent
- last activity
- updated timestamp

## 10. Supabase direction

The production direction is Supabase Auth + PostgreSQL + RLS + Storage + server/edge functions as appropriate.

Schema work already exists under:
- `supabase/migrations/202609120001_schema_v1.sql`
- `docs/KIDDO-SUPABASE-SCHEMA-V1.md`

The production model separates identity, family tenancy, child profile, learner state, curriculum/content, attempts/evidence, revision, gamification and telemetry.

Existing schema concepts include:
- profiles
- families
- family_members
- admin_users
- child_profiles
- grades
- subjects
- curriculum_nodes
- skills
- learning_units
- activities
- activity_skills
- questions
- question_options
- learner_progress
- activity_progress
- skill_mastery
- activity_attempts
- question_attempts
- revision_items
- revision_attempts
- xp_transactions
- achievements
- learner_achievements
- streaks
- sessions
- events

Family is the tenant boundary and RLS must protect family data.

Do not rush the current child MVP onto Supabase before the learner journey semantics are stable. The repository abstraction exists specifically so persistence can be swapped without coupling UI to storage.

## 11. Curriculum/content direction

Official KICD curriculum designs are the source of truth for Kenyan curriculum alignment. Content should be mapped by grade, subject, strand/sub-strand, concept/skill and curriculum version.

English design principle:
- Grades 1-3: interactive language use; grammar should often be implicit/age-appropriate.
- Grade 4 onward: explicit grammar terminology can increase in line with curriculum expectations.

Stories must be deep enough for the grade. Early test children completed initial stories too quickly, so story length/depth should not be reduced merely to make implementation easy.

The curriculum engine should eventually support all required grade material while allowing KIDDO to add new content continuously.

## 12. Revision system

After a topic/story/skill is learned, it should become eligible for revision rather than remaining the primary untackled-content destination.

Long-term behavior:
- Story Forest primarily surfaces new/untackled adventures.
- Learned material enters a revision system.
- Revision becomes available according to milestones, evidence and time.
- Weak evidence can schedule earlier revision.
- Strong evidence can schedule later revision.

Do not implement a simplistic `completed = never show again` rule.

## 13. Games and activity balance

Current games include:
- Memory Match
- Checkers
- Word Builder

Future games may include Chess, Scrabble and multiplayer, but do not prioritize them over the learner journey.

The game system has progression/unlocks and an activity-balance mechanism. Current balancing is still limited and should eventually work across Grammar/STEM/Practice rather than being only game-aware.

Games should reinforce engagement without allowing the child to spend the entire KIDDO session avoiding learning.

## 14. Session/product experience

The MVP should support a meaningful approximately 30-minute child session. This does not mean exactly 30 minutes of fixed content. It means KIDDO should be capable of guiding a child through a balanced session containing meaningful learning, practice/application and appropriate reward/play.

The product should remember progress across sessions and make returning effortless.

## 15. Parent/admin intelligence

Parent value is a core product feature, not an afterthought.

Parents should eventually be able to understand:
- what the child is learning;
- progress through grade curriculum;
- strengths;
- concepts needing support;
- practice/revision patterns;
- engagement/time patterns;
- achievements;
- meaningful recommendations.

An admin console should support family/user creation and management, analytics, progress monitoring and eventually device/service operations.

The current children and interested neighborhood children are an early feedback cohort. Product analytics should be privacy-appropriate and designed to learn from real usage rather than merely counting page views.

## 16. Console/device future

KIDDO may become a dedicated commercial console/device as well as an app.

The device architecture should eventually support operational telemetry including:
- boot/power events;
- uptime;
- lag/performance;
- crashes/errors;
- interaction counts/types;
- update events;
- diagnostics;
- other service events.

Logs should be retained locally when offline and securely synchronized when connectivity is available.

Backend device registry should use model + unique serial number.

A hidden service/maintenance capability may exist, but access must be securely authorized. Do not rely on obscurity/hidden UI alone. The previously discussed direction is an approved service USB/token mechanism backed by authorization/validation.

Design for unreliable connectivity and field serviceability from the start, even if this is not part of the immediate software MVP.

## 17. Current repository/branch workflow

Repository:
`swach-spec/kiddo-learning-platform`

Current active development branch at handover:
`repository-abstraction-v1`

Recent known stabilization commits include:
- `8155a2cfc5626c9e9e05c813999a3ce24abe19ff` - native-link remediation return navigation
- `939ef0f9cd3cbf91a9d4d03541179b2e8ef437ab` - challenge scoring/progression stabilization
- `79d890c43a2d66283648414b252d6d8deb9c3bd6` - practice-stage completion stabilization

Codex must inspect git history/current HEAD rather than assuming this document is perfectly synchronized.

There are historical/open experimental branches/PRs. Do not merge them merely because they exist. In particular, inspect before touching curriculum-engine experiments.

Historically observed untracked local patch files may exist:
- `phase3-stabilization-fixes.patch`
- `phase3-stabilization-full.patch`

Do not delete or overwrite untracked local files without explicit reason/approval.

## 18. Development operating rules

1. Inspect before editing.
2. Treat the actual repository as authority for implementation state and this document as authority for product intent.
3. Do not rewrite working architecture unnecessarily.
4. Do not solve one bug by breaking persistence, progression or legacy data.
5. Prefer coherent implementation phases over many one-file micro-patches.
6. Run relevant type/build/lint/tests after changes.
7. Add focused tests around progression rules where practical.
8. Report what was actually tested; do not claim checks passed if they were not run.
9. Commit clean checkpoints with descriptive messages.
10. Do not push/merge/deploy unless Sam explicitly asks.
11. Do not ask Sam questions that can be answered by inspecting the repository.
12. When a genuine product decision is required, state the trade-off clearly so Sam/ChatGPT can decide it.
13. Preserve the child-first UX and commercial-product constraints while making engineering decisions.

## 19. Immediate stabilization objective

Before adding substantial new curriculum, stabilize one complete Grade 2 learning thread end-to-end.

Acceptance journey:

1. Child signs in/selects explorer.
2. Home identifies the correct next step.
3. Child learns Describing Words before being tested.
4. Guided Practice records one coherent session score.
5. Weak performance can trigger targeted support after appropriate evidence.
6. Support success returns the learner to the main skill without an endless remediation loop.
7. Successful main practice advances appropriately.
8. Independent Practice behaves consistently and never produces impossible scores.
9. Reading Adventure records reading completion separately from comprehension evidence.
10. A weak story quiz result does not falsely become mastery.
11. The progression engine decides the appropriate next action after reading evidence.
12. Sentence Builder follows when appropriate.
13. Mastery Mission provides the final evidence checkpoint.
14. Home resume and Learning Journey agree on the learner's position.
15. XP is awarded exactly once for the intended actions.
16. Refresh/relogin preserves the correct state.
17. The child always has a clear next action.

Only after this vertical slice is reliable should the same architecture be scaled across additional English concepts/grades and Maths.

## 20. First Codex assignment

Codex should begin with an **audit and stabilization phase**, not a redesign.

Inspect the actual repository and trace the Grade 2 Describing Words journey end-to-end. Classify findings as:
- confirmed working behavior;
- defect/regression;
- semantic/product gap;
- architectural debt;
- future feature.

Pay special attention to:
- session score correctness;
- duplicate ActivityResult/session summaries;
- XP double-awards;
- remediation state transitions;
- completion vs mastery semantics;
- story comprehension evidence;
- saved learner position vs computed next node;
- refresh/relogin persistence;
- direct route/query behavior;
- child-facing wording;
- test coverage for the progression state machine.

Then implement the smallest coherent stabilization phase that makes the vertical slice internally consistent. Do not expand curriculum breadth until this journey is dependable.

## 21. Collaboration model

Roles:

**Sam — Product owner/founder**
Defines business intent, validates child experience and makes product decisions.

**ChatGPT — Product/architecture partner**
Turns product intent and testing observations into architecture, acceptance criteria, implementation phases and review decisions.

**Codex — Implementation engineer**
Inspects the real codebase, implements approved phases, writes/updates tests, runs engineering checks and produces clean commits/reports.

Expected loop:

**Sam/child testing -> ChatGPT analysis/specification -> Codex implementation -> automated/local verification -> Sam tests the child journey -> next phase**

The goal is measurable product progress, not conversational activity.
