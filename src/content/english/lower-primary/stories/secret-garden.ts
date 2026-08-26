import { Story } from "@/types/content";

// PROVENANCE (Phase 1.1): HEAD contains only this catalogue entry — no
// scenes or questions exist anywhere in the repository for this story.
// See clever-tortoise.ts for the full note. scenes/questions are
// intentionally empty and status is "coming_soon" — not playable.
// unlocksAtLevel: 5 matches HEAD's literal "Unlock at Level 5" overlay
// text for this story (the only story HEAD marked unlocked: false).
export const secretGarden: Story = {
  id: "secret-garden",
  legacyId: 4,
  title: "The Secret Garden",
  description: "Something mysterious is waiting behind an old wooden gate.",
  subject: "english",
  grade: 3,
  gradeBand: "lower_primary",
  levelLabel: "Level 4",
  icon: "🌺",
  gradient: "from-pink-400 to-rose-600",
  estimatedMinutes: 8,
  xp: 180,
  unlocksAtLevel: 5,
  status: "coming_soon",
  scenes: [],
  questions: [],
};
