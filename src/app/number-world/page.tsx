"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Challenge } from "@/types/challenge";
import { Grade } from "@/types/content";
import { Player } from "@/lib/kiddo";
import { awardXP, getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { getNumberWorldChallenges } from "@/content/number-world";
import { getMathLearningContext, getMathSkillInsights, getNextMathRecommendation } from "@/lib/math-learning";

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

function getGrade(value: string): Grade {
  const number = Number(value.replace(/\D/g, ""));
  return (number >= 1 && number <= 6 ? number : 1) as Grade;
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
  const [questionStartedAt, setQuestionStartedAt] = useState(0);
  const [sessionResults, setSessionResults] = useState<ReturnType<typeof getActivityResults>>([]);

  useEffect(() => {
    const current = getCurrentPlayer();
    if (!current) {
      window.location.href = "/players";
      return;
    }
    setPlayer(current);
    setQuestions(createSession(current.grade));
    setQuestionStartedAt(Date.now());
  }, []);

  const currentQuestion = questions[round];
  const grade = player ? getGrade(player.grade) : 1;
  const curriculumContext = currentQuestion ? getMathLearningContext(grade, currentQuestion.skill) : null;
  const activityResults = useMemo(
    () => (player ? getActivityResults(player.id) : []),
    [player, round, complete]
  );
  const insights = useMemo(
    () => getMathSkillInsights([...activityResults, ...sessionResults]),
    [activityResults, sessionResults]
  );
  const recommendation = getNextMathRecommendation([...activityResults, ...sessionResults]);

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
    setSessionResults([]);
    setQuestionStartedAt(Date.now());
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
    const responseTimeMs = Math.max(0, Date.now() - questionStartedAt);
    const context = getMathLearningContext(grade, currentQuestion.skill);

    setSelected(optionId);
    setAnswerState(correct ? "correct" : "wrong");
    setAnsweredIds((current) => new Set(current).add(currentQuestion.id));
    if (correct) setCorrectCount((current) => current + 1);

    const xpAwarded = correct && firstCompletion ? XP_PER_QUESTION : 0;
    if (xpAwarded > 0) {
      awardXP(player.id, xpAwarded);
      setEarnedXP((current) => current + xpAwarded);
    }

    const result = {
      id: crypto.randomUUID(),
      playerId: player.id,
      activityType: "practice_challenge" as const,
      activityId: currentQuestion.id,
      skills: [currentQuestion.skill],
      curriculumId: context.curriculumId,
      strand: context.strand,
      subStrand: context.subStrand,
      concept: context.concept,
      responseTimeMs,
      correct,
      attempts: 1,
      hintsUsed: 0,
      difficulty: currentQuestion.difficulty,
      xpAwarded,
      timestamp: new Date().toISOString(),
    };

    recordActivityResult(result);
    setSessionResults((current) => [...current, result]);

    window.setTimeout(() => {
      if (round + 1 >= questions.length) {
        setComplete(true);
      } else {
        setRound((current) => current + 1);
        setSelected(null);
        setAnswerState(null);
        setQuestionStartedAt(Date.now());
      }
    }, 700);
  }

  if (!player || questions.length === 0) return null;

  const score = correctCount;
  const mastery = Math.round((score / questions.length) * 100);
  const topicLabel = curriculumContext?.concept ?? currentQuestion?.skill.replace(/_/g, " ") ?? "maths";

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
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Grade {grade}</p>
                  <p className="mt-2 text-lg font-black">{curriculumContext?.strand ?? "Mathematics"}</p>
                  <p className="mt-1 text-sm text-slate-400">{curriculumContext?.subStrand ?? "Practice"} · {topicLabel}</p>
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
                        isCorrect ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : isWrong ? "border-rose-400 bg-rose-500/20 text-rose-300" : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"
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

            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500">
              <span>⭐ XP earned: <strong className="text-yellow-300">{earnedXP}</strong></span>
              <span>{answeredIds.size} answered</span>
              <span className="text-cyan-300">Learning signal: {topicLabel}</span>
            </div>
          </>
        )}

        {complete && (
          <section className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-white/5 to-blue-500/10 p-8 sm:p-12">
            <div className="text-center">
              <div className="text-7xl">{mastery >= 80 ? "🏆" : mastery >= 50 ? "🌟" : "💪"}</div>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-cyan-300">Number World Complete</p>
              <h2 className="mt-2 text-4xl font-black">{mastery >= 80 ? "Amazing work!" : "Keep practising!"}</h2>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">SCORE</p><p className="mt-1 text-2xl font-black">{score}/{questions.length}</p></div>
                <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">MASTERY</p><p className="mt-1 text-2xl font-black text-cyan-300">{mastery}%</p></div>
                <div className="rounded-2xl bg-white/5 p-4"><p className="text-xs text-slate-500">XP</p><p className="mt-1 text-2xl font-black text-yellow-300">+{earnedXP}</p></div>
              </div>
            </div>

            {insights.length > 0 && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">What KIDDO learned</p>
                <div className="mt-4 space-y-3">
                  {insights.slice(0, 4).map((insight) => (
                    <div key={insight.concept} className="flex items-center justify-between gap-4">
                      <span className="capitalize text-sm font-bold text-slate-200">{insight.concept}</span>
                      <span className={`text-sm font-black ${insight.mastery === "secure" ? "text-emerald-300" : insight.mastery === "developing" ? "text-yellow-300" : "text-orange-300"}`}>
                        {insight.accuracy}% · {insight.mastery}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recommendation && (
              <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">KIDDO recommendation</p>
                <p className="mt-2 font-black text-white">{recommendation}</p>
                <p className="mt-1 text-sm text-slate-400">This is the beginning of KIDDO's learner-guidance layer. As more evidence is collected, recommendations can become increasingly targeted.</p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button type="button" onClick={restart} className="rounded-2xl bg-cyan-400 px-7 py-4 font-black text-slate-950 hover:bg-cyan-300">↻ Play Again</button>
              <Link href="/" className="rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-center font-black hover:bg-white/10">← Back Home</Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
