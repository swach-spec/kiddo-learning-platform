import { PartOfSpeech } from "@/types/content";

type WordHelperEntry = {
  word: string;
  definition: string;
  partOfSpeech: PartOfSpeech;
  example: string;
};

export type WordHelperResult =
  | {
      status: "supported";
      word: string;
      definition: string;
      partOfSpeech: PartOfSpeech;
      example: string;
    }
  | {
      status: "correction";
      submittedWord: string;
      word: string;
      definition: string;
      partOfSpeech: PartOfSpeech;
      example: string;
    }
  | { status: "unsupported" };

// A deliberately small, reviewed foundation glossary. This helper does not
// attempt broad dictionary or grammar analysis beyond these entries.
const entries: WordHelperEntry[] = [
  {
    word: "red",
    definition: "having the colour of a ripe tomato or a stop sign",
    partOfSpeech: "adjective",
    example: "Tom has a red kite.",
  },
  {
    word: "happy",
    definition: "feeling pleased or glad",
    partOfSpeech: "adjective",
    example: "The happy child smiled.",
  },
];

const corrections: Record<string, string> = {
  happi: "happy",
};

/**
 * Looks up a supported word within a word, phrase, or short sentence. It is
 * pure and read-only: it never reads or updates learner progress.
 */
export function getWordHelperResult(input: string): WordHelperResult {
  const words: string[] = input.toLowerCase().match(/[a-z]+/g) ?? [];

  const supported = entries.find((entry) => words.includes(entry.word));
  if (supported) {
    return { status: "supported", ...supported };
  }

  const submittedWord = words.find((word) => corrections[word]);
  const correctedWord = submittedWord ? corrections[submittedWord] : undefined;
  const correctedEntry = correctedWord
    ? entries.find((entry) => entry.word === correctedWord)
    : undefined;

  if (submittedWord && correctedEntry) {
    return {
      status: "correction",
      submittedWord,
      ...correctedEntry,
    };
  }

  return { status: "unsupported" };
}
