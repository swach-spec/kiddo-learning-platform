"use client";

import { useState } from "react";
import Link from "next/link";

const story = {
  title: "The Lost Kite",
  level: "Level 2",
  totalPages: 3,
  pages: [
    {
      text: "Tom woke up early on Saturday morning. He looked outside and saw that the sky was bright and blue. It was a perfect day to fly his favourite red kite.",
      illustration: "☀️🪁",
    },
    {
      text: "Tom ran to the field behind his house. The wind was gentle at first, and his kite rose higher and higher. Tom smiled as he watched it dance in the sky.",
      illustration: "🧒🏾🪁🌳",
    },
    {
      text: "Suddenly, a strong wind blew across the field. The kite flew over the fence and disappeared behind some trees. Tom decided to follow it and see where it had landed.",
      illustration: "💨🪁🌳",
    },
  ],
};

const questions = [
  {
    question: "What colour was Tom's kite?",
    answers: ["Blue", "Green", "Red", "Yellow"],
    correct: 2,
    explanation: "The story tells us that Tom's favourite kite was red.",
  },
  {
    question: "Where did Tom fly his kite?",
    answers: [
      "At school",
      "In the field behind his house",
      "At the beach",
      "In the forest",
    ],
    correct: 1,
    explanation: "Tom ran to the field behind his house.",
  },
  {
    question: "Why did the kite fly over the fence?",
    answers: [
      "Tom pulled it",
      "A bird carried it",
      "The kite broke",
      "A strong wind blew it",
    ],
    correct: 3,
    explanation: "A strong wind blew the kite over the fence.",
  },
];

export default function StoryPage() {
  const [page, setPage] = useState(0);
  const [question, setQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [xp, setXp] = useState(0);
  const [finished, setFinished] = useState(false);

  const readingFinished = page >= story.totalPages;

  const currentQuestion = questions[question];

  function nextPage() {
    setPage((current) => current + 1);
  }

  function chooseAnswer(index: number) {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(index);

    if (index === currentQuestion.correct) {
      setXp((current) => current + 20);
    }

    setShowResult(true);
  }

  function nextQuestion() {
    if (question < questions.length - 1) {
      setQuestion((current) => current + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setFinished(true);
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
            ⭐ {xp} XP
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
                  Page {page + 1} of {story.totalPages}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all"
                  style={{
                    width: `${((page + 1) / story.totalPages) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Story card */}
            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">

              <div className="flex h-64 items-center justify-center bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-8xl">
                {story.pages[page].illustration}
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
                  {story.pages[page].text}
                </p>

                <button
                  onClick={nextPage}
                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 py-4 text-lg font-black text-slate-950 transition hover:scale-[1.01]"
                >
                  {page === story.totalPages - 1
                    ? "Finish Reading →"
                    : "Next Page →"}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* QUESTIONS */}
        {readingFinished && !finished && (
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
                {currentQuestion.question}
              </h3>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {currentQuestion.answers.map((answer, index) => {

                  const isCorrect =
                    selectedAnswer !== null &&
                    index === currentQuestion.correct;

                  const isWrong =
                    selectedAnswer === index &&
                    index !== currentQuestion.correct;

                  return (
                    <button
                      key={answer}
                      onClick={() => chooseAnswer(index)}
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

                      {answer}

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
                    selectedAnswer === currentQuestion.correct
                      ? "bg-emerald-500/10"
                      : "bg-orange-500/10"
                  }`}
                >
                  <p className="text-lg font-black">
                    {selectedAnswer === currentQuestion.correct
                      ? "🎉 Excellent!"
                      : "💡 Almost! Let's learn from it."}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {currentQuestion.explanation}
                  </p>

                  {selectedAnswer === currentQuestion.correct && (
                    <p className="mt-3 font-black text-yellow-400">
                      ⭐ +20 XP
                    </p>
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
                You finished The Lost Kite and completed the reading challenge.
              </p>

              <div className="mx-auto mt-8 flex max-w-sm justify-center gap-4">

                <div className="flex-1 rounded-2xl bg-white/10 p-5">
                  <p className="text-xs text-white/60">
                    XP EARNED
                  </p>
                  <p className="mt-2 text-3xl font-black text-yellow-300">
                    ⭐ {xp}
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

              <Link
                href="/story"
                className="mt-8 block rounded-2xl bg-white py-4 font-black text-indigo-700 hover:bg-yellow-300"
              >
                Back to Story Forest 🌳
              </Link>

            </div>

          </section>
        )}

      </div>
    </main>
  );
}