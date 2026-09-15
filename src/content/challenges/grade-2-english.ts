import { Challenge } from "@/types/challenge";

const make = (id: string, prompt: string, options: string[], correct: number, explanation: string, activityType = "guided_practice"): Challenge => ({
  id,
  subject: "english",
  grade: 2,
  skill: "grammar",
  prompt,
  options: options.map((text, index) => ({ id: String.fromCharCode(97 + index), text })),
  correctOptionId: String.fromCharCode(97 + correct),
  explanation,
  xp: 10,
  difficulty: activityType === "mastery" ? 3 : activityType === "independent_practice" ? 2 : 1,
  curriculumId: "g2-describing-words",
  strand: "Reading",
  subStrand: "Language Patterns and Comprehension",
  concept: "describing words",
  activityType,
});

export const grade2DescribingGuided: Challenge[] = [
  make("g2-guided-1", "Which word tells us more about the bag? Amina has a red bag.", ["red", "has", "bag"], 0, "Red tells us what the bag is like."),
  make("g2-guided-2", "Choose the describing word: The mango is sweet.", ["sweet", "is", "mango"], 0, "Sweet tells us more about the mango."),
  make("g2-guided-3", "Which word describes the dog? The small dog runs.", ["small", "runs", "dog"], 0, "Small tells us what the dog is like."),
  make("g2-guided-4", "Which word describes the house? The big house is near the road.", ["big", "near", "road"], 0, "Big tells us more about the house."),
  make("g2-guided-5", "Which word describes the flower? The yellow flower grows.", ["yellow", "grows", "flower"], 0, "Yellow tells us about the flower."),
  make("g2-guided-6", "Complete the sentence: We saw a ___ bird.", ["blue", "jumps", "bird"], 0, "Blue describes the bird."),
  make("g2-guided-7", "Which pair has two describing words?", ["small, green", "run, jump", "bird, tree"], 0, "Small and green both tell us more about something."),
  make("g2-guided-8", "Which word describes the water? The cold water splashed my feet.", ["cold", "splashed", "feet"], 0, "Cold tells us what the water was like."),
];

export const grade2DescribingIndependent: Challenge[] = [
  make("g2-independent-1", "The boy carried a ___ box.", ["heavy", "carries", "box"], 0, "Heavy describes the box.", "independent_practice"),
  make("g2-independent-2", "Which sentence gives more information?", ["I saw a tall tree.", "I saw a tree.", "I saw."] , 0, "Tall gives more information about the tree.", "independent_practice"),
  make("g2-independent-3", "Choose the describing word: The clean room looked nice.", ["clean", "looked", "room"], 0, "Clean tells us about the room.", "independent_practice"),
  make("g2-independent-4", "The little girl wore a ___ dress.", ["beautiful", "walked", "girl"], 0, "Beautiful describes the dress.", "independent_practice"),
  make("g2-independent-5", "Which word describes the road? The narrow road was busy.", ["narrow", "road", "was"], 0, "Narrow tells us about the road.", "independent_practice"),
  make("g2-independent-6", "Which sentence gives a clearer picture of a ball?", ["I have a round red ball.", "I have a ball.", "I have."], 0, "Round and red add useful information about the ball.", "independent_practice"),
  make("g2-independent-7", "The soup was ___.", ["hot", "cooked", "soup"], 0, "Hot tells us what the soup was like.", "independent_practice"),
  make("g2-independent-8", "Which word describes the girl? The happy girl skipped home.", ["happy", "skipped", "home"], 0, "Happy tells us how the girl felt.", "independent_practice"),
];

export const grade2SentenceBuilder: Challenge[] = [
  make("g2-sentence-1", "Which sentence is correct?", ["The small cat sleeps.", "The cat small sleeps.", "Small the cat sleeps."], 0, "Small comes before cat in this simple sentence.", "independent_practice"),
  make("g2-sentence-2", "Which sentence describes the tree correctly?", ["The tall green tree grows.", "The tree tall green grows.", "Tall the tree green grows."], 0, "Tall and green come before tree in this simple sentence.", "independent_practice"),
  make("g2-sentence-3", "Choose the best sentence about a mango.", ["The sweet mango is ripe.", "The mango sweet is ripe.", "Sweet the mango ripe is."], 0, "Sweet describes mango and fits the sentence pattern.", "independent_practice"),
  make("g2-sentence-4", "Choose the correct order.", ["A small brown dog ran.", "A dog small brown ran.", "Small a dog brown ran."], 0, "Small and brown come before dog in this simple sentence.", "independent_practice"),
  make("g2-sentence-5", "Which sentence gives a clear description?", ["The bright yellow flower opened.", "The flower bright yellow opened.", "Bright the flower yellow opened."], 0, "Bright and yellow are placed naturally before flower.", "independent_practice"),
  make("g2-sentence-6", "Which sentence describes the basket correctly?", ["The full basket fell.", "The basket full fell.", "Full the basket fell."], 0, "Full describes the basket and comes before the naming word.", "independent_practice"),
];

export const grade2DescribingMastery: Challenge[] = [
  make("g2-mastery-1", "Which sentence gives the clearest picture of the goat?", ["The young white goat climbed the hill.", "The goat climbed the hill.", "The goat young white climbed."], 0, "Young and white give useful information about the goat.", "mastery"),
  make("g2-mastery-2", "Which word best completes the sentence? The ___ river flowed past the village.", ["wide", "flowed", "village"], 0, "Wide describes the river.", "mastery"),
  make("g2-mastery-3", "Which two words describe the school? We walked into the clean, bright school.", ["clean, bright", "walked, into", "school, we"], 0, "Clean and bright both tell us more about the school.", "mastery"),
  make("g2-mastery-4", "Choose the sentence with the describing word in the best place.", ["The noisy bus stopped.", "The bus noisy stopped.", "Noisy the bus stopped."], 0, "Noisy comes before bus in this simple sentence.", "mastery"),
  make("g2-mastery-5", "Which sentence creates the clearest picture?", ["A small brown bird sat on the old fence.", "A bird sat on a fence.", "A bird small brown sat old."], 0, "The describing words add clear details about the bird and fence.", "mastery"),
  make("g2-mastery-6", "Which word describes how the children felt? The excited children ran outside.", ["excited", "ran", "outside"], 0, "Excited tells us how the children felt.", "mastery"),
];
