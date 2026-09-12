-- KIDDO Production Schema v1
-- Target: Supabase / PostgreSQL
-- Purpose: establish the production data foundation before connecting the app.
-- Do not run this migration against production until the RLS policies have been
-- reviewed in a real Supabase project with representative parent/admin accounts.

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------

do $$ begin
  create type public.family_status as enum ('active', 'suspended', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.family_member_role as enum ('owner', 'parent', 'guardian');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.child_status as enum ('active', 'paused', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.curriculum_node_type as enum ('strand', 'sub_strand', 'concept', 'learning_objective');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'active', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_type as enum (
    'story',
    'guided_practice',
    'independent_practice',
    'revision',
    'assessment',
    'game',
    'challenge'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.progress_state as enum ('not_started', 'learning', 'developing', 'secure', 'mastered');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.activity_progress_status as enum ('available', 'in_progress', 'completed', 'mastered', 'deprioritised');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.attempt_status as enum ('started', 'completed', 'abandoned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.mastery_state as enum ('needs_support', 'developing', 'secure', 'mastered');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.revision_status as enum ('active', 'mastered', 'paused');
exception when duplicate_object then null; end $$;

-- -----------------------------------------------------------------------------
-- COMMON UPDATED_AT TRIGGER
-- -----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- IDENTITY & FAMILY
-- -----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status public.family_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.family_member_role not null default 'parent',
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table if not exists public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  sort_order integer not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.child_profiles (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families(id) on delete cascade,
  display_name text not null,
  avatar text not null default '🧑🏾‍🚀',
  grade_id uuid not null references public.grades(id),
  status public.child_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- CURRICULUM
-- -----------------------------------------------------------------------------

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.curriculum_nodes (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid not null references public.grades(id),
  subject_id uuid not null references public.subjects(id),
  parent_id uuid references public.curriculum_nodes(id) on delete cascade,
  code text not null,
  name text not null,
  description text,
  node_type public.curriculum_node_type not null,
  sort_order integer not null default 0,
  curriculum_version text not null default '2026-KICD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (grade_id, subject_id, code, curriculum_version)
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_units (
  id uuid primary key default gen_random_uuid(),
  curriculum_node_id uuid not null references public.curriculum_nodes(id) on delete cascade,
  title text not null,
  description text,
  sequence integer not null default 0,
  estimated_duration_minutes integer,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  learning_unit_id uuid references public.learning_units(id) on delete set null,
  curriculum_node_id uuid references public.curriculum_nodes(id) on delete set null,
  type public.activity_type not null,
  title text not null,
  description text,
  difficulty smallint,
  estimated_duration_minutes integer,
  sequence integer not null default 0,
  version integer not null default 1,
  status public.content_status not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (difficulty is null or difficulty between 1 and 5),
  check (estimated_duration_minutes is null or estimated_duration_minutes > 0)
);

create table if not exists public.activity_skills (
  activity_id uuid not null references public.activities(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  weight numeric(6,3) not null default 1,
  primary key (activity_id, skill_id),
  check (weight > 0)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  question_type text not null,
  prompt text not null,
  explanation text,
  difficulty smallint,
  skill_id uuid references public.skills(id) on delete set null,
  curriculum_node_id uuid references public.curriculum_nodes(id) on delete set null,
  sort_order integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (difficulty is null or difficulty between 1 and 5)
);

create table if not exists public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_key text not null,
  text text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  unique (question_id, option_key)
);

-- -----------------------------------------------------------------------------
-- LEARNER STATE
-- -----------------------------------------------------------------------------

create table if not exists public.learner_progress (
  child_id uuid primary key references public.child_profiles(id) on delete cascade,
  current_subject_id uuid references public.subjects(id) on delete set null,
  current_curriculum_node_id uuid references public.curriculum_nodes(id) on delete set null,
  current_learning_unit_id uuid references public.learning_units(id) on delete set null,
  current_activity_id uuid references public.activities(id) on delete set null,
  state public.progress_state not null default 'not_started',
  progress_percent numeric(5,2) not null default 0,
  last_activity_at timestamptz,
  updated_at timestamptz not null default now(),
  check (progress_percent between 0 and 100)
);

create table if not exists public.activity_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  status public.activity_progress_status not null default 'available',
  completion_count integer not null default 0,
  best_score numeric(6,3),
  best_accuracy numeric(6,5),
  first_started_at timestamptz,
  last_started_at timestamptz,
  last_completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (child_id, activity_id),
  check (completion_count >= 0),
  check (best_accuracy is null or best_accuracy between 0 and 1)
);

create table if not exists public.skill_mastery (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  state public.mastery_state not null default 'developing',
  attempts integer not null default 0,
  correct_attempts integer not null default 0,
  accuracy numeric(6,5) not null default 0,
  hints_used integer not null default 0,
  average_response_time_ms integer,
  confidence_score numeric(6,5),
  first_seen_at timestamptz,
  last_practised_at timestamptz,
  last_mastered_at timestamptz,
  next_revision_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (child_id, skill_id),
  check (attempts >= 0),
  check (correct_attempts >= 0 and correct_attempts <= attempts),
  check (accuracy between 0 and 1),
  check (confidence_score is null or confidence_score between 0 and 1)
);

-- -----------------------------------------------------------------------------
-- EVIDENCE
-- -----------------------------------------------------------------------------

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_ms bigint,
  device_type text,
  app_version text,
  check (duration_ms is null or duration_ms >= 0)
);

create table if not exists public.activity_attempts (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  session_id uuid references public.sessions(id) on delete set null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  duration_ms bigint,
  status public.attempt_status not null default 'started',
  score numeric(6,3),
  accuracy numeric(6,5),
  attempt_number integer not null default 1,
  hints_used integer not null default 0,
  xp_awarded integer not null default 0,
  check (duration_ms is null or duration_ms >= 0),
  check (accuracy is null or accuracy between 0 and 1),
  check (attempt_number > 0),
  check (hints_used >= 0)
);

create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  activity_attempt_id uuid not null references public.activity_attempts(id) on delete cascade,
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer text,
  correct boolean,
  attempt_number integer not null default 1,
  response_time_ms integer,
  hints_used integer not null default 0,
  created_at timestamptz not null default now(),
  check (attempt_number > 0),
  check (response_time_ms is null or response_time_ms >= 0),
  check (hints_used >= 0)
);

-- -----------------------------------------------------------------------------
-- REVISION
-- -----------------------------------------------------------------------------

create table if not exists public.revision_items (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  curriculum_node_id uuid not null references public.curriculum_nodes(id) on delete cascade,
  source_activity_id uuid references public.activities(id) on delete set null,
  mastery_state public.mastery_state not null default 'developing',
  last_seen_at timestamptz,
  last_revised_at timestamptz,
  next_revision_at timestamptz,
  revision_interval_days integer not null default 1,
  revision_count integer not null default 0,
  status public.revision_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (child_id, skill_id, curriculum_node_id),
  check (revision_interval_days > 0),
  check (revision_count >= 0)
);

create table if not exists public.revision_attempts (
  id uuid primary key default gen_random_uuid(),
  revision_item_id uuid not null references public.revision_items(id) on delete cascade,
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  activity_attempt_id uuid references public.activity_attempts(id) on delete set null,
  correct boolean,
  accuracy numeric(6,5),
  response_time_ms integer,
  created_at timestamptz not null default now(),
  check (accuracy is null or accuracy between 0 and 1),
  check (response_time_ms is null or response_time_ms >= 0)
);

-- -----------------------------------------------------------------------------
-- GAMIFICATION
-- -----------------------------------------------------------------------------

create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  activity_attempt_id uuid references public.activity_attempts(id) on delete set null,
  amount integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  icon text,
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.learner_achievements (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.child_profiles(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (child_id, achievement_id)
);

create table if not exists public.streaks (
  child_id uuid primary key references public.child_profiles(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  updated_at timestamptz not null default now(),
  check (current_streak >= 0),
  check (longest_streak >= 0)
);

-- -----------------------------------------------------------------------------
-- ANALYTICS
-- -----------------------------------------------------------------------------

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.child_profiles(id) on delete set null,
  family_id uuid references public.families(id) on delete set null,
  session_id uuid references public.sessions(id) on delete set null,
  event_type text not null,
  entity_type text,
  entity_id text,
  occurred_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------

create index if not exists idx_family_members_user on public.family_members(user_id);
create index if not exists idx_family_members_family on public.family_members(family_id);
create index if not exists idx_child_profiles_family on public.child_profiles(family_id);
create index if not exists idx_child_profiles_grade on public.child_profiles(grade_id);
create index if not exists idx_curriculum_nodes_grade_subject on public.curriculum_nodes(grade_id, subject_id, sort_order);
create index if not exists idx_curriculum_nodes_parent on public.curriculum_nodes(parent_id);
create index if not exists idx_learning_units_node on public.learning_units(curriculum_node_id, sequence);
create index if not exists idx_activities_unit on public.activities(learning_unit_id, sequence);
create index if not exists idx_activities_node on public.activities(curriculum_node_id, sequence);
create index if not exists idx_questions_activity on public.questions(activity_id, sort_order);
create index if not exists idx_question_options_question on public.question_options(question_id, sort_order);
create index if not exists idx_learner_progress_activity on public.learner_progress(current_activity_id);
create index if not exists idx_activity_progress_child_status on public.activity_progress(child_id, status);
create index if not exists idx_activity_attempts_child_time on public.activity_attempts(child_id, started_at desc);
create index if not exists idx_activity_attempts_activity on public.activity_attempts(activity_id, started_at desc);
create index if not exists idx_question_attempts_child_time on public.question_attempts(child_id, created_at desc);
create index if not exists idx_question_attempts_question on public.question_attempts(question_id, created_at desc);
create index if not exists idx_skill_mastery_child_state on public.skill_mastery(child_id, state);
create index if not exists idx_revision_items_child_next on public.revision_items(child_id, next_revision_at);
create index if not exists idx_revision_attempts_child_time on public.revision_attempts(child_id, created_at desc);
create index if not exists idx_xp_transactions_child_time on public.xp_transactions(child_id, created_at desc);
create index if not exists idx_learner_achievements_child on public.learner_achievements(child_id, earned_at desc);
create index if not exists idx_sessions_child_time on public.sessions(child_id, started_at desc);
create index if not exists idx_events_child_time on public.events(child_id, occurred_at desc);
create index if not exists idx_events_family_time on public.events(family_id, occurred_at desc);
create index if not exists idx_events_type_time on public.events(event_type, occurred_at desc);
create index if not exists idx_events_entity on public.events(entity_type, entity_id);

-- -----------------------------------------------------------------------------
-- UPDATED_AT TRIGGERS
-- -----------------------------------------------------------------------------

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists trg_families_updated_at on public.families;
create trigger trg_families_updated_at before update on public.families for each row execute function public.set_updated_at();

drop trigger if exists trg_child_profiles_updated_at on public.child_profiles;
create trigger trg_child_profiles_updated_at before update on public.child_profiles for each row execute function public.set_updated_at();

drop trigger if exists trg_curriculum_nodes_updated_at on public.curriculum_nodes;
create trigger trg_curriculum_nodes_updated_at before update on public.curriculum_nodes for each row execute function public.set_updated_at();

drop trigger if exists trg_skills_updated_at on public.skills;
create trigger trg_skills_updated_at before update on public.skills for each row execute function public.set_updated_at();

drop trigger if exists trg_learning_units_updated_at on public.learning_units;
create trigger trg_learning_units_updated_at before update on public.learning_units for each row execute function public.set_updated_at();

drop trigger if exists trg_activities_updated_at on public.activities;
create trigger trg_activities_updated_at before update on public.activities for each row execute function public.set_updated_at();

drop trigger if exists trg_learner_progress_updated_at on public.learner_progress;
create trigger trg_learner_progress_updated_at before update on public.learner_progress for each row execute function public.set_updated_at();

drop trigger if exists trg_activity_progress_updated_at on public.activity_progress;
create trigger trg_activity_progress_updated_at before update on public.activity_progress for each row execute function public.set_updated_at();

drop trigger if exists trg_skill_mastery_updated_at on public.skill_mastery;
create trigger trg_skill_mastery_updated_at before update on public.skill_mastery for each row execute function public.set_updated_at();

drop trigger if exists trg_revision_items_updated_at on public.revision_items;
create trigger trg_revision_items_updated_at before update on public.revision_items for each row execute function public.set_updated_at();

drop trigger if exists trg_streaks_updated_at on public.streaks;
create trigger trg_streaks_updated_at before update on public.streaks for each row execute function public.set_updated_at();

-- -----------------------------------------------------------------------------
-- AUTH HELPERS
-- These functions are intentionally SECURITY DEFINER so RLS checks can inspect
-- membership/admin tables without recursive policy evaluation.
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = auth.uid()
  );
$$;

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.family_members fm
      where fm.family_id = target_family_id
        and fm.user_id = auth.uid()
    );
$$;

create or replace function public.is_family_owner(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.family_members fm
      where fm.family_id = target_family_id
        and fm.user_id = auth.uid()
        and fm.role = 'owner'
    );
$$;

create or replace function public.can_access_child(target_child_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_admin()
    or exists (
      select 1
      from public.child_profiles cp
      join public.family_members fm on fm.family_id = cp.family_id
      where cp.id = target_child_id
        and fm.user_id = auth.uid()
    );
$$;

-- -----------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- -----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.admin_users enable row level security;
alter table public.grades enable row level security;
alter table public.subjects enable row level security;
alter table public.child_profiles enable row level security;
alter table public.curriculum_nodes enable row level security;
alter table public.skills enable row level security;
alter table public.learning_units enable row level security;
alter table public.activities enable row level security;
alter table public.activity_skills enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.learner_progress enable row level security;
alter table public.activity_progress enable row level security;
alter table public.skill_mastery enable row level security;
alter table public.sessions enable row level security;
alter table public.activity_attempts enable row level security;
alter table public.question_attempts enable row level security;
alter table public.revision_items enable row level security;
alter table public.revision_attempts enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.achievements enable row level security;
alter table public.learner_achievements enable row level security;
alter table public.streaks enable row level security;
alter table public.events enable row level security;

-- Profiles

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles for insert with check (id = auth.uid() or public.is_admin());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- Families

drop policy if exists families_select_member on public.families;
create policy families_select_member on public.families for select using (public.is_family_member(id));
drop policy if exists families_insert_admin on public.families;
create policy families_insert_admin on public.families for insert with check (public.is_admin());
drop policy if exists families_update_owner on public.families;
create policy families_update_owner on public.families for update using (public.is_family_owner(id)) with check (public.is_family_owner(id));

-- Family members

drop policy if exists family_members_select_same_family on public.family_members;
create policy family_members_select_same_family on public.family_members for select using (public.is_family_member(family_id));
drop policy if exists family_members_insert_owner on public.family_members;
create policy family_members_insert_owner on public.family_members for insert with check (public.is_family_owner(family_id));
drop policy if exists family_members_update_owner on public.family_members;
create policy family_members_update_owner on public.family_members for update using (public.is_family_owner(family_id)) with check (public.is_family_owner(family_id));
drop policy if exists family_members_delete_owner on public.family_members;
create policy family_members_delete_owner on public.family_members for delete using (public.is_family_owner(family_id));

-- Admin users: only admins can inspect/change the table.
drop policy if exists admin_users_select_admin on public.admin_users;
create policy admin_users_select_admin on public.admin_users for select using (public.is_admin() or user_id = auth.uid());
drop policy if exists admin_users_insert_admin on public.admin_users;
create policy admin_users_insert_admin on public.admin_users for insert with check (public.is_admin());
drop policy if exists admin_users_delete_admin on public.admin_users;
create policy admin_users_delete_admin on public.admin_users for delete using (public.is_admin());

-- Children

drop policy if exists child_profiles_select_family on public.child_profiles;
create policy child_profiles_select_family on public.child_profiles for select using (public.is_family_member(family_id));
drop policy if exists child_profiles_insert_family on public.child_profiles;
create policy child_profiles_insert_family on public.child_profiles for insert with check (public.is_family_owner(family_id));
drop policy if exists child_profiles_update_family on public.child_profiles;
create policy child_profiles_update_family on public.child_profiles for update using (public.is_family_member(family_id)) with check (public.is_family_member(family_id));
drop policy if exists child_profiles_delete_owner on public.child_profiles;
create policy child_profiles_delete_owner on public.child_profiles for delete using (public.is_family_owner(family_id));

-- Curriculum/content is readable to authenticated users; only platform admins mutate it.

drop policy if exists grades_read_authenticated on public.grades;
create policy grades_read_authenticated on public.grades for select to authenticated using (true);
drop policy if exists grades_admin_write on public.grades;
create policy grades_admin_write on public.grades for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists subjects_read_authenticated on public.subjects;
create policy subjects_read_authenticated on public.subjects for select to authenticated using (true);
drop policy if exists subjects_admin_write on public.subjects;
create policy subjects_admin_write on public.subjects for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Repeated content policy pattern, kept explicit for auditability.
drop policy if exists curriculum_nodes_read_authenticated on public.curriculum_nodes;
create policy curriculum_nodes_read_authenticated on public.curriculum_nodes for select to authenticated using (true);
drop policy if exists curriculum_nodes_admin_write on public.curriculum_nodes;
create policy curriculum_nodes_admin_write on public.curriculum_nodes for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists skills_read_authenticated on public.skills;
create policy skills_read_authenticated on public.skills for select to authenticated using (true);
drop policy if exists skills_admin_write on public.skills;
create policy skills_admin_write on public.skills for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists learning_units_read_authenticated on public.learning_units;
create policy learning_units_read_authenticated on public.learning_units for select to authenticated using (true);
drop policy if exists learning_units_admin_write on public.learning_units;
create policy learning_units_admin_write on public.learning_units for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists activities_read_authenticated on public.activities;
create policy activities_read_authenticated on public.activities for select to authenticated using (true);
drop policy if exists activities_admin_write on public.activities;
create policy activities_admin_write on public.activities for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists activity_skills_read_authenticated on public.activity_skills;
create policy activity_skills_read_authenticated on public.activity_skills for select to authenticated using (true);
drop policy if exists activity_skills_admin_write on public.activity_skills;
create policy activity_skills_admin_write on public.activity_skills for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists questions_read_authenticated on public.questions;
create policy questions_read_authenticated on public.questions for select to authenticated using (true);
drop policy if exists questions_admin_write on public.questions;
create policy questions_admin_write on public.questions for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists question_options_read_authenticated on public.question_options;
create policy question_options_read_authenticated on public.question_options for select to authenticated using (true);
drop policy if exists question_options_admin_write on public.question_options;
create policy question_options_admin_write on public.question_options for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Learner data: family-scoped.
drop policy if exists learner_progress_family_access on public.learner_progress;
create policy learner_progress_family_access on public.learner_progress for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists activity_progress_family_access on public.activity_progress;
create policy activity_progress_family_access on public.activity_progress for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists skill_mastery_family_access on public.skill_mastery;
create policy skill_mastery_family_access on public.skill_mastery for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists sessions_family_access on public.sessions;
create policy sessions_family_access on public.sessions for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists activity_attempts_family_access on public.activity_attempts;
create policy activity_attempts_family_access on public.activity_attempts for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists question_attempts_family_access on public.question_attempts;
create policy question_attempts_family_access on public.question_attempts for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists revision_items_family_access on public.revision_items;
create policy revision_items_family_access on public.revision_items for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists revision_attempts_family_access on public.revision_attempts;
create policy revision_attempts_family_access on public.revision_attempts for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists xp_transactions_family_access on public.xp_transactions;
create policy xp_transactions_family_access on public.xp_transactions for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists learner_achievements_family_access on public.learner_achievements;
create policy learner_achievements_family_access on public.learner_achievements for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

drop policy if exists streaks_family_access on public.streaks;
create policy streaks_family_access on public.streaks for all using (public.can_access_child(child_id)) with check (public.can_access_child(child_id));

-- Achievements are readable by authenticated users; admins manage definitions.
drop policy if exists achievements_read_authenticated on public.achievements;
create policy achievements_read_authenticated on public.achievements for select to authenticated using (true);
drop policy if exists achievements_admin_write on public.achievements;
create policy achievements_admin_write on public.achievements for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Events are family-scoped. Admins can see all events.
drop policy if exists events_family_access on public.events;
create policy events_family_access on public.events for all using (
  public.is_admin() or (family_id is not null and public.is_family_member(family_id))
) with check (
  public.is_admin() or (family_id is not null and public.is_family_member(family_id))
);

-- -----------------------------------------------------------------------------
-- SEED: GRADES, SUBJECTS, CORE SKILLS
-- -----------------------------------------------------------------------------

insert into public.grades (code, name, sort_order) values
  ('G1', 'Grade 1', 1),
  ('G2', 'Grade 2', 2),
  ('G3', 'Grade 3', 3),
  ('G4', 'Grade 4', 4),
  ('G5', 'Grade 5', 5),
  ('G6', 'Grade 6', 6)
on conflict (code) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.subjects (code, name) values
  ('ENG', 'English'),
  ('MAT', 'Mathematics')
on conflict (code) do update set name = excluded.name;

insert into public.skills (code, name, description) values
  ('reading', 'Reading', 'Reading fluency and comprehension.'),
  ('grammar', 'Grammar', 'Correct and meaningful use of language structures.'),
  ('spelling', 'Spelling', 'Accurate spelling and word formation.'),
  ('vocabulary', 'Vocabulary', 'Understanding and using words in context.'),
  ('numeracy', 'Numeracy', 'Number sense and mathematical reasoning.'),
  ('calculation', 'Calculation', 'Accurate mathematical computation.'),
  ('problem_solving', 'Problem Solving', 'Applying mathematics to unfamiliar or practical situations.'),
  ('measurement', 'Measurement', 'Using units, instruments and measurement concepts.')
on conflict (code) do update set
  name = excluded.name,
  description = excluded.description;

-- -----------------------------------------------------------------------------
-- NOTES
-- -----------------------------------------------------------------------------
-- 1. This migration deliberately does not create a password/account system.
--    Supabase Auth owns authentication; public.profiles stores app profile data.
-- 2. Child profiles are family-owned learner identities in v1. Child login/PIN
--    can be introduced later without redesigning learner data ownership.
-- 3. Curriculum version is stored on curriculum_nodes so historical learner
--    evidence can remain tied to the curriculum version used at the time.
-- 4. Events intentionally use text entity_id because current prototype IDs are
--    strings and analytics should not depend on every event referring to a UUID.
-- 5. Activity repetition/deprioritisation is represented by activity_progress;
--    the exact product rule will be implemented in the application/learning
--    engine after the persistent repository layer is in place.
-- 6. The next migration should add server-side transaction functions for
--    recording activity evidence atomically: attempt + question attempts +
--    mastery + progress + XP + event + revision updates.
