import { Story, Question } from "@/types/content";

/**
 * Bulk language calibration for the original short Story Forest catalogue.
 * The six benchmark stories remain the quality reference; this layer brings
 * the remaining stories closer to the same grade-aware language standard
 * without duplicating the catalogue.
 */

const SIMPLE_WORDS: Record<number, Array<[string, string]>> = {
  1: [
    ["courage", "bravery"], ["curious", "wanting to know"], ["disappointed", "sad"],
    ["immediately", "at once"], ["neighbour", "person next door"], ["delicious", "tasty"],
    ["disappeared", "was gone"], ["quickly", "fast"], ["carefully", "with care"],
  ],
  2: [
    ["neglected", "forgotten"], ["flourish", "grow well"], ["disappointed", "sad"],
    ["immediately", "at once"], ["determined", "ready to keep trying"], ["observe", "look at"],
    ["discover", "find out"], ["fortunate", "lucky"],
  ],
  3: [
    ["ordinary", "usual"], ["evidence", "facts that help us know"], ["investigate", "look into"],
    ["observe", "watch carefully"], ["mysterious", "hard to explain"], ["significant", "important"],
  ],
};

const GRADE_GRAMMAR: Record<number, { prompt: string; options: string[]; correct: string; explanation: string }> = {
  1: {
    prompt: "Which sentence sounds right?",
    options: ["Musa helps his friend.", "Musa help his friend.", "Musa helping his friend.", "Musa help his friends is."],
    correct: "Musa helps his friend.",
    explanation: "We say 'Musa helps' because Musa is one person.",
  },
  2: {
    prompt: "Which sentence tells what happened yesterday?",
    options: ["Amina played outside.", "Amina plays outside.", "Amina will play outside.", "Amina playing outside."],
    correct: "Amina played outside.",
    explanation: "'Played' tells us the action happened in the past.",
  },
  3: {
    prompt: "Choose the sentence with correct subject-verb agreement.",
    options: ["The boys run home.", "The boys runs home.", "The boy run home.", "The boys running home."],
    correct: "The boys run home.",
    explanation: "A plural subject such as 'boys' takes 'run', not 'runs'.",
  },
  4: {
    prompt: "Choose the sentence with the correct verb tense.",
    options: ["Yesterday, Nia cleaned the room.", "Yesterday, Nia cleans the room.", "Yesterday, Nia will clean the room.", "Yesterday, Nia cleaning the room."],
    correct: "Yesterday, Nia cleaned the room.",
    explanation: "'Yesterday' tells us the action happened in the past, so 'cleaned' is correct.",
  },
  5: {
    prompt: "Which sentence joins the ideas correctly?",
    options: ["Kito was tired, but he finished the work.", "Kito was tired, he finished the work but.", "Kito was tired because but he finished the work.", "Kito but was tired finished the work."],
    correct: "Kito was tired, but he finished the work.",
    explanation: "'But' correctly joins two ideas that contrast.",
  },
  6: {
    prompt: "Choose the sentence with the clearest construction.",
    options: ["Although it was raining, the children continued reading.", "Although it was raining, but the children continued reading.", "It was raining although but children reading.", "The children continued although raining reading."],
    correct: "Although it was raining, the children continued reading.",
    explanation: "'Although' correctly introduces the contrasting clause without needing 'but'.",
  },
};

function replaceWords(text: string, grade: number): string {
  let result = text;
  for (const [from, to] of SIMPLE_WORDS[grade] ?? []) {
    result = result.replace(new RegExp(`\\b${from}\\b`, "gi"), to);
  }
  return result;
}

function grammarQuestion(story: Story, index: number): Question {
  const target = GRADE_GRAMMAR[story.grade] ?? GRADE_GRAMMAR[6];
  const correctIndex = target.options.indexOf(target.correct);
  const optionIds = ["a", "b", "c", "d"];
  return {
    id: `${story.id}-language-${index}`,
    prompt: target.prompt,
    options: target.options.map((text, optionIndex) => ({ id: optionIds[optionIndex], text })),
    correctOptionId: optionIds[correctIndex],
    explanation: target.explanation,
    skills: ["grammar"],
    xp: 15,
    difficulty: story.grade <= 2 ? 1 : story.grade <= 4 ? 2 : 3,
  };
}

export function calibrateStoryLanguage(stories: Story[]): Story[] {
  return stories.map((story, index) => ({
    ...story,
    scenes: story.scenes.map((scene) => ({ ...scene, text: replaceWords(scene.text, story.grade) })),
    description: replaceWords(story.description, story.grade),
    questions: [...story.questions, grammarQuestion(story, index)],
  }));
}
