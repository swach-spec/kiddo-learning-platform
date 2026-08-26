export type Player = {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  level: number;
  xp: number;
  streak: number;
  storiesCompleted: number;
  badges: number;
  /** Ids of stories this player has finished (used to derive Story Forest progress and unlocks). */
  completedStoryIds: string[];
};

export const defaultPlayers: Player[] = [
  {
    id: "sam",
    name: "Sam",
    avatar: "🧑🏾‍🚀",
    grade: "Grade 3",
    level: 4,
    xp: 1240,
    streak: 7,
    storiesCompleted: 18,
    badges: 6,
    completedStoryIds: [],
  },
  {
    id: "jane",
    name: "Jane",
    avatar: "👧🏾‍🚀",
    grade: "Grade 2",
    level: 3,
    xp: 820,
    streak: 5,
    storiesCompleted: 11,
    badges: 4,
    completedStoryIds: [],
  },
  {
    id: "trevor",
    name: "Trevor",
    avatar: "👦🏾‍🚀",
    grade: "Grade 1",
    level: 2,
    xp: 430,
    streak: 3,
    storiesCompleted: 6,
    badges: 2,
    completedStoryIds: [],
  },
];

// NOTE (Phase 1.1): getLevelFromXP(1240) actually returns 5, not Sam's
// stored level of 4 — this discrepancy exists in the original HEAD data
// too (level was authored as a literal, not derived). Phase 1.1
// deliberately leaves these seed values untouched rather than "fixing"
// them, per the instruction not to alter existing learner state without
// explicit approval. Level is treated as persisted state that this
// formula recalculates prospectively when XP changes (see
// lib/player.ts#awardXP) — never retroactively on read.
export function getLevelFromXP(xp: number) {
  return Math.floor(xp / 300) + 1;
}

export function getXPIntoLevel(xp: number) {
  const level = getLevelFromXP(xp);
  const previousLevelXP = (level - 1) * 300;

  return xp - previousLevelXP;
}

export function getXPForNextLevel(xp: number) {
  const level = getLevelFromXP(xp);

  return level * 300;
}

export function getLevelProgress(xp: number) {
  const level = getLevelFromXP(xp);
  const previousLevelXP = (level - 1) * 300;
  const nextLevelXP = level * 300;

  return (
    ((xp - previousLevelXP) /
      (nextLevelXP - previousLevelXP)) *
    100
  );
}
