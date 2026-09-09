export type GameTierId =
  | "novice"
  | "easy"
  | "intermediate"
  | "advanced"
  | "expert"
  | "master";

export type TierStats = {
  wins: number;
  losses: number;
  attempts: number;
  masteryScore: number;
};

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
  tierStats: Partial<Record<GameTierId, TierStats>>;
};

export type GameTier = {
  id: GameTierId;
  name: string;
  unlockWins: number;
  masteryRequired: number;
  description: string;
};
