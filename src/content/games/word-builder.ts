import { GameTierId } from "@/types/game-progress";

export type WordBuilderWord = {
  word: string;
  clue: string;
  skill: "spelling" | "vocabulary" | "reading";
};

const WORDS: Record<number, Record<GameTierId, WordBuilderWord[]>> = {
  1: {
    novice: [
      { word: "CAT", clue: "A small animal that says meow.", skill: "vocabulary" },
      { word: "SUN", clue: "It shines in the sky during the day.", skill: "reading" },
      { word: "BED", clue: "You sleep on it.", skill: "vocabulary" },
      { word: "DOG", clue: "A pet that often barks.", skill: "vocabulary" },
      { word: "HAT", clue: "You wear it on your head.", skill: "vocabulary" },
    ],
    easy: [
      { word: "FISH", clue: "An animal that lives in water.", skill: "vocabulary" },
      { word: "BOOK", clue: "You read it.", skill: "reading" },
      { word: "TREE", clue: "It has roots, a trunk and leaves.", skill: "vocabulary" },
      { word: "FROG", clue: "A green animal that can jump.", skill: "vocabulary" },
      { word: "MOON", clue: "You can see it in the night sky.", skill: "reading" },
    ],
    intermediate: [
      { word: "HOUSE", clue: "A place where people live.", skill: "vocabulary" },
      { word: "SCHOOL", clue: "A place where children learn.", skill: "reading" },
      { word: "FRUIT", clue: "An apple is one example.", skill: "vocabulary" },
      { word: "SMILE", clue: "You make one when you are happy.", skill: "vocabulary" },
      { word: "CLOUD", clue: "A white or grey shape in the sky.", skill: "reading" },
    ],
    advanced: [],
    expert: [],
    master: [],
  },
  2: {
    novice: [
      { word: "PLANT", clue: "It grows from a seed.", skill: "vocabulary" },
      { word: "WATER", clue: "We drink it to stay hydrated.", skill: "vocabulary" },
      { word: "HOUSE", clue: "A place where people live.", skill: "reading" },
      { word: "HAPPY", clue: "Feeling joyful.", skill: "vocabulary" },
      { word: "LIGHT", clue: "The opposite of dark.", skill: "vocabulary" },
    ],
    easy: [
      { word: "MARKET", clue: "A place where people buy things.", skill: "vocabulary" },
      { word: "GARDEN", clue: "A place where plants can grow.", skill: "vocabulary" },
      { word: "FRIEND", clue: "Someone you enjoy spending time with.", skill: "reading" },
      { word: "WINDOW", clue: "You can look through it.", skill: "vocabulary" },
      { word: "MORNING", clue: "The part of the day after night.", skill: "reading" },
    ],
    intermediate: [
      { word: "COUNTRY", clue: "Kenya is one.", skill: "vocabulary" },
      { word: "JOURNEY", clue: "A trip from one place to another.", skill: "reading" },
      { word: "HEALTHY", clue: "Good for your body.", skill: "vocabulary" },
      { word: "ANIMAL", clue: "A living creature such as a lion or goat.", skill: "reading" },
      { word: "RAINBOW", clue: "It can appear after rain when sunlight shines.", skill: "vocabulary" },
    ],
    advanced: [],
    expert: [],
    master: [],
  },
  3: {
    novice: [
      { word: "ADVENTURE", clue: "An exciting experience or journey.", skill: "vocabulary" },
      { word: "KINDNESS", clue: "Being friendly and helpful to others.", skill: "vocabulary" },
      { word: "DISCOVER", clue: "To find something for the first time.", skill: "reading" },
      { word: "COURAGE", clue: "The ability to face something difficult.", skill: "vocabulary" },
      { word: "WHISPER", clue: "To speak very quietly.", skill: "reading" },
    ],
    easy: [
      { word: "LANGUAGE", clue: "A system people use to communicate.", skill: "vocabulary" },
      { word: "PRACTICE", clue: "Doing something repeatedly to improve.", skill: "reading" },
      { word: "CURIOUS", clue: "Wanting to know or learn more.", skill: "vocabulary" },
      { word: "HELPFUL", clue: "Ready to give assistance.", skill: "vocabulary" },
      { word: "EXPLORE", clue: "To travel around and learn about a place.", skill: "reading" },
    ],
    intermediate: [
      { word: "IMPORTANT", clue: "Having great value or meaning.", skill: "vocabulary" },
      { word: "CREATIVE", clue: "Able to make or imagine new things.", skill: "vocabulary" },
      { word: "CONFIDENT", clue: "Feeling sure about your abilities.", skill: "reading" },
      { word: "COMMUNITY", clue: "People living or working together.", skill: "vocabulary" },
      { word: "RESPONSIBLE", clue: "Able to be trusted to do what is expected.", skill: "reading" },
      { word: "ARGUMENT", clue: "A set of reasons given to support an idea.", skill: "reading" },
      { word: "COMPARE", clue: "To look at two things and notice how they are alike or different.", skill: "reading" },
      { word: "DESCRIBE", clue: "To tell what something is like using words.", skill: "reading" },
      { word: "IMPROVE", clue: "To make something better.", skill: "vocabulary" },
      { word: "OBSERVE", clue: "To watch something carefully.", skill: "reading" },
      { word: "ORGANIZE", clue: "To arrange things in a clear and useful way.", skill: "vocabulary" },
      { word: "SENTENCE", clue: "A group of words that expresses a complete idea.", skill: "reading" },
      { word: "PARAGRAPH", clue: "A group of sentences about one main idea.", skill: "reading" },
      { word: "MEANING", clue: "What a word, sentence or message tells us.", skill: "vocabulary" },
      { word: "EVIDENCE", clue: "Facts or information that help show something is true.", skill: "reading" },
      { word: "SUMMARY", clue: "A short statement of the main points.", skill: "reading" },
      { word: "SOLUTION", clue: "An answer to a problem.", skill: "vocabulary" },
      { word: "DECISION", clue: "A choice made after thinking about something.", skill: "vocabulary" },
      { word: "RESOURCE", clue: "Something useful that can help you do a task.", skill: "vocabulary" },
      { word: "SIMILAR", clue: "Almost the same, but not exactly the same.", skill: "vocabulary" },
      { word: "MESSAGE", clue: "Information or an idea sent from one person to another.", skill: "reading" },
      { word: "PATIENT", clue: "Able to wait calmly without becoming upset.", skill: "vocabulary" },
      { word: "ORDINARY", clue: "Normal or not unusual.", skill: "vocabulary" },
      { word: "ADJECTIVE", clue: "A word that describes a noun.", skill: "reading" },
      { word: "ADVERB", clue: "A word that can tell how, when or where an action happens.", skill: "reading" },
    ],
    advanced: [
      { word: "OPPORTUNITY", clue: "A favourable chance to do something.", skill: "vocabulary" },
      { word: "IMAGINATION", clue: "The ability to form ideas in your mind.", skill: "vocabulary" },
      { word: "ENVIRONMENT", clue: "The surroundings in which people, animals and plants live.", skill: "reading" },
      { word: "DETERMINATION", clue: "A firm decision to achieve something.", skill: "vocabulary" },
      { word: "KNOWLEDGE", clue: "Information and understanding gained through learning.", skill: "reading" },
    ],
    expert: [],
    master: [],
  },
  4: {
    novice: [
      { word: "ADVENTURE", clue: "An exciting experience or journey.", skill: "vocabulary" },
      { word: "DISCOVERY", clue: "Something found or learned for the first time.", skill: "vocabulary" },
      { word: "LANGUAGE", clue: "A system used for communication.", skill: "reading" },
      { word: "CHALLENGE", clue: "A difficult task that tests your ability.", skill: "vocabulary" },
      { word: "CREATIVE", clue: "Able to produce original ideas.", skill: "vocabulary" },
    ],
    easy: [
      { word: "COMMUNITY", clue: "A group of people living or working together.", skill: "vocabulary" },
      { word: "RESPONSIBLE", clue: "Able to be trusted to do what is expected.", skill: "reading" },
      { word: "EXPERIENCE", clue: "Knowledge gained by doing or seeing something.", skill: "vocabulary" },
      { word: "TRADITION", clue: "A custom passed from one generation to another.", skill: "reading" },
      { word: "CONFIDENT", clue: "Feeling sure about your ability.", skill: "vocabulary" },
    ],
    intermediate: [
      { word: "OPPORTUNITY", clue: "A favourable chance to do something.", skill: "vocabulary" },
      { word: "ENVIRONMENT", clue: "The surroundings where living things exist.", skill: "reading" },
      { word: "INDEPENDENT", clue: "Able to do things without relying on others.", skill: "vocabulary" },
      { word: "IMAGINATION", clue: "The ability to form ideas or pictures in your mind.", skill: "reading" },
      { word: "DETERMINATION", clue: "A strong decision to achieve something.", skill: "vocabulary" },
    ],
    advanced: [
      { word: "COMMUNICATION", clue: "The sharing of information, ideas or feelings.", skill: "vocabulary" },
      { word: "RESPONSIBILITY", clue: "A duty or task that you are expected to handle.", skill: "reading" },
      { word: "CONSEQUENCE", clue: "A result that follows an action.", skill: "vocabulary" },
      { word: "SIGNIFICANT", clue: "Important or meaningful.", skill: "reading" },
      { word: "PERSPECTIVE", clue: "A particular way of viewing something.", skill: "vocabulary" },
    ],
    expert: [],
    master: [],
  },
  5: {
    novice: [
      { word: "EXPLORATION", clue: "The act of travelling through or examining something to learn about it.", skill: "vocabulary" },
      { word: "CREATIVITY", clue: "The ability to produce original ideas.", skill: "vocabulary" },
      { word: "KNOWLEDGE", clue: "Information and understanding gained through learning.", skill: "reading" },
      { word: "CHARACTER", clue: "The qualities that make a person distinctive.", skill: "vocabulary" },
      { word: "INVENTION", clue: "A new device, idea or process that has been created.", skill: "reading" },
    ],
    easy: [
      { word: "RESPONSIBILITY", clue: "A duty or task you are expected to handle.", skill: "vocabulary" },
      { word: "ENVIRONMENT", clue: "The surroundings where living things exist.", skill: "reading" },
      { word: "OPPORTUNITY", clue: "A favourable chance to do something.", skill: "vocabulary" },
      { word: "COMMUNICATION", clue: "The sharing of information, ideas or feelings.", skill: "reading" },
      { word: "DETERMINATION", clue: "A strong decision to achieve something.", skill: "vocabulary" },
    ],
    intermediate: [
      { word: "PERSPECTIVE", clue: "A particular way of viewing or understanding something.", skill: "vocabulary" },
      { word: "SIGNIFICANT", clue: "Important or meaningful.", skill: "reading" },
      { word: "CONSEQUENCE", clue: "A result that follows an action.", skill: "vocabulary" },
      { word: "RELATIONSHIP", clue: "The way people or things are connected.", skill: "reading" },
      { word: "RESPONSIBLE", clue: "Having a duty to deal with something.", skill: "vocabulary" },
    ],
    advanced: [],
    expert: [],
    master: [],
  },
  6: {
    novice: [
      { word: "OPPORTUNITY", clue: "A favourable chance to do something.", skill: "vocabulary" },
      { word: "PERSPECTIVE", clue: "A particular way of viewing something.", skill: "vocabulary" },
      { word: "CONSEQUENCE", clue: "A result that follows an action.", skill: "reading" },
      { word: "SIGNIFICANT", clue: "Important or meaningful.", skill: "vocabulary" },
      { word: "INFLUENCE", clue: "The power to affect someone or something.", skill: "reading" },
    ],
    easy: [
      { word: "RESPONSIBILITY", clue: "A duty or task that you are expected to handle.", skill: "vocabulary" },
      { word: "COMMUNICATION", clue: "The sharing of information, ideas or feelings.", skill: "reading" },
      { word: "ENVIRONMENT", clue: "The surroundings where living things exist.", skill: "vocabulary" },
      { word: "DETERMINATION", clue: "A firm decision to achieve something.", skill: "vocabulary" },
      { word: "RELATIONSHIP", clue: "The way people or things are connected.", skill: "reading" },
    ],
    intermediate: [
      { word: "MISUNDERSTAND", clue: "To understand something incorrectly.", skill: "vocabulary" },
      { word: "INTERACTION", clue: "Communication or action between people or things.", skill: "reading" },
      { word: "ACHIEVEMENT", clue: "Something successfully completed or accomplished.", skill: "vocabulary" },
      { word: "PREDICTION", clue: "A statement about what may happen in the future.", skill: "reading" },
      { word: "ANALYSIS", clue: "Detailed examination of something.", skill: "vocabulary" },
    ],
    advanced: [
      { word: "COLLABORATION", clue: "Working together to achieve something.", skill: "vocabulary" },
      { word: "INTERPRETATION", clue: "An explanation of the meaning of something.", skill: "reading" },
      { word: "CONTRADICTION", clue: "A situation where two ideas cannot both be true.", skill: "vocabulary" },
      { word: "SUSTAINABILITY", clue: "The ability to continue without causing unacceptable harm.", skill: "reading" },
      { word: "EXTRAORDINARY", clue: "Very unusual or remarkable.", skill: "vocabulary" },
    ],
    expert: [
      { word: "MISINTERPRETATION", clue: "A wrong or inaccurate understanding of something.", skill: "reading" },
      { word: "CHARACTERIZATION", clue: "The way a writer presents a character.", skill: "vocabulary" },
      { word: "RESPONSIVENESS", clue: "The quality of reacting appropriately or quickly.", skill: "vocabulary" },
      { word: "TRANSFORMATION", clue: "A complete or major change in form or appearance.", skill: "reading" },
      { word: "CONSIDERATION", clue: "Careful thought about something.", skill: "vocabulary" },
    ],
    master: [
      { word: "UNPRECEDENTED", clue: "Never having happened or existed before.", skill: "vocabulary" },
      { word: "MISREPRESENTATION", clue: "A false or misleading presentation of something.", skill: "reading" },
      { word: "COUNTERARGUMENT", clue: "An argument made to oppose another argument.", skill: "vocabulary" },
      { word: "CHARACTERIZATION", clue: "The way a writer creates and develops a character.", skill: "reading" },
      { word: "INTERDEPENDENCE", clue: "A relationship in which things depend on one another.", skill: "vocabulary" },
    ],
  },
};

function gradeNumber(grade: string) {
  const match = grade.match(/(\d+)/);
  return Math.min(6, Math.max(1, match ? Number(match[1]) : 1));
}

export function getWordBuilderWords(grade: string, tier: GameTierId): WordBuilderWord[] {
  const gradeWords = WORDS[gradeNumber(grade)];
  const direct = gradeWords?.[tier] ?? [];
  if (direct.length >= 5) return direct;

  const fallbackOrder: GameTierId[] = ["novice", "easy", "intermediate", "advanced", "expert", "master"];
  const tierIndex = fallbackOrder.indexOf(tier);
  for (let index = tierIndex - 1; index >= 0; index -= 1) {
    const fallback = gradeWords?.[fallbackOrder[index]] ?? [];
    if (fallback.length >= 5) return fallback;
  }
  return direct;
}
