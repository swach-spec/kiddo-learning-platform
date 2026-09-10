"use client";

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
  count_and_match: { label: "Count & Match", emoji: "🔢", helper: "Count carefully, then match the answer." },
  build_it: { label: "Build It", emoji: "🧱", helper: "Build the correct mathematical idea." },
  pattern_builder: { label: "Pattern Builder", emoji: "🧩", helper: "Find the rule and complete the pattern." },
  sort_and_order: { label: "Sort & Order", emoji: "↕️", helper: "Choose the option that puts the ideas in the right order." },
  calculate_it: { label: "Calculate It", emoji: "✏️", helper: "Work it out before you choose." },
  find_it: { label: "Find It", emoji: "🔎", helper: "Look closely and find the right answer." },
  build_and_measure: { label: "Build & Measure", emoji: "📏", helper: "Think about the size, amount or measurement." },
  real_life_mission: { label: "Real-Life Mission", emoji: "🎯", helper: "Use mathematics to solve a real-life problem." },
};

export default function MathActivityCard({ question, selected, answerState, onAnswer }: Props) {
  const mode = ACTIVITY_LABELS[question.activityType ?? "quick_question"] ?? ACTIVITY_LABELS.quick_question;

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
          <div className="text-5xl">{question.activityType === "real_life_mission" ? "🛒" : question.activityType === "build_and_measure" ? "📐" : "🧠"}</div>
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">{question.prompt}</h2>
        </div>

        <div className={`mx-auto mt-8 grid max-w-3xl gap-3 ${question.options.length > 3 ? "sm:grid-cols-2" : ""}`}>
          {question.options.map((option, index) => {
            const isCorrect = selected !== null && option.id === question.correctOptionId;
            const isWrong = selected === option.id && !isCorrect;
            const letter = String.fromCharCode(65 + index);

            return (
              <button
                key={option.id}
                type="button"
                disabled={selected !== null}
                onClick={() => onAnswer(option.id)}
                className={`group rounded-2xl border p-5 text-left transition duration-200 ${
                  isCorrect
                    ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                    : isWrong
                      ? "border-rose-400 bg-rose-500/20 text-rose-200"
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
