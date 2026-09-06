import { Challenge } from "@/types/challenge";

// DEMO / FOUNDATION CONTENT — ARCHITECTURE PROOF ONLY.
//
// A single Mathematics challenge, deliberately alone. Its only job is to
// prove that the same `Challenge` shape, the same lookup function, and the
// same /challenge/[id] page that already serve English vocabulary practice
// can carry a different subject (subject, skill, grade, difficulty, xp all
// vary independently) with zero subject-specific branching anywhere in the
// rendering or persistence layers. This is not the start of a Maths
// curriculum — do not add more items here without a real content pass.
export const mathsChallenges: Challenge[] = [
  {
    id: "demo-number-sense-addition",
    subject: "mathematics",
    grade: 2,
    skill: "number_sense",
    prompt: "What is 3 + 4?",
    options: [
      { id: "a", text: "6" },
      { id: "b", text: "7" },
      { id: "c", text: "8" },
      { id: "d", text: "9" },
    ],
    correctOptionId: "b",
    explanation: "3 + 4 = 7. Try counting up from 3: 4, 5, 6, 7.",
    xp: 10,
    difficulty: 1,
  },
];
