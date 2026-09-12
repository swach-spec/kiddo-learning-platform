import { Challenge } from "@/types/challenge";

const make = (id: string, prompt: string, a: string, b: string, correct: string, explanation: string, activityType = "guided_practice"): Challenge => ({ id, subject: "english", grade: 2, skill: "grammar", prompt, options: [{ id: "a", text: a }, { id: "b", text: b }], correctOptionId: correct, explanation, xp: 10, difficulty: activityType === "mastery" ? 3 : activityType === "independent_practice" ? 2 : 1, curriculumId: "g2-describing-words", strand: "Reading", subStrand: "Language Patterns and Comprehension", concept: "describing words", activityType });

export const grade2DescribingGuided: Challenge[] = [
  make("g2-guided-1", "Which word tells us more about the bag? Amina has a red bag.", "red", "has", "a", "Red tells us what the bag is like."),
  make("g2-guided-2", "Choose the best word: The mango is ___.", "sweet", "runs", "a", "Sweet tells us about the mango."),
  make("g2-guided-3", "Which sentence uses a describing word?", "The small dog runs.", "The dog runs.", "a", "Small tells us more about the dog."),
  make("g2-guided-4", "The house is ___.", "big", "eats", "a", "Big tells us about the house."),
  make("g2-guided-5", "Which word describes the flower? The yellow flower grows.", "yellow", "grows", "a", "Yellow tells us about the flower."),
  make("g2-guided-6", "Complete: We saw a ___ bird.", "blue", "jumps", "a", "Blue describes the bird."),
  make("g2-guided-7", "Which pair has two describing words?", "small, green", "run, jump", "a", "Small and green both tell us more about something."),
];

export const grade2DescribingIndependent: Challenge[] = [
  make("g2-independent-1", "The boy carried a ___ box.", "heavy", "carries", "a", "Heavy describes the box.", "independent_practice"),
  make("g2-independent-2", "Which sentence gives more information?", "I saw a tall tree.", "I saw a tree.", "a", "Tall gives more information about the tree.", "independent_practice"),
  make("g2-independent-3", "Choose the describing word: The clean room looked nice.", "clean", "looked", "a", "Clean tells us about the room.", "independent_practice"),
  make("g2-independent-4", "The little girl wore a ___ dress.", "beautiful", "walked", "a", "Beautiful describes the dress.", "independent_practice"),
  make("g2-independent-5", "Which word describes the road? The narrow road was busy.", "narrow", "busy", "a", "Both describe the road; narrow is the intended focus word.", "independent_practice"),
  make("g2-independent-6", "Which sentence is better for describing a ball?", "I have a round red ball.", "I have a ball.", "a", "Round and red add useful information.", "independent_practice"),
  make("g2-independent-7", "The soup was ___.", "hot", "cooked", "a", "Hot tells us what the soup was like.", "independent_practice"),
];

export const grade2SentenceBuilder: Challenge[] = [
  make("g2-sentence-1", "Which sentence is correct?", "The small cat sleeps.", "The cat small sleeps.", "a", "The describing word comes before the naming word.", "independent_practice"),
  make("g2-sentence-2", "Which sentence describes the tree correctly?", "The tall green tree grows.", "The tree tall green grows.", "a", "Tall and green come before tree in this simple sentence.", "independent_practice"),
  make("g2-sentence-3", "Choose the best sentence about a mango.", "The sweet mango is ripe.", "The mango sweet is ripe.", "a", "Sweet describes mango and fits the sentence pattern.", "independent_practice"),
  make("g2-sentence-4", "Choose the correct order.", "A small brown dog ran.", "A dog small brown ran.", "a", "Small and brown come before dog.", "independent_practice"),
  make("g2-sentence-5", "Which sentence gives a clear description?", "The bright yellow flower opened.", "The flower bright yellow opened.", "a", "The describing words are placed naturally before the naming word.", "independent_practice"),
];
