export type Grade2PracticeMode = "guided" | "independent" | "mastery";

export type Grade2PracticeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correct: string;
  explanation: string;
};

export const grade2GuidedQuestions: Grade2PracticeQuestion[] = [
  { id: "g2-g1", prompt: "Which word describes the bag? The bag is heavy.", options: ["bag", "heavy", "is", "the"], correct: "heavy", explanation: "Heavy tells us what the bag is like." },
  { id: "g2-g2", prompt: "Which word describes the flower? The yellow flower grew.", options: ["grew", "flower", "yellow", "the"], correct: "yellow", explanation: "Yellow tells us more about the flower." },
  { id: "g2-g3", prompt: "Choose a word that can describe a puppy.", options: ["play", "small", "puppy", "run"], correct: "small", explanation: "Small tells us what the puppy is like." },
  { id: "g2-g4", prompt: "Which word describes the road? We walked along a narrow road.", options: ["walked", "road", "narrow", "along"], correct: "narrow", explanation: "Narrow describes the road." },
  { id: "g2-g5", prompt: "Complete the sentence: Amina carried a ___ basket.", options: ["basket", "carefully", "large", "carry"], correct: "large", explanation: "Large describes the basket and makes the sentence clearer." },
  { id: "g2-g6", prompt: "Which sentence gives more information about the cat?", options: ["The cat sat.", "The cat sat on the mat.", "The small cat sat on the mat.", "Cat sat."], correct: "The small cat sat on the mat.", explanation: "Small gives us more information about the cat." },
  { id: "g2-g7", prompt: "Which word best completes this sentence? The children saw a ___ bird.", options: ["bright", "see", "bird", "saw"], correct: "bright", explanation: "Bright describes the bird." },
];

export const grade2IndependentQuestions: Grade2PracticeQuestion[] = [
  { id: "g2-i1", prompt: "Choose the describing word: The tall tree gave us shade.", options: ["tree", "gave", "tall", "shade"], correct: "tall", explanation: "Tall describes the tree." },
  { id: "g2-i2", prompt: "Complete the sentence: We found a ___ stone near the river.", options: ["smooth", "find", "stone", "near"], correct: "smooth", explanation: "Smooth describes the stone." },
  { id: "g2-i3", prompt: "Which sentence is clearer?", options: ["The dog chased the ball.", "The playful dog chased the red ball.", "Dog chased ball.", "The dog ball."], correct: "The playful dog chased the red ball.", explanation: "Playful and red add useful details." },
  { id: "g2-i4", prompt: "Which word describes the classroom? The clean classroom looked bright.", options: ["looked", "classroom", "clean", "bright"], correct: "clean", explanation: "Clean describes the classroom." },
  { id: "g2-i5", prompt: "Choose the best word: Musa wore a ___ shirt.", options: ["blue", "wear", "shirt", "wore"], correct: "blue", explanation: "Blue describes the shirt." },
  { id: "g2-i6", prompt: "Which word describes the mango? The ripe mango fell from the tree.", options: ["fell", "ripe", "mango", "tree"], correct: "ripe", explanation: "Ripe tells us more about the mango." },
  { id: "g2-i7", prompt: "Choose the sentence with a describing word.", options: ["The girl runs.", "The happy girl runs.", "The girl runs quickly.", "Run to school."], correct: "The happy girl runs.", explanation: "Happy describes the girl." },
];

export const grade2MasteryQuestions: Grade2PracticeQuestion[] = [
  { id: "g2-m1", prompt: "Which sentence uses a describing word correctly?", options: ["The noisy children played.", "The children noisy played.", "The noisy played children.", "Noisy the children played."], correct: "The noisy children played.", explanation: "Noisy comes before children and tells us what the children are like." },
  { id: "g2-m2", prompt: "Choose the best word: The farmer picked the ___ tomatoes.", options: ["ripe", "pick", "farmer", "picked"], correct: "ripe", explanation: "Ripe describes the tomatoes." },
  { id: "g2-m3", prompt: "Which sentence gives the clearest picture?", options: ["A bird sat.", "A bird sat on a branch.", "A small brown bird sat on a branch.", "Bird sat branch."], correct: "A small brown bird sat on a branch.", explanation: "Small and brown give the reader more information." },
  { id: "g2-m4", prompt: "Which word describes the market? The busy market was full of people.", options: ["busy", "market", "full", "people"], correct: "busy", explanation: "Busy describes the market." },
  { id: "g2-m5", prompt: "Choose the sentence that uses a describing word to improve the idea.", options: ["The rain fell.", "The heavy rain fell all night.", "The rain heavy fell.", "Heavy the rain fell."], correct: "The heavy rain fell all night.", explanation: "Heavy gives useful information about the rain." },
];

export const grade2CompositionPrompts = [
  { id: "c1", prompt: "Build a sentence about a puppy.", words: ["The", "small", "puppy", "runs"], answer: ["The", "small", "puppy", "runs"] },
  { id: "c2", prompt: "Build a sentence about a flower.", words: ["A", "red", "flower", "grows"], answer: ["A", "red", "flower", "grows"] },
  { id: "c3", prompt: "Build a sentence about a bag.", words: ["The", "heavy", "bag", "fell"], answer: ["The", "heavy", "bag", "fell"] },
];
