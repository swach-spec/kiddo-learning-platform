import { GameTier } from "@/types/game-progress";

export const GAME_TIERS: GameTier[] = [
  {
    id: "novice",
    name: "Novice",
    unlockWins: 0,
    description: "Learn the basics and build confidence.",
  },
  {
    id: "easy",
    name: "Easy",
    unlockWins: 3,
    description: "A gentle challenge with more decisions to make.",
  },
  {
    id: "intermediate",
    name: "Intermediate",
    unlockWins: 6,
    description: "Use stronger strategy and make fewer mistakes.",
  },
  {
    id: "advanced",
    name: "Advanced",
    unlockWins: 10,
    description: "Think ahead and handle more demanding challenges.",
  },
  {
    id: "expert",
    name: "Expert",
    unlockWins: 15,
    description: "High-level challenges for confident players.",
  },
  {
    id: "master",
    name: "Master",
    unlockWins: 25,
    description: "The ultimate KIDDO challenge.",
  },
];

export const GRADE_ENTRY_TIERS: Record<number, GameTier["id"]> = {
  1: "novice",
  2: "novice",
  3: "easy",
  4: "intermediate",
  5: "advanced",
  6: "expert",
};
