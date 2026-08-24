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
  },
];

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