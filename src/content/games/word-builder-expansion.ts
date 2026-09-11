import { GameTierId } from "@/types/game-progress";
import { WordBuilderWord } from "@/content/games/word-builder";

/**
 * Replay bank for Word Builder.
 * The base catalogue remains intact; these words add enough grade/tier variety
 * that a five-to-seven-round session should not repeatedly surface the same words.
 */
const EXTRA_WORDS: Partial<Record<number, Partial<Record<GameTierId, WordBuilderWord[]>>>> = {
  1: {
    novice: [
      { word: "BAG", clue: "You carry books in it.", skill: "vocabulary" },
      { word: "CUP", clue: "You can drink water from it.", skill: "vocabulary" },
      { word: "FAN", clue: "It moves air to help you feel cool.", skill: "reading" },
      { word: "RAIN", clue: "Water that falls from clouds.", skill: "vocabulary" },
      { word: "TREE", clue: "It has a trunk and leaves.", skill: "vocabulary" },
      { word: "FARM", clue: "A place where people grow food and keep animals.", skill: "reading" },
      { word: "MILK", clue: "A drink that can come from a cow.", skill: "vocabulary" },
      { word: "ROAD", clue: "A path where cars and people travel.", skill: "reading" },
    ],
    easy: [
      { word: "BIRD", clue: "An animal with wings and feathers.", skill: "vocabulary" },
      { word: "CLOUD", clue: "A white or grey shape in the sky.", skill: "reading" },
      { word: "CHAIR", clue: "You sit on it.", skill: "vocabulary" },
      { word: "PLATE", clue: "You put food on it.", skill: "vocabulary" },
      { word: "WATER", clue: "We drink it when we are thirsty.", skill: "reading" },
      { word: "SMALL", clue: "The opposite of big.", skill: "vocabulary" },
    ],
    intermediate: [
      { word: "FAMILY", clue: "Parents, children and other close relatives can be part of one.", skill: "vocabulary" },
      { word: "MARKET", clue: "A place where people buy and sell things.", skill: "reading" },
      { word: "FRIEND", clue: "A person who cares about you and enjoys being with you.", skill: "vocabulary" },
      { word: "GARDEN", clue: "A place where plants are grown.", skill: "reading" },
      { word: "HELPER", clue: "A person who gives help.", skill: "vocabulary" },
      { word: "SUNNY", clue: "Having a lot of bright sunshine.", skill: "reading" },
    ],
  },
  2: {
    novice: [
      { word: "BASKET", clue: "A container used for carrying things.", skill: "vocabulary" },
      { word: "WINDOW", clue: "You can look through it to see outside.", skill: "reading" },
      { word: "CANDLE", clue: "It gives light when it is burning.", skill: "vocabulary" },
      { word: "SHOES", clue: "You wear them on your feet.", skill: "vocabulary" },
      { word: "STREAM", clue: "A small flowing body of water.", skill: "reading" },
      { word: "FARMER", clue: "A person who grows crops or keeps animals.", skill: "vocabulary" },
    ],
    easy: [
      { word: "PICNIC", clue: "A meal eaten outside, often with family or friends.", skill: "vocabulary" },
      { word: "BRIGHT", clue: "Full of light or easy to see.", skill: "reading" },
      { word: "HEAVY", clue: "Hard to lift because it weighs a lot.", skill: "vocabulary" },
      { word: "QUIET", clue: "Making little or no sound.", skill: "reading" },
      { word: "JOURNEY", clue: "A trip from one place to another.", skill: "vocabulary" },
      { word: "CLEAN", clue: "Free from dirt.", skill: "reading" },
    ],
    intermediate: [
      { word: "PATIENT", clue: "Able to wait calmly.", skill: "vocabulary" },
      { word: "NOTICE", clue: "To see or become aware of something.", skill: "reading" },
      { word: "PLAN", clue: "A set of steps for doing something.", skill: "vocabulary" },
      { word: "SHARE", clue: "To give part of something to another person.", skill: "reading" },
      { word: "HEALTHY", clue: "Good for your body.", skill: "vocabulary" },
      { word: "CAREFUL", clue: "Taking care to avoid mistakes or danger.", skill: "reading" },
    ],
  },
  3: {
    novice: [
      { word: "QUESTION", clue: "Something you ask when you want information.", skill: "reading" },
      { word: "ANSWER", clue: "What you give when you respond to a question.", skill: "vocabulary" },
      { word: "SEARCH", clue: "To look for something.", skill: "reading" },
      { word: "BRAVE", clue: "Ready to face something difficult.", skill: "vocabulary" },
      { word: "FOREST", clue: "A large area filled with trees.", skill: "vocabulary" },
      { word: "FOLLOW", clue: "To go after someone or something.", skill: "reading" },
    ],
    easy: [
      { word: "NOTICE", clue: "To see something and become aware of it.", skill: "reading" },
      { word: "EXPLAIN", clue: "To make an idea clear.", skill: "vocabulary" },
      { word: "EXPLORE", clue: "To travel around a place to learn about it.", skill: "reading" },
      { word: "CURIOUS", clue: "Wanting to know or learn more.", skill: "vocabulary" },
      { word: "HONEST", clue: "Telling the truth.", skill: "reading" },
      { word: "SOLVE", clue: "To find an answer to a problem.", skill: "vocabulary" },
    ],
    advanced: [
      { word: "RESEARCH", clue: "Careful study to learn more about a subject.", skill: "reading" },
      { word: "EVIDENCE", clue: "Facts or information that support an idea.", skill: "vocabulary" },
      { word: "PREDICT", clue: "To say what you think may happen.", skill: "reading" },
      { word: "COMPARE", clue: "To look at two things and identify similarities or differences.", skill: "vocabulary" },
      { word: "DESCRIBE", clue: "To tell what a person, place or thing is like.", skill: "reading" },
      { word: "INFERENCE", clue: "An idea reached from clues and what you already know.", skill: "vocabulary" },
    ],
  },
  4: {
    novice: [
      { word: "GRAMMAR", clue: "The rules that help us use language correctly.", skill: "reading" },
      { word: "NOUN", clue: "A word that names a person, place, animal or thing.", skill: "vocabulary" },
      { word: "VERB", clue: "A word that shows an action or state.", skill: "reading" },
      { word: "PRONOUN", clue: "A word used in place of a noun, such as he or they.", skill: "vocabulary" },
      { word: "ADJECTIVE", clue: "A word that describes a noun.", skill: "reading" },
      { word: "SENTENCE", clue: "A group of words that expresses a complete thought.", skill: "vocabulary" },
    ],
    easy: [
      { word: "PARAGRAPH", clue: "A group of sentences about one main idea.", skill: "reading" },
      { word: "PUNCTUATION", clue: "Marks such as full stops and commas used in writing.", skill: "vocabulary" },
      { word: "SUBJECT", clue: "The person, animal or thing a sentence is about.", skill: "reading" },
      { word: "TENSE", clue: "A verb form that can show when an action happens.", skill: "vocabulary" },
      { word: "CONTEXT", clue: "The words and situation that help us understand meaning.", skill: "reading" },
      { word: "MEANING", clue: "What a word, sentence or message tells us.", skill: "vocabulary" },
    ],
    intermediate: [
      { word: "CONJUNCTION", clue: "A word that joins words or groups of words.", skill: "vocabulary" },
      { word: "ADVERB", clue: "A word that can tell how, when or where an action happens.", skill: "reading" },
      { word: "AGREEMENT", clue: "A correct match between parts of a sentence, such as subject and verb.", skill: "vocabulary" },
      { word: "CLAUSE", clue: "A group of words containing a subject and a verb.", skill: "reading" },
      { word: "DIRECT", clue: "Straight or without an intermediate step.", skill: "vocabulary" },
      { word: "REPORT", clue: "To give information about something that happened.", skill: "reading" },
    ],
    advanced: [
      { word: "PERSUASIVE", clue: "Able to convince someone to accept an idea.", skill: "vocabulary" },
      { word: "DESCRIPTION", clue: "Words that explain what a person, place or thing is like.", skill: "reading" },
      { word: "PARAPHRASE", clue: "To express the same idea using different words.", skill: "vocabulary" },
      { word: "CONTEXTUAL", clue: "Connected with the situation in which something appears.", skill: "reading" },
      { word: "COMPOUND", clue: "Made by joining two or more parts.", skill: "vocabulary" },
      { word: "EDIT", clue: "To check and improve writing.", skill: "reading" },
    ],
  },
  5: {
    novice: [
      { word: "CHARACTER", clue: "A person or figure in a story.", skill: "vocabulary" },
      { word: "SETTING", clue: "The time and place where a story happens.", skill: "reading" },
      { word: "SUMMARY", clue: "A short statement of the main points.", skill: "vocabulary" },
      { word: "PURPOSE", clue: "The reason something is done.", skill: "reading" },
      { word: "OPINION", clue: "A belief or view about something.", skill: "vocabulary" },
      { word: "REASON", clue: "A cause or explanation for something.", skill: "reading" },
    ],
    easy: [
      { word: "ARGUMENT", clue: "Reasons given to support an idea or position.", skill: "reading" },
      { word: "PERSPECTIVE", clue: "A particular way of viewing or understanding something.", skill: "vocabulary" },
      { word: "RELATIONSHIP", clue: "The way people or things are connected.", skill: "reading" },
      { word: "CONSEQUENCE", clue: "A result that follows an action.", skill: "vocabulary" },
      { word: "INFLUENCE", clue: "The power to affect someone or something.", skill: "reading" },
      { word: "RELEVANT", clue: "Closely connected with the matter being discussed.", skill: "vocabulary" },
    ],
    intermediate: [
      { word: "CONTRAST", clue: "A clear difference between two things.", skill: "reading" },
      { word: "JUSTIFY", clue: "To give reasons that support an answer or decision.", skill: "vocabulary" },
      { word: "CONCLUSION", clue: "A judgement or decision reached after thinking about information.", skill: "reading" },
      { word: "INTERPRET", clue: "To explain the meaning of something.", skill: "vocabulary" },
      { word: "EVALUATE", clue: "To judge the value or quality of something.", skill: "reading" },
      { word: "EFFECTIVE", clue: "Successful in producing the intended result.", skill: "vocabulary" },
    ],
    advanced: [
      { word: "COHERENCE", clue: "Clear and logical connection between ideas.", skill: "reading" },
      { word: "TRANSITION", clue: "A word or phrase that helps move from one idea to another.", skill: "vocabulary" },
      { word: "PERSUASION", clue: "The act of convincing someone to accept an idea.", skill: "reading" },
      { word: "AMBIGUOUS", clue: "Having more than one possible meaning.", skill: "vocabulary" },
      { word: "INFERENTIAL", clue: "Based on conclusions drawn from clues rather than direct facts.", skill: "reading" },
      { word: "STRUCTURE", clue: "The way parts are arranged and connected.", skill: "vocabulary" },
    ],
  },
  6: {
    novice: [
      { word: "INFERENCE", clue: "A conclusion reached from clues and what you already know.", skill: "reading" },
      { word: "CONTEXT", clue: "The situation and surrounding words that help explain meaning.", skill: "vocabulary" },
      { word: "THEME", clue: "The main idea or message in a story or text.", skill: "reading" },
      { word: "EVIDENCE", clue: "Information used to support a claim or conclusion.", skill: "vocabulary" },
      { word: "IMPACT", clue: "A strong effect on someone or something.", skill: "reading" },
      { word: "SOURCE", clue: "A person, document or place from which information comes.", skill: "vocabulary" },
    ],
    easy: [
      { word: "ANALYSIS", clue: "Detailed examination of something.", skill: "reading" },
      { word: "INTERACTION", clue: "Communication or action between people or things.", skill: "vocabulary" },
      { word: "PREDICTION", clue: "A statement about what may happen in the future.", skill: "reading" },
      { word: "ACHIEVEMENT", clue: "Something successfully completed or accomplished.", skill: "vocabulary" },
      { word: "INTERPRETATION", clue: "An explanation of the meaning of something.", skill: "reading" },
      { word: "COLLABORATION", clue: "Working together to achieve something.", skill: "vocabulary" },
    ],
    intermediate: [
      { word: "CONTRADICTION", clue: "A situation where two ideas cannot both be true.", skill: "vocabulary" },
      { word: "PERSPECTIVE", clue: "A particular way of viewing or understanding something.", skill: "reading" },
      { word: "SYNTHESIS", clue: "Combining ideas or information to form a new understanding.", skill: "vocabulary" },
      { word: "RELIABILITY", clue: "The quality of being dependable or trustworthy.", skill: "reading" },
      { word: "DISTINCTION", clue: "A difference that separates one thing from another.", skill: "vocabulary" },
      { word: "CONTEXTUAL", clue: "Related to the situation in which something occurs.", skill: "reading" },
    ],
    advanced: [
      { word: "SUSTAINABILITY", clue: "The ability to continue without causing unacceptable harm.", skill: "reading" },
      { word: "CRITICAL", clue: "Involving careful judgement and evaluation.", skill: "vocabulary" },
      { word: "COUNTERARGUMENT", clue: "An argument made against another argument.", skill: "reading" },
      { word: "GENERALIZATION", clue: "A broad statement based on particular examples.", skill: "vocabulary" },
      { word: "CONNOTATION", clue: "An additional feeling or idea linked to a word beyond its direct meaning.", skill: "reading" },
      { word: "ELABORATE", clue: "To explain or develop an idea in more detail.", skill: "vocabulary" },
    ],
  },
};

export function getExtraWordBuilderWords(grade: string, tier: GameTierId): WordBuilderWord[] {
  const match = grade.match(/(\d+)/);
  const gradeNumber = Math.min(6, Math.max(1, match ? Number(match[1]) : 1));
  return EXTRA_WORDS[gradeNumber]?.[tier] ?? [];
}
