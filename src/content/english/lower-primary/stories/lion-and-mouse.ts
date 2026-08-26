import { Story } from "@/types/content";

// PROVENANCE (Phase 1.1): HEAD contains only this catalogue entry — no
// scenes or questions exist anywhere in the repository for this story.
// See clever-tortoise.ts for the full note. scenes/questions are
// intentionally empty and status is "coming_soon" — not playable.
export const lionAndMouse: Story = {
  id: "lion-and-mouse",
  legacyId: 3,
  title: "The Lion and the Mouse",
  description:
    "Discover how even the smallest friend can make a big difference.",
  subject: "english",
  grade: 3,
  gradeBand: "lower_primary",
  levelLabel: "Level 3",
  icon: "🦁",
  gradient: "from-orange-400 to-amber-600",
  estimatedMinutes: 7,
  xp: 150,
  unlocksAtLevel: 1,
  status: "coming_soon",
  scenes: [],
  questions: [],
};
