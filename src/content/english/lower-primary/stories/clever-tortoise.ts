import { Story } from "@/types/content";

// PROVENANCE (Phase 1.1): HEAD (git show HEAD:src/app/story/page.tsx)
// contains only this catalogue entry — no scenes or questions exist
// anywhere in the repository for this story. Phase 1 had fabricated
// narrative/quiz content here; Phase 1.1 removes it per the "no
// fabrication" rule. Only the fields verified from HEAD's catalogue
// object (title, description, icon, gradient, level label, time, xp,
// unlocked) are populated below. scenes/questions are intentionally
// empty and status is "coming_soon" — this story is not playable.
export const cleverTortoise: Story = {
  id: "clever-tortoise",
  legacyId: 2,
  title: "The Clever Tortoise",
  description: "A clever tortoise discovers that patience can be powerful.",
  subject: "english",
  grade: 2,
  gradeBand: "lower_primary",
  levelLabel: "Level 2",
  icon: "🐢",
  gradient: "from-emerald-400 to-green-600",
  estimatedMinutes: 6,
  xp: 120,
  unlocksAtLevel: 1,
  status: "coming_soon",
  scenes: [],
  questions: [],
};
