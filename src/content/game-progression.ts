import { GameTier, GameTierId } from "@/types/game-progress";

export const GAME_TIERS: GameTier[] = [
  {
    id: "novice",
    name: "Novice",
    unlockWins: 0,
    masteryRequired: 0,
    description: "Learn the basics and build confidence.",
  },
  {
    id: "easy",
    name: "Easy",
    unlockWins: 2,
    masteryRequired: 60,
    description: "A gentle challenge with more decisions to make.",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    unlockWins: 3,
    masteryRequired: 70,
    description: "Use stronger strategy and make fewer mistakes.",
  },
  {
    id: "advanced",
    name: "Advanced",
    unlockWins: 4,
    masteryRequired: 75,
    description: "Think ahead and handle more demanding challenges.",
  },
  {
    id: "expert",
    name: "Expert",
    unlockWins: 5,
    masteryRequired: 80,
    description: "High-level challenges for confident players.",
  },
  {
    id: "master",
    name: "Master",
    unlockWins: 6,
    masteryRequired: 90,
    description: "The ultimate KIDDO challenge.",
  },
];

// Default educational entry point. Individual games can override this when
// their rules/content need a different starting challenge for a grade.
export const DEFAULT_GRADE_ENTRY_TIERS: Record<number, GameTierId> = {
  1: "novice",
  2: "novice",
  3: "easy",
  4: "intermediate",
  5: "advanced",
  6: "expert",
};

export const GAME_GRADE_ENTRY_TIERS: Record<string, Partial<Record<number, GameTierId>>> = {
  "memory-match-v1": {
    1: "novice",
    2: "novice",
    3: "easy",
    4: "intermediate",
    5: "advanced",
    6: "expert",
  },
  "checkers-v1": {
    1: "novice",
    2: "novice",
    3: "easy",
    4: "intermediate",
    5: "advanced",
    6: "expert",
  },
  "word-builder-v1": {
    1: "novice",
    2: "novice",
    3: "easy",
    4: "intermediate",
    5: "advanced",
    6: "expert",
  },
};
