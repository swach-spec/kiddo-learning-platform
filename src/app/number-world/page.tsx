"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Challenge } from "@/types/challenge";
import { Player } from "@/lib/kiddo";
import { awardXP, getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { getNumberWorldChallenges } from "@/content/number-world";

const SESSION_SIZE = 8;
const XP_PER_QUESTION = 10;

type AnswerState = "correct" | "wrong" | null;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function createSession(grade: string): Challenge[] {
  const bank = getNumberWorldChallenges(grade);
  return shuffle(bank).slice(0, Math.min(SESSION_SIZE, bank.length));
}

export default function NumberWorldPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [questions, setQuestions] = useState<Challenge[]>([]);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [complete, setComplete] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const current = getCurrentPlayer();
    if (!current) {
      window.location.href = "/players";
      return;
    }
    setPlayer(current);
    setQuestions(createSession(current.grade));
  }, []);

  const currentQuestion = questions[round];
  const activityResults = useMemo(
    () => (player ? getActivityResults(player.id) : []),
    [player, round, complete]
  );

  function restart() {
    if (!player) return;
    setQuestions(createSession(player.grade));
    setRound(0);
    setSelected(null);
    setAnswerState(null);
    setCorrectCount(0);
    setEarnedXP(0);
    setComplete(false);
    setAnsweredIds(new Set());
  }

  function chooseAnswer(optionId: string) {
    if (!player || !currentQuestion || selected !== null) return;

    const correct = optionId === currentQuestion.correctOptionId;
    const firstCompletion = !activityResults.some(
      (result) =>
        result.activityType === "practice_challenge" &&
        result.activityId === currentQuestion.id &&
        result.xpAwarded > 0
    );

    setSelected(optionId);
    setAnswerState(correct ? "correct" : "wrong");
    setAnsweredIds((current) => new Set(current).add(currentQuestion.id));

    if (correct) setCorrectCount((current) => current + 1);

    const xpAwarded = correct && firstCompletion ? XP_PER_QUESTION : 0;
    if (xpAwarded > 0) {
      awardXP(player.id, xpAwarded);
      setEarnedXP((current) => current + xpAwarded);
    }

    recordActivityResult({
      id: crypto.randomUUID(),
      playerId: player.id,
      activityType: "practice_challenge",
      activityId: currentQuestion.id,
      skills: [currentQuestion.skill],
      correct,
      attempts: 1,
      hintsUsed: 0,
      difficulty: currentQuestion.difficulty,
      xpAwarded,
      timestamp: new Date().toISOString(),
    });

    window.setTimeout(() => {
      if (round + 1 >= questions.length) {
        setComplete(true);
      } else {
        setRound((current) => current + 1);
        setSelected(null);
        setAnswerState(null);
      }
    }, 700);
  }

  if (!player || questions.length === 0) return null;

  const score = correctCount;
  const mastery = Math.round((score / questions.length) * 100);
  const topicLabel = currentQuestion?.skill.replace(/_/g, " ") ?? "maths";

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl hover:bg-white/10">←</Link>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">KIDDO Learning World</p>
            <h1 className="text-xl font-black sm:text-2xl">Number World 🔢</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-black">{player.name}</div>
        </header>

        {!complete && currentQuestion && (
          <>
            <section className="mt-8 rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-white/5 to-blue-500/10 p-6 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Grade {player.grade.replace(/\D/g, "") || player.grade}</p>
                  <p className="mt-1 text-sm capitalize text-slate-400">{topicLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">QUESTION</p>
                  <p className="text-2xl font-black">{round + 1} / {questions.length}</p>
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${((round + 1) / questions.length) * 100}%` }} />
              </div>
            </section>

            <section className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10">
              <div className="text-center">
                <div className="text-5xl">🧠</div>
                <p className="mt-5 text-xs font-bold uppercase tracking-widest text-slate-500">Solve this</p>
                <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-black leading-tight sm:text-4xl">{currentQuestion.prompt}</h2>
              </div>

              <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-2">
                {currentQuestion.options.map((option, index) => {
                  const isCorrect = selected !== null && option.id === currentQuestion.correctOptionId;
                  const isWrong = selected === option.id && !isCorrect;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={selected !== null}
                      onClick={() => chooseAnswer(option.id)}
                      className={`rounded-2xl border p-5 text-left text-xl font-black transition ${
                        isCorrect
                          ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                          : isWrong
                            ? "border-rose-400 bg-rose-500/20 text-rose-300"
                            : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"
                      }`}
                    >
                      <span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm">{String.fromCharCode(65 + index)}</span>
                      {option.text}
                    </button>
                  );
                })}
              </div>

              {answerState && (
                <div className={`mx-auto mt-6 max-w-2xl rounded-2xl p-5 text-center ${answerState === "correct" ? "bg-emerald-500/10" : "bg-orange-500/10"}`}>
                  <p className="text-lg font-black">{answerState === "correct" ? "🎉 Correct!" : "💡 Not quite."}</p>
                  <p className="mt-2 text-sm text-slate-300">{currentQuestion.explanation}</p>
                  {answerState === "correct" && <p className="mt-2 font-black text-yellow-300">+{XP_PER_QUESTION} XP</p>}
                </div>
              )}
            </section>

            <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
              <span>⭐ XP earned this session: <strong className="text-yellow-300">{earnedXP}</strong></span>
              <span>{answeredIds.size} answered</span>
            </div>
          </>
        )}

        {complete && (
          <section className="mx-auto mt-16 max-w-2xl rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-white/5 to-blue-500/10 p-8 text-center sm:p-12">
            <div className="text-7xl">{mastery >= 80 ? "🏆" : mastery >= 50 ? "🌟" : "💪"}</div>
            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-cyan-300">Number World Complete</p>
            <h2 className="mt-2 text-4xl font-black">{mastery >= 80 ? "Amazing work!" : "Keep practising!"}</h2>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">SCORE</p><p className="mt-1 text-2xl font-black">{score}/{questions.length}</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">MASTERY</p><p className="mt-1 text-2xl font-black text-cyan-300">{mastery}%</p></div>
              <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">XP</p><p className="mt-1 text-2xl font-black text-yellow-300">+{earnedXP}</p></div>
            </div>
            <p className="mt-6 text-slate-400">Your answers are recorded as learning signals so KIDDO can eventually guide what you practise next.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={restart} className="rounded-2xl bg-cyan-400 px-7 py-4 font-black text-slate-950 hover:bg-cyan-300">↻ Play Again</button>
              <Link href="/" className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 font-black hover:bg-white/10">← Back Home</Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
