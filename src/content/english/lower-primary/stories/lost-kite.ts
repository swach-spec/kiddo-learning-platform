import { Story } from "@/types/content";

export const lostKite: Story = {
  id: "lost-kite",
  legacyId: 1,
  title: "The Lost Kite",
  description: "Help Tom discover where his favourite red kite has gone.",
  subject: "english",
  grade: 2,
  gradeBand: "lower_primary",
  levelLabel: "Level 2",
  icon: "🪁",
  gradient: "from-sky-400 to-blue-600",
  estimatedMinutes: 5,
  // Restored to HEAD's original catalogue value (100). NOTE: HEAD's
  // reader hardcoded +20 XP per correct answer × 3 questions = 60
  // maximum achievable — the 100 badge and the 60 achievable max were
  // already inconsistent in the original app. Phase 1 silently changed
  // this badge to 60 to "fix" that; Phase 1.1 reverts it since altering
  // catalogue XP wasn't authorized. Flagging the pre-existing mismatch
  // here rather than silently resolving it either direction.
  xp: 100,
  unlocksAtLevel: 1,
  status: "ready",
  scenes: [
    {
      id: "scene-1",
      text: "Tom woke up early on Saturday morning. He looked outside and saw that the sky was bright and blue. It was a perfect day to fly his favourite red kite.",
      illustration: "☀️🪁",
    },
    {
      id: "scene-2",
      text: "Tom ran to the field behind his house. The wind was gentle at first, and his kite rose higher and higher. Tom smiled as he watched it dance in the sky.",
      illustration: "🧒🏾🪁🌳",
    },
    {
      id: "scene-3",
      text: "Suddenly, a strong wind blew across the field. The kite flew over the fence and disappeared behind some trees. Tom decided to follow it and see where it had landed.",
      illustration: "💨🪁🌳",
    },
  ],
  questions: [
    {
      id: "q1",
      prompt: "What colour was Tom's kite?",
      options: [
        { id: "a", text: "Blue" },
        { id: "b", text: "Green" },
        { id: "c", text: "Red" },
        { id: "d", text: "Yellow" },
      ],
      correctOptionId: "c",
      explanation: "The story tells us that Tom's favourite kite was red.",
      skills: ["reading_comprehension", "vocabulary"],
      word: "red",
      partOfSpeech: "adjective",
      xp: 20,
    },
    {
      id: "q2",
      prompt: "Where did Tom fly his kite?",
      options: [
        { id: "a", text: "At school" },
        { id: "b", text: "In the field behind his house" },
        { id: "c", text: "At the beach" },
        { id: "d", text: "In the forest" },
      ],
      correctOptionId: "b",
      explanation: "Tom ran to the field behind his house.",
      skills: ["reading_comprehension"],
      xp: 20,
    },
    {
      id: "q3",
      prompt: "Why did the kite fly over the fence?",
      options: [
        { id: "a", text: "Tom pulled it" },
        { id: "b", text: "A bird carried it" },
        { id: "c", text: "The kite broke" },
        { id: "d", text: "A strong wind blew it" },
      ],
      correctOptionId: "d",
      explanation: "A strong wind blew the kite over the fence.",
      skills: ["reading_comprehension"],
      xp: 20,
    },
  ],
};
