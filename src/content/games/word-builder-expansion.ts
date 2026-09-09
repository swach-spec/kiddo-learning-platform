import { GameTierId } from "@/types/game-progress";
import { WordBuilderWord } from "@/content/games/word-builder";

/** Additional question bank used to give active game tiers enough replay variety. */
const EXTRA_WORDS: Partial<Record<number, Partial<Record<GameTierId, WordBuilderWord[]>>>> = {
  3: {
    intermediate: [
      { word: "ADJECTIVE", clue: "A word that describes a noun.", skill: "vocabulary" },
      { word: "NOUN", clue: "A word that names a person, place, animal or thing.", skill: "reading" },
      { word: "VERB", clue: "A word that shows an action or state.", skill: "vocabulary" },
      { word: "SENTENCE", clue: "A group of words that expresses a complete thought.", skill: "reading" },
      { word: "PARAGRAPH", clue: "A group of sentences about a main idea.", skill: "reading" },
      { word: "MEANING", clue: "What a word, phrase or message tells us.", skill: "vocabulary" },
      { word: "COMPARE", clue: "To look at two things and notice how they are alike or different.", skill: "reading" },
      { word: "DESCRIBE", clue: "To tell what someone or something is like.", skill: "vocabulary" },
      { word: "IMPROVE", clue: "To make something better.", skill: "reading" },
      { word: "CREATE", clue: "To make something new.", skill: "vocabulary" },
      { word: "EXPLAIN", clue: "To make an idea clear by giving information.", skill: "reading" },
      { word: "DISCUSS", clue: "To talk about something with another person or group.", skill: "vocabulary" },
      { word: "REASON", clue: "A cause or explanation for something.", skill: "reading" },
      { word: "RESULT", clue: "Something that happens because of an action or event.", skill: "vocabulary" },
      { word: "EVIDENCE", clue: "Information that helps show whether something is true.", skill: "reading" },
      { word: "MESSAGE", clue: "Information sent from one person to another.", skill: "vocabulary" },
      { word: "AUTHOR", clue: "A person who writes a book or story.", skill: "reading" },
      { word: "CHARACTER", clue: "A person or figure in a story.", skill: "vocabulary" },
      { word: "SETTING", clue: "The time and place where a story happens.", skill: "reading" },
      { word: "SUMMARY", clue: "A short statement of the main points of something.", skill: "vocabulary" },
    ],
  },
};

export function getExtraWordBuilderWords(grade: string, tier: GameTierId): WordBuilderWord[] {
  const match = grade.match(/(\d+)/);
  const gradeNumber = Math.min(6, Math.max(1, match ? Number(match[1]) : 1));
  return EXTRA_WORDS[gradeNumber]?.[tier] ?? [];
}
