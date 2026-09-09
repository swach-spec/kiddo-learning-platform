export type GameTierId =
  | "novice"
  | "easy"
  | "intermediate"
  | "advanced"
  | "expert"
  | "master";

export type GameProgress = {
  gameId: string;
  playerId: string;
  gradeEntry: number;
  currentTier: GameTierId;
  wins: number;
  losses: number;
  attempts: number;
  masteryScore: number;
  highestTier: GameTierId;
};

export type GameTier = {
  id: GameTierId;
  name: string;
  unlockWins: number;
  description: string;
};
