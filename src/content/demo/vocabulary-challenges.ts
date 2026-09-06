import { Challenge } from "@/types/challenge";

// DEMO / FOUNDATION CONTENT
//
// This small, independently authored challenge bank demonstrates the
// vocabulary targeting model. It is intentionally not exported through the
// Story catalogue and must not be treated as story content.
export const vocabularyChallenges: Challenge[] = [
  {
    id: "demo-adjective-describing-word",
    subject: "english",
    grade: 2,
    skill: "vocabulary",
    partOfSpeech: "adjective",
    prompt: "Which word is an adjective in this sentence: The tiny bird sang?",
    options: [
      { id: "a", text: "tiny" },
      { id: "b", text: "bird" },
      { id: "c", text: "sang" },
      { id: "d", text: "the" },
    ],
    correctOptionId: "a",
    explanation: "Tiny is an adjective because it describes the bird.",
    xp: 10,
    difficulty: 1,
  },
  {
    id: "demo-noun-naming-word",
    subject: "english",
    grade: 2,
    skill: "vocabulary",
    partOfSpeech: "noun",
    prompt: "Which word is a noun in this sentence: A teacher smiles?",
    options: [
      { id: "a", text: "A" },
      { id: "b", text: "teacher" },
      { id: "c", text: "smiles" },
      { id: "d", text: "Which" },
    ],
    correctOptionId: "b",
    explanation: "Teacher is a noun because it names a person.",
    xp: 10,
    difficulty: 1,
  },
  {
    id: "demo-verb-action-word",
    subject: "english",
    grade: 2,
    skill: "vocabulary",
    partOfSpeech: "verb",
    prompt: "Which word is a verb in this sentence: Children jump outside?",
    options: [
      { id: "a", text: "Children" },
      { id: "b", text: "jump" },
      { id: "c", text: "outside" },
      { id: "d", text: "Which" },
    ],
    correctOptionId: "b",
    explanation: "Jump is a verb because it tells what the children do.",
    xp: 10,
    difficulty: 1,
  },
];
