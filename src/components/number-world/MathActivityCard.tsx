"use client";

import { useEffect, useMemo, useState } from "react";
import { Challenge } from "@/types/challenge";

export type MathAnswerState = "correct" | "wrong" | null;

type Props = {
  question: Challenge;
  selected: string | null;
  answerState: MathAnswerState;
  onAnswer: (optionId: string) => void;
};

const ACTIVITY_LABELS: Record<string, { label: string; emoji: string; helper: string }> = {
  quick_question: { label: "Quick Question", emoji: "⚡", helper: "Choose the best answer." },
  count_and_match: { label: "Count & Match", emoji: "🔢", helper: "Tap each object as you count, then match the answer." },
  build_it: { label: "Build It", emoji: "🧱", helper: "Build the correct mathematical idea." },
  pattern_builder: { label: "Pattern Builder", emoji: "🧩", helper: "Find the rule and complete the pattern." },
  sort_and_order: { label: "Sort & Order", emoji: "↕️", helper: "Choose the option that puts the ideas in the right order." },
  calculate_it: { label: "Calculate It", emoji: "✏️", helper: "Work it out before you choose." },
  find_it: { label: "Find It", emoji: "🔎", helper: "Look closely and find the right answer." },
  build_and_measure: { label: "Build & Measure", emoji: "📏", helper: "Think about the size, amount or measurement." },
  real_life_mission: { label: "Real-Life Mission", emoji: "🎯", helper: "Use mathematics to solve a real-life problem." },
};

function extractCountObjects(prompt: string): string[] {
  const beforeQuestion = prompt.split(".")[0] ?? prompt;
  const matches = beforeQuestion.match(/(?:\p{Extended_Pictographic})(?:\uFE0F)?/gu);
  return matches ?? [];
}

export default function MathActivityCard({ question, selected, answerState, onAnswer }: Props) {
  const mode = ACTIVITY_LABELS[question.activityType ?? "quick_question"] ?? ACTIVITY_LABELS.quick_question;
  const objects = useMemo(() => extractCountObjects(question.prompt), [question.prompt]);
  const [counted, setCounted] = useState<number[]>([]);

  useEffect(() => {
    setCounted([]);
  }, [question.id]);

  function tapObject(index: number) {
    if (selected !== null) return;
    setCounted((items) => items.includes(index) ? items : [...items, index]);
  }

  const isCountMode = question.activityType === "count_and_match" && objects.length > 0;
  const countComplete = counted.length === objects.length;

  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
      <div className="border-b border-white/10 bg-black/10 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{mode.emoji}</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-cyan-300">{mode.label}</p>
            <p className="mt-1 text-sm text-slate-400">{mode.helper}</p>
          </div>
        </div>
      </div>

      <div className="p-7 sm:p-10">
        <div className="text-center">
          <div className="text-5xl">{question.activityType === "real_life_mission" ? "🛒" : question.activityType === "build_and_measure" ? "📐" : question.activityType === "count_and_match" ? "🔢" : "🧠"}</div>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">{question.prompt}</h2>
        </div>

        {isCountMode && (
          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-cyan-200">COUNT THE OBJECTS</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-black">{counted.length}/{objects.length}</span>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {objects.map((object, index) => {
                const wasCounted = counted.includes(index);
                return (
                  <button
                    key={`${object}-${index}`}
                    type="button"
                    onClick={() => tapObject(index)}
                    aria-label={`Count object ${index + 1}`}
                    className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border text-4xl transition duration-150 ${wasCounted ? "scale-95 border-emerald-400 bg-emerald-400/15" : "border-white/10 bg-white/5 hover:-translate-y-1 hover:border-cyan-300/50"}`}
                  >
                    {object}
                    {wasCounted && <span className="absolute right-1 top-1 text-sm font-black text-emerald-300">✓</span>}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-center text-xs text-slate-500">Tap each object once. Then choose the number below.</p>
          </div>
        )}

        <div className={`mx-auto mt-8 grid max-w-3xl gap-3 ${question.options.length > 3 ? "sm:grid-cols-2" : ""}`}>
          {question.options.map((option, index) => {
            const isCorrect = selected !== null && option.id === question.correctOptionId;
            const isWrong = selected === option.id && !isCorrect;
            const letter = String.fromCharCode(65 + index);
            const disabled = selected !== null || (isCountMode && !countComplete);

            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => onAnswer(option.id)}
                className={`group rounded-2xl border p-5 text-left transition duration-200 ${
                  isCorrect
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                    : isWrong
                      ? "border-rose-400 bg-rose-500/20 text-rose-200"
                      : disabled
                        ? "cursor-not-allowed border-white/5 bg-white/[0.03] text-slate-600"
                        : "border-white/10 bg-white/5 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-400/10"
                }`}
              >
                <span className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-black">{letter}</span>
                  <span className="text-lg font-black sm:text-xl">{option.text}</span>
                </span>
              </button>
            );
          })}
        </div>

        {isCountMode && !countComplete && selected === null && (
          <p className="mx-auto mt-5 max-w-3xl text-center text-sm font-bold text-cyan-300">Keep counting — tap all {objects.length} objects first.</p>
        )}

        {answerState && (
          <div className={`mx-auto mt-6 max-w-3xl rounded-2xl p-5 text-center ${answerState === "correct" ? "bg-emerald-500/10" : "bg-orange-500/10"}`}>
            <p className="text-lg font-black">{answerState === "correct" ? "🎉 Correct!" : "💡 Not quite."}</p>
            <p className="mt-2 text-sm text-slate-300">{question.explanation}</p>
            {answerState === "correct" && <p className="mt-2 font-black text-yellow-300">+{question.xp} XP</p>}
          </div>
        )}
      </div>
    </section>
  );
}
