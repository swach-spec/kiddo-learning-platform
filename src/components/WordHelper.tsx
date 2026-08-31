"use client";

import { FormEvent, useState } from "react";
import { getWordHelperResult, WordHelperResult } from "@/lib/word-helper";

type WordHelperProps = {
  initialText?: string;
  className?: string;
};

/** Reusable, read-only vocabulary support for learner-facing pages. */
export function WordHelper({ initialText = "", className = "" }: WordHelperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState(initialText);
  const [result, setResult] = useState<WordHelperResult | null>(null);

  function lookUpWord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(getWordHelperResult(input));
  }

  return (
    <section className={className} aria-label="Word Helper">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-2xl border border-purple-400/30 bg-purple-500/10 px-4 py-3 text-sm font-black text-purple-200 transition hover:bg-purple-500/20"
        aria-expanded={isOpen}
      >
        ✨ Word Helper
      </button>

      {isOpen && (
        <div className="mt-3 rounded-2xl border border-white/10 bg-slate-900/95 p-5 shadow-xl">
          <p className="font-black text-white">Look up a word</p>
          <p className="mt-1 text-sm text-slate-400">
            Try a word, short phrase, or sentence.
          </p>

          <form onSubmit={lookUpWord} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="word-helper-input">
              Word or phrase
            </label>
            <input
              id="word-helper-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Try red or happi"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-purple-400 px-5 py-3 font-black text-slate-950 hover:bg-purple-300"
            >
              Look up
            </button>
          </form>

          {result?.status === "supported" && (
            <ResultCard
              word={result.word}
              definition={result.definition}
              partOfSpeech={result.partOfSpeech}
              example={result.example}
            />
          )}

          {result?.status === "correction" && (
            <div className="mt-4">
              <p className="text-sm font-bold text-yellow-300">
                Did you mean “{result.word}” instead of “{result.submittedWord}”?
              </p>
              <ResultCard
                word={result.word}
                definition={result.definition}
                partOfSpeech={result.partOfSpeech}
                example={result.example}
              />
            </div>
          )}

          {result?.status === "unsupported" && (
            <p className="mt-4 rounded-xl bg-white/5 p-4 text-sm leading-6 text-slate-300">
              I don&apos;t know that word yet. Try another word, or ask a grown-up
              to help you explore it.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

function ResultCard({
  word,
  definition,
  partOfSpeech,
  example,
}: {
  word: string;
  definition: string;
  partOfSpeech: string;
  example: string;
}) {
  return (
    <div className="mt-4 rounded-xl bg-emerald-500/10 p-4 text-sm leading-6 text-slate-200">
      <p className="font-black text-emerald-300">
        {word} · {partOfSpeech}
      </p>
      <p className="mt-1">{definition}</p>
      <p className="mt-2 text-slate-400">Example: {example}</p>
    </div>
  );
}
