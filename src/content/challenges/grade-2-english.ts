import { Challenge } from "@/types/challenge";

const make = (id: string, prompt: string, options: [string, string][], correct: string, explanation: string): Challenge => ({
  id, subject: "english", grade: 2, skill: "grammar", prompt, options: options.map(([id, label]) => ({ id, label })), correctOptionId: correct, explanation, xp: 10, difficulty: 1, curriculumId: "g2-describing-words", strand: "Reading", subStrand: "Language Patterns and Comprehension", concept: "describing words", activityType: "guided_practice",
});

export const grade2DescribingGuided: Challenge[] = [
  make("g2-guided-1", "Which word tells us more about the bag? Amina has a red bag.", [["a","red"],["b","has"]], "a", "Red tells us what the bag is like."),
  make("g2-guided-2", "Choose the best word: The mango is ___.", [["a","sweet"],["b","runs"]], "a", "Sweet tells us about the mango."),
  make("g2-guided-3", "Which sentence uses a describing word?", [["a","The small dog runs."],["b","The dog runs." ]], "a", "Small tells us more about the dog."),
  make("g2-guided-4", "Pick the word that best describes the house: The house is ___.", [["a","big"],["b","eats"]], "a", "Big tells us about the house."),
  make("g2-guided-5", "Which word describes the flower? The yellow flower grows.", [["a","yellow"],["b","grows"]], "a", "Yellow tells us the colour of the flower."),
  make("g2-guided-6", "Complete the sentence: We saw a ___ bird.", [["a","blue"],["b","jumps"]], "a", "Blue describes the bird."),
  make("g2-guided-7", "Which pair has two describing words?", [["a","small, green"],["b","run, jump"]], "a", "Small and green both tell us more about something."),
];

export const grade2DescribingIndependent: Challenge[] = [
  make("g2-independent-1", "Which word best completes: The boy carried a ___ box.", [["a","heavy"],["b","carries"]], "a", "Heavy describes the box."),
  make("g2-independent-2", "Which sentence gives more information?", [["a","I saw a tall tree."],["b","I saw a tree."]], "a", "Tall gives more information about the tree."),
  make("g2-independent-3", "Choose the describing word: The clean room looked nice.", [["a","clean"],["b","looked"]], "a", "Clean tells us about the room."),
  make("g2-independent-4", "Complete: The little girl wore a ___ dress.", [["a","beautiful"],["b","walked"]], "a", "Beautiful describes the dress."),
  make("g2-independent-5", "Which word describes the road? The narrow road was busy.", [["a","narrow"],["b","busy"]], "a", "Narrow describes the road; busy tells us about it too, but the question asks for the road word before it."),
  make("g2-independent-6", "Which sentence is better for describing a ball?", [["a","I have a round red ball."],["b","I have a ball."]], "a", "Round and red add useful information."),
  make("g2-independent-7", "Choose the best word: The soup was ___.", [["a","hot"],["b","cooked"]], "a", "Hot tells us what the soup was like."),
];

export const grade2SentenceBuilder: Challenge[] = [
  make("g2-sentence-1", "Which sentence is correct?", [["a","The small cat sleeps."],["b","The cat small sleeps."]], "a", "The describing word comes before the naming word."),
  make("g2-sentence-2", "Which sentence describes the tree correctly?", [["a","The tall green tree grows."],["b","The tree tall green grows."]], "a", "Tall and green come before tree in this simple sentence."),
  make("g2-sentence-3", "Choose the best sentence about a mango.", [["a","The sweet mango is ripe."],["b","The mango sweet is ripe."]], "a", "Sweet describes mango and fits the sentence pattern."),
  make("g2-sentence-4", "Choose the correct order.", [["a","A small brown dog ran."],["b","A dog small brown ran."]], "a", "Small and brown come before dog."),
  make("g2-sentence-5", "Which sentence gives a clear description?", [["a","The bright yellow flower opened."],["b","The flower bright yellow opened."]], "a", "The describing words are placed naturally before the naming word."),
];
