"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Lesson } from "@/types/lesson";

export function LessonFlow({
  lesson,
  completed,
  onComplete,
}: {
  lesson: Lesson;
  completed: boolean;
  onComplete: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);
  const [tryAnswer, setTryAnswer] = useState<string | null>(null);
  const [tryChecked, setTryChecked] = useState(false);

  const step = lesson.steps[stepIndex];
  const isLast = stepIndex === lesson.steps.length - 1;
  const tryCorrect = useMemo(
    () => tryAnswer !== null && tryAnswer === step?.correctOption,
    [tryAnswer, step]
  );

  if (!step) return null;

  function next() {
    if (step.type === "try" && !tryChecked) {
      setTryChecked(true);
      return;
    }

    if (isLast) {
      onComplete();
      return;
    }

    setStepIndex((current) => current + 1);
    setTryAnswer(null);
    setTryChecked(false);
  }

  return (
    <div className="mt-7 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/90 shadow-2xl">
      <div className="border-b border-white/10 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Learn</p>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">{lesson.title}</h1>
            <p className="mt-1 text-sm text-slate-400">{lesson.subtitle}</p>
          </div>
          <div className="text-4xl">{lesson.icon}</div>
        </div>
        <div className="mt-5 flex gap-2">
          {lesson.steps.map((item, index) => (
            <div
              key={item.id}
              className={`h-2 flex-1 rounded-full ${index <= stepIndex ? "bg-cyan-400" : "bg-white/10"}`}
            />
          ))}
        </div>
        <p className="mt-2 text-right text-xs font-bold text-slate-500">
          Step {stepIndex + 1} of {lesson.steps.length}
        </p>
      </div>

      <div className="p-6 sm:p-10">
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <span className="inline-flex rounded-full bg-white/5 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-400">
              {step.type === "teach" && "Learn"}
              {step.type === "example" && "Watch & notice"}
              {step.type === "try" && "Try it"}
              {step.type === "master" && "Ready to practise"}
            </span>
            <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">{step.title}</h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">{step.body}</p>
          </div>

          {step.type === "teach" && (
            <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-7 text-center">
              <div className="text-6xl">💡</div>
              <p className="mt-4 text-lg font-bold text-cyan-100">Learn the idea first.</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                KIDDO will show you an example before asking you to solve anything.
              </p>
            </div>
          )}

          {step.type === "example" && (
            <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-7">
              <p className="text-center text-2xl font-black leading-10 text-white sm:text-3xl">{step.example}</p>
              {step.explanation && (
                <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-6 text-emerald-100/75">
                  {step.explanation}
                </p>
              )}
            </div>
          )}

          {step.type === "try" && step.options && (
            <div className="mt-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {step.options.map((option) => {
                  const selected = tryAnswer === option;
                  const correct = tryChecked && option === step.correctOption;
                  const wrong = tryChecked && selected && option !== step.correctOption;

                  return (
                    <button
                      key={option}
                      onClick={() => {
                        if (!tryChecked) setTryAnswer(option);
                      }}
                      className={`min-h-16 rounded-2xl border px-5 py-4 text-lg font-black transition ${
                        correct
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                          : wrong
                            ? "border-red-400 bg-red-500/20 text-red-200"
                            : selected
                              ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                              : "border-white/10 bg-white/5 hover:-translate-y-0.5 hover:bg-white/10"
                      }`}
                    >
                      {option}
                      {correct && <span className="ml-2">✓</span>}
                      {wrong && <span className="ml-2">✕</span>}
                    </button>
                  );
                })}
              </div>

              {tryChecked && (
                <div className={`mt-5 rounded-2xl p-5 ${tryCorrect ? "bg-emerald-500/10" : "bg-orange-500/10"}`}>
                  <p className="font-black">{tryCorrect ? "🎉 Nice work!" : "💡 Let's learn from that."}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {tryCorrect ? step.explanation : `The best answer is “${step.correctOption}”. ${step.explanation ?? "Keep going — you can try the full challenge next."}`}
                  </p>
                </div>
              )}
            </div>
          )}

          {step.type === "master" && (
            <div className="mt-8 rounded-3xl border border-yellow-400/20 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 p-8 text-center">
              <div className="text-6xl">⭐</div>
              <p className="mt-4 text-xl font-black">You learned the skill.</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Now move from learning to practice. Your next challenge will help you use what you just learned.
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {stepIndex > 0 && (
              <button
                onClick={() => {
                  setStepIndex((current) => current - 1);
                  setTryAnswer(null);
                  setTryChecked(false);
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 font-black text-slate-300 hover:bg-white/10"
              >
                ← Back
              </button>
            )}
            <button
              onClick={next}
              disabled={step.type === "try" && !tryAnswer}
              className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 font-black text-slate-950 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step.type === "try" && !tryChecked
                ? "Check Answer"
                : isLast
                  ? completed ? "Go to Practice →" : "Finish Lesson →"
                  : "Continue →"}
            </button>
          </div>

          {completed && isLast && (
            <div className="mt-4 text-center">
              <Link href={`/challenge/${lesson.challengeId ?? "demo-adjective-describing-word"}`} className="text-sm font-bold text-cyan-300 hover:text-cyan-200">
                Skip straight to the practice challenge →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
