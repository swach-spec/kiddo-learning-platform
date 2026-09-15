import { Challenge } from "@/types/challenge";

const make = (id: string, prompt: string, options: string[], correct: number, explanation: string): Challenge => ({
  id,
  subject: "english",
  grade: 2,
  skill: "grammar",
  prompt,
  options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
  correctOptionId: String.fromCharCode(97 + correct),
  explanation,
  xp: 5,
  difficulty: 1,
  curriculumId: "g2-describing-words",
  strand: "Reading",
  subStrand: "Language Patterns and Comprehension",
  concept: "describing words",
  activityType: "guided_practice",
});

export const grade2DescribingSupport: Challenge[] = [
  make("g2-support-1", "Which word tells us more about the ball? The red ball bounced.", ["red", "ball", "bounced"], 0, "Red tells us what colour the ball is."),
  make("g2-support-2", "Which word tells us more about the dog? The big dog barked.", ["big", "dog", "barked"], 0, "Big tells us about the size of the dog."),
  make("g2-support-3", "Complete the sentence: The ___ mango was sweet.", ["yellow", "ate", "mango"], 0, "Yellow gives us more information about the mango."),
  make("g2-support-4", "Which word describes the girl? The happy girl smiled.", ["happy", "girl", "smiled"], 0, "Happy tells us how the girl felt."),
  make("g2-support-5", "Which sentence gives more information?", ["The small cat slept.", "The cat slept.", "The cat."], 0, "Small gives us more information about the cat."),
  make("g2-support-6", "Choose the describing word: We saw a tall tree.", ["tall", "saw", "tree"], 0, "Tall tells us about the tree."),
];
