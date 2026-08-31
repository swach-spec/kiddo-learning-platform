"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getVocabularyChallengeById } from "@/lib/challenge";
import { recordActivityResult } from "@/lib/player";
import { usePlayer } from "@/hooks/usePlayer";
import { Button } from "@/components/Button";
import { WordHelper } from "@/components/WordHelper";

export default function VocabularyChallengePage() {
  const params = useParams<{ id: string }>();
  const challengeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const challenge = getVocabularyChallengeById(challengeId);
  const { player, loading, awardXP } = usePlayer();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const submittedChallengeId = useRef<string | null>(null);

  useEffect(() => {
    if (!loading && !player) {
      window.location.href = "/players";
    }
  }, [loading, player]);

  if (loading || !player) return null;

  if (!challenge) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-center text-white">
        <div className="max-w-md">
          <div className="text-6xl">🧭</div>
          <h1 className="mt-6 text-3xl font-black">Challenge not found</h1>
          <p className="mt-3 text-slate-400">
            This challenge may no longer be available.
          </p>
          <Link href="/" className="mt-8 inline-block">
            <Button variant="primary" className="px-7 py-4">
              Back Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const correct = selectedOptionId === challenge.correctOptionId;

  function chooseAnswer(optionId: string) {
    if (
      selectedOptionId !== null ||
      submittedChallengeId.current === challenge.id
    ) {
      return;
    }

    const isCorrect = optionId === challenge.correctOptionId;
    submittedChallengeId.current = challenge.id;
    setSelectedOptionId(optionId);

    recordActivityResult({
      id: crypto.randomUUID(),
      playerId: player.id,
      activityType: "vocabulary_challenge",
      activityId: challenge.id,
      skills: [challenge.skill],
      correct: isCorrect,
      attempts: 1,
      hintsUsed: 0,
      difficulty: challenge.difficulty,
      xpAwarded: isCorrect ? challenge.xp : 0,
      timestamp: new Date().toISOString(),
    });

    // Challenge XP is awarded exactly once for this submitted answer. It is
    // independent from story-question XP and never updates Story Reader state.
    if (isCorrect) awardXP(challenge.xp);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-3xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl hover:bg-white/10"
          >
            ←
          </Link>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-300">
              Vocabulary Challenge
            </p>
            <h1 className="text-xl font-black">Word Practice</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-yellow-300">
            +{challenge.xp} XP
          </div>
        </header>

        <section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10">
          <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
            {challenge.partOfSpeech}
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
            {challenge.prompt}
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {challenge.options.map((option, index) => {
              const isCorrect =
                selectedOptionId !== null && option.id === challenge.correctOptionId;
              const isWrong =
                selectedOptionId === option.id && option.id !== challenge.correctOptionId;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => chooseAnswer(option.id)}
                  className={`rounded-2xl border p-5 text-left text-lg font-bold transition ${
                    isCorrect
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                      : isWrong
                        ? "border-red-400 bg-red-500/20 text-red-300"
                        : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"
                  }`}
                >
                  <span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.text}
                </button>
              );
            })}
          </div>

          {selectedOptionId !== null && (
            <div
              className={`mt-6 rounded-2xl p-5 ${
                correct ? "bg-emerald-500/10" : "bg-orange-500/10"
              }`}
            >
              <p className="text-lg font-black">
                {correct ? "🎉 Great work!" : "❌ Not quite."}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                {challenge.explanation}
              </p>
              {correct && (
                <p className="mt-3 font-black text-yellow-400">
                  ⭐ +{challenge.xp} challenge XP
                </p>
              )}
              <Link href="/" className="mt-5 block">
                <Button variant="primary" className="w-full sm:w-auto sm:px-8">
                  Back to Today&apos;s Adventure →
                </Button>
              </Link>
            </div>
          )}
        </section>

        <WordHelper className="mt-6" />
      </div>
    </main>
  );
}
