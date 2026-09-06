"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getStoryById } from "@/content";
import { usePlayer } from "@/hooks/usePlayer";
import { shuffleArray } from "@/lib/shuffle";
import { recordActivityResult } from "@/lib/player";
import { getChallengeForQuestion } from "@/lib/challenge";
import { Button } from "@/components/Button";
import { WordHelper } from "@/components/WordHelper";

export default function StoryPage() {
  const params = useParams<{ id: string }>();
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const story = getStoryById(storyId);

  const { player, loading: playerLoading, awardXP, markStoryCompleted } =
    usePlayer();

  useEffect(() => {
    if (!playerLoading && !player) {
      window.location.href = "/players";
    }
  }, [playerLoading, player]);

  // Shuffle question order and each question's option order once per
  // visit, so a learner can't just memorize "question 3 = B". Answers
  // are always checked by option id, so shuffling never breaks scoring.
  const questions = useMemo(() => {
    if (!story) return [];

    return shuffleArray(story.questions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
  }, [story]);

  const [scene, setScene] = useState(0);
  const [question, setQuestion] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    null
  );
  const [showResult, setShowResult] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!story) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-center text-white">
        <div className="max-w-md">
          <div className="text-6xl">🧭</div>

          <h1 className="mt-6 text-3xl font-black">Adventure not found</h1>

          <p className="mt-3 text-slate-400">
            We couldn&apos;t find that story. It may have moved, or it
            doesn&apos;t exist yet.
          </p>

          <Link href="/story" className="mt-8 inline-block">
            <Button variant="primary" className="px-7 py-4">
              Back to Story Forest 🌳
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // A coming_soon story exists in the catalogue (real title/description/
  // xp/etc.) but has no verified scenes or questions — it must never be
  // rendered as playable, even via a direct/legacy URL that bypasses the
  // Story Forest card. Checked before any reading/quiz state is touched.
  if (story.status === "coming_soon") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-center text-white">
        <div className="max-w-md">
          <div className="text-6xl">🚧</div>

          <h1 className="mt-6 text-3xl font-black">{story.title}</h1>

          <p className="mt-3 text-slate-400">
            This adventure is still being written. Check back soon!
          </p>

          <Link href="/story" className="mt-8 inline-block">
            <Button variant="primary" className="px-7 py-4">
              Back to Story Forest 🌳
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  if (playerLoading || !player) {
    return null;
  }

  const readingFinished = scene >= story.scenes.length;
  const currentQuestion = questions[question];
  const relatedChallenge = currentQuestion
    ? getChallengeForQuestion(currentQuestion)
    : null;

  function nextScene() {
    if (!player) return;

    const isLastScene = scene === story!.scenes.length - 1;

    if (isLastScene) {
      recordActivityResult({
        id: crypto.randomUUID(),
        playerId: player.id,
        activityType: "story_reading",
        activityId: story!.id,
        storyId: story!.id,
        skills: ["reading_comprehension"],
        correct: null,
        attempts: 1,
        hintsUsed: 0,
        xpAwarded: 0,
        timestamp: new Date().toISOString(),
      });
    }

    setScene((current) => current + 1);
  }

  function chooseAnswer(optionId: string) {
    if (selectedOptionId !== null || !player) return;

    const correct = optionId === currentQuestion.correctOptionId;

    setSelectedOptionId(optionId);
    setShowResult(true);

    if (correct) {
      setEarnedXp((current) => current + currentQuestion.xp);
    }

    recordActivityResult({
      id: crypto.randomUUID(),
      playerId: player.id,
      activityType: "story_question",
      activityId: currentQuestion.id,
      storyId: story!.id,
      skills: currentQuestion.skills,
      correct,
      attempts: 1,
      hintsUsed: 0,
      difficulty: currentQuestion.difficulty,
      xpAwarded: correct ? currentQuestion.xp : 0,
      timestamp: new Date().toISOString(),
    });
  }

  function nextQuestion() {
    if (question < questions.length - 1) {
      setQuestion((current) => current + 1);
      setSelectedOptionId(null);
      setShowResult(false);
    } else {
      setFinished(true);
      awardXP(earnedXp);
      markStoryCompleted(story!.id);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8">

        {/* Header */}
        <header className="flex items-center justify-between">
          <Link
            href="/story"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl hover:bg-white/10"
          >
            ←
          </Link>

          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Story Quest
            </p>

            <h1 className="text-xl font-black">
              {story.title}
            </h1>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            ⭐ {earnedXp} XP
          </div>
        </header>

        {/* READING MODE */}
        {!readingFinished && (
          <section className="mt-8">

            {/* Progress */}
            <div className="mb-5">
              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>Reading</span>
                <span>
                  Page {scene + 1} of {story.scenes.length}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all"
                  style={{
                    width: `${((scene + 1) / story.scenes.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Story card */}
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">

              <div className="flex h-64 items-center justify-center bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-8xl">
                {story.scenes[scene].illustration}
              </div>

              <div className="p-7 sm:p-10">

                <div className="mb-5 flex items-center justify-between">
                  <span className="rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-300">
                    📖 Read carefully
                  </span>

                  <button className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/15">
                    🔊 Listen
                  </button>
                </div>

                <p className="text-xl font-medium leading-9 text-slate-200 sm:text-2xl sm:leading-10">
                  {story.scenes[scene].text}
                </p>

                <button
                  onClick={nextScene}
                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 py-4 text-lg font-black text-slate-950 transition hover:scale-[1.01]"
                >
                  {scene === story.scenes.length - 1
                    ? "Finish Reading →"
                    : "Next Page →"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* QUESTIONS */}
        {readingFinished && !finished && currentQuestion && (
          <section className="mt-8">

            <div className="mb-8 text-center">
              <div className="text-6xl">🧠</div>

              <p className="mt-4 text-sm font-bold uppercase tracking-widest text-emerald-400">
                Comprehension Challenge
              </p>

              <h2 className="mt-2 text-3xl font-black sm:text-4xl">
                Question {question + 1} of {questions.length}
              </h2>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10">

              <h3 className="text-2xl font-black leading-tight sm:text-3xl">
                {currentQuestion.prompt}
              </h3>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {currentQuestion.options.map((option, index) => {

                  const isCorrect =
                    selectedOptionId !== null &&
                    option.id === currentQuestion.correctOptionId;

                  const isWrong =
                    selectedOptionId === option.id &&
                    option.id !== currentQuestion.correctOptionId;

                  return (
                    <button
                      key={option.id}
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

                      {isCorrect && (
                        <span className="float-right">✓</span>
                      )}

                      {isWrong && (
                        <span className="float-right">✕</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div
                  className={`mt-6 rounded-2xl p-5 ${
                    selectedOptionId === currentQuestion.correctOptionId
                      ? "bg-emerald-500/10"
                      : "bg-orange-500/10"
                  }`}
                >
                  <p className="text-lg font-black">
                    {selectedOptionId === currentQuestion.correctOptionId
                      ? "🎉 Excellent!"
                      : "❌ Not quite."}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {currentQuestion.explanation}
                  </p>

                  {selectedOptionId === currentQuestion.correctOptionId && (
                    <p className="mt-3 font-black text-yellow-400">
                      ⭐ +{currentQuestion.xp} XP
                    </p>
                  )}

                  {selectedOptionId !== currentQuestion.correctOptionId &&
                    currentQuestion.word &&
                    currentQuestion.partOfSpeech && (
                      <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm leading-6 text-slate-300">
                        <p>
                          Word to remember: {" "}
                          <span className="font-black text-red-300">
                            {currentQuestion.word}
                          </span>{" "}
                          is an {currentQuestion.partOfSpeech}.
                        </p>
                        {relatedChallenge && (
                          <Link
                            href={`/challenge/${relatedChallenge.id}`}
                            className="mt-3 inline-block font-black text-yellow-300 hover:text-yellow-200"
                          >
                            Try a related challenge →
                          </Link>
                        )}
                      </div>
                    )}

                  <button
                    onClick={nextQuestion}
                    className="mt-5 w-full rounded-2xl bg-white py-3 font-black text-slate-950 hover:bg-yellow-300"
                  >
                    {question === questions.length - 1
                      ? "See My Results 🏆"
                      : "Next Question →"}
                  </button>
                </div>
              )}

            </div>
          </section>
        )}

        {/* FINISHED */}
        {finished && (
          <section className="mt-12 text-center">

            <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-8 sm:p-12">

              <div className="text-7xl">🏆</div>

              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-yellow-300">
                Story Complete!
              </p>

              <h2 className="mt-2 text-4xl font-black">
                Amazing work!
              </h2>

              <p className="mx-auto mt-4 max-w-md text-white/70">
                You finished {story.title} and completed the reading
                challenge.
              </p>

              <div className="mx-auto mt-8 flex max-w-sm justify-center gap-4">

                <div className="flex-1 rounded-2xl bg-white/10 p-5">
                  <p className="text-xs text-white/60">
                    XP EARNED
                  </p>
                  <p className="mt-2 text-3xl font-black text-yellow-300">
                    ⭐ {earnedXp}
                  </p>
                </div>

                <div className="flex-1 rounded-2xl bg-white/10 p-5">
                  <p className="text-xs text-white/60">
                    QUESTIONS
                  </p>
                  <p className="mt-2 text-3xl font-black">
                    {questions.length}
                  </p>
                </div>

              </div>

              <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
                <Link
                  href="/story"
                  className="flex-1 rounded-2xl bg-white/10 py-4 text-center font-black hover:bg-white/15"
                >
                  More Stories 🌳
                </Link>

                <Link
                  href="/"
                  className="flex-1 rounded-2xl bg-white py-4 text-center font-black text-indigo-700 hover:bg-yellow-300"
                >
                  See My Progress ⭐
                </Link>
              </div>

            </div>

          </section>
        )}

        <WordHelper
          className="mt-8"
          initialText={readingFinished ? currentQuestion?.word : undefined}
        />

      </div>
    </main>
  );
}
