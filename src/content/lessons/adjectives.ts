import { Lesson } from "@/types/lesson";
import { Grade } from "@/types/content";

const lessons: Record<Grade, Lesson> = {
  1: {
    id: "english-g1-describing-words", subject: "english", grade: 1, title: "Describing Words", subtitle: "Words can tell us more about people, animals and things.", skill: "vocabulary", icon: "🎨", estimatedMinutes: 4, xp: 20, challengeId: "demo-adjective-describing-word",
    steps: [
      { id: "g1-teach", type: "teach", title: "Words can describe", body: "A describing word tells us more about a person, animal, place or thing." },
      { id: "g1-example", type: "example", title: "Look at the example", body: "The ball is red.", example: "🔴 red ball", explanation: "Red tells us more about the ball." },
      { id: "g1-try", type: "try", title: "Try it", body: "Which word tells us more about the cat?", options: ["small", "run", "cat"], correctOption: "small", explanation: "Small tells us what the cat is like." },
      { id: "g1-master", type: "master", title: "You are ready!", body: "You know how describing words give us more information. Now try a challenge." },
    ],
  },
  2: {
    id: "english-g2-describing-words", subject: "english", grade: 2, title: "Describing Words", subtitle: "Use describing words to add clear details to simple sentences.", skill: "vocabulary", icon: "🎨", estimatedMinutes: 7, xp: 20, challengeId: "g2-guided-1",
    steps: [
      { id: "g2-teach", type: "teach", title: "Words that add detail", body: "A describing word gives us more information about a person, animal, place or thing. It can tell us about colour, size, shape, feeling or another quality." },
      { id: "g2-example", type: "example", title: "Build a picture", body: "The bird flew away. The small blue bird flew away.", example: "🐦 small • blue • bird", explanation: "Small and blue add details. They help us picture the bird more clearly." },
      { id: "g2-try", type: "try", title: "Find the describing word", body: "Which word gives us more information in this sentence? The heavy bag fell.", options: ["heavy", "fell", "bag"], correctOption: "heavy", explanation: "Heavy tells us what the bag was like." },
      { id: "g2-try-2", type: "try", title: "Add a detail", body: "Choose a word that makes the sentence more descriptive: The girl carried a ___ basket.", options: ["full", "carried", "girl"], correctOption: "full", explanation: "Full gives us more information about the basket." },
      { id: "g2-example-2", type: "example", title: "Describing words in a sentence", body: "The happy boy kicked the round ball.", example: "happy boy • round ball", explanation: "Happy tells us about the boy. Round tells us about the ball." },
      { id: "g2-master", type: "master", title: "Ready to practise?", body: "You can find describing words and use them to add details. Now show what you can do in guided practice." },
    ],
  },
  3: {
    id: "english-g3-describing-words", subject: "english", grade: 3, title: "Describing Words", subtitle: "Choose precise words to make your sentences clearer.", skill: "vocabulary", icon: "🎨", estimatedMinutes: 5, xp: 20, challengeId: "demo-adjective-describing-word",
    steps: [
      { id: "g3-teach", type: "teach", title: "Make your meaning clear", body: "Describing words add useful details. They can tell us about size, colour, feeling, shape or quality." },
      { id: "g3-example", type: "example", title: "Compare the sentences", body: "The dog ran down the road. The small brown dog ran down the narrow road.", example: "🐕 small • brown • narrow", explanation: "The extra describing words help us make a clearer picture in our minds." },
      { id: "g3-try", type: "try", title: "Try it", body: "Which word best describes the road? The road was ___.", options: ["narrow", "walk", "road"], correctOption: "narrow", explanation: "Narrow tells us about the road." },
      { id: "g3-master", type: "master", title: "You are ready!", body: "Good readers notice describing words because they help create a clear picture. Now practise." },
    ],
  },
  4: {
    id: "english-g4-adjectives", subject: "english", grade: 4, title: "Adjectives", subtitle: "Use adjectives to describe nouns precisely.", skill: "grammar", icon: "🎨", estimatedMinutes: 5, xp: 20, challengeId: "demo-adjective-describing-word",
    steps: [
      { id: "g4-teach", type: "teach", title: "What is an adjective?", body: "An adjective is a word that describes or gives more information about a noun." },
      { id: "g4-example", type: "example", title: "Find the adjective", body: "The careful girl carried a heavy basket.", example: "careful girl • heavy basket", explanation: "Careful describes the girl. Heavy describes the basket." },
      { id: "g4-try", type: "try", title: "Try it", body: "Which word is an adjective? The farmer planted healthy crops.", options: ["farmer", "planted", "healthy"], correctOption: "healthy", explanation: "Healthy describes the crops." },
      { id: "g4-master", type: "master", title: "You are ready!", body: "You can identify adjectives and explain what they describe. Now put the skill into practice." },
    ],
  },
  5: {
    id: "english-g5-adjectives", subject: "english", grade: 5, title: "Adjectives in Context", subtitle: "Choose precise adjectives and understand their effect on meaning.", skill: "grammar", icon: "🎨", estimatedMinutes: 5, xp: 20, challengeId: "demo-adjective-describing-word",
    steps: [
      { id: "g5-teach", type: "teach", title: "Precise words matter", body: "Adjectives can make writing clearer and more vivid. A precise adjective gives the reader useful information." },
      { id: "g5-example", type: "example", title: "Make the sentence stronger", body: "The storm damaged the house. The violent storm damaged the old house.", example: "violent storm • old house", explanation: "The adjectives give us a clearer idea of the storm and the house." },
      { id: "g5-try", type: "try", title: "Choose the best word", body: "The scientist made a ___ observation.", options: ["careful", "observe", "science"], correctOption: "careful", explanation: "Careful describes the observation and fits the sentence." },
      { id: "g5-master", type: "master", title: "You are ready!", body: "You can now identify and choose precise adjectives in context. Keep going with the challenge." },
    ],
  },
  6: {
    id: "english-g6-adjectives", subject: "english", grade: 6, title: "Adjectives and Meaning", subtitle: "Use precise descriptive language to strengthen your writing.", skill: "grammar", icon: "🎨", estimatedMinutes: 5, xp: 20, challengeId: "demo-adjective-describing-word",
    steps: [
      { id: "g6-teach", type: "teach", title: "Descriptive language", body: "Adjectives help writers add precision, detail and emphasis. The best choice depends on the meaning you want to communicate." },
      { id: "g6-example", type: "example", title: "Notice the difference", body: "She entered the room. She entered the silent, crowded room.", example: "silent • crowded", explanation: "The adjectives create a more specific mental image for the reader." },
      { id: "g6-try", type: "try", title: "Choose the precise adjective", body: "The team followed a ___ plan to reach the final goal.", options: ["careful", "follow", "team"], correctOption: "careful", explanation: "Careful describes the plan and tells us how it was prepared." },
      { id: "g6-master", type: "master", title: "You are ready!", body: "You can use descriptive language deliberately to improve meaning. Now test your skill." },
    ],
  },
};

export function getAdjectiveLesson(grade: Grade): Lesson { return lessons[grade]; }
