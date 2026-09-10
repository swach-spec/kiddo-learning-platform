"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getCBCNumberWorldChallenges } from "@/content/number-world-cbc";
import { getMathSkillInsights, getNextMathRecommendation } from "@/lib/math-learning";
import { awardXP, getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { Player } from "@/lib/kiddo";
import { Challenge } from "@/types/challenge";
import { Grade } from "@/types/content";
import MathActivityCard, { MathAnswerState } from "@/components/number-world/MathActivityCard";

const SESSION_SIZE = 8;
const XP_PER_QUESTION = 10;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getGrade(value: string): Grade {
  const number = Number(value.replace(/\D/g, ""));
  return (number >= 1 && number <= 6 ? number : 1) as Grade;
}

function createSession(grade: Grade) {
  return shuffle(getCBCNumberWorldChallenges(String(grade))).slice(0, SESSION_SIZE);
}

export default function NumberWorldCBCPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [questions, setQuestions] = useState<Challenge[]>([]);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<MathAnswerState>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [complete, setComplete] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [sessionResults, setSessionResults] = useState<ReturnType<typeof getActivityResults>>([]);

  useEffect(() => {
    const current = getCurrentPlayer();
    if (!current) {
      window.location.href = "/players";
      return;
    }
    setPlayer(current);
    setQuestions(createSession(getGrade(current.grade)));
    setStartedAt(Date.now());
  }, []);

  const currentQuestion = questions[round];
  const grade = player ? getGrade(player.grade) : 1;
  const storedResults = useMemo(() => player ? getActivityResults(player.id) : [], [player, round, complete]);
  const sessionIds = useMemo(() => new Set(sessionResults.map((result) => result.id)), [sessionResults]);
  const historicalResults = storedResults.filter((result) => !sessionIds.has(result.id));
  const learningResults = [...historicalResults, ...sessionResults];
  const insights = useMemo(() => getMathSkillInsights(learningResults), [historicalResults, sessionResults]);
  const recommendation = getNextMathRecommendation(learningResults);

  function restart() {
    if (!player) return;
    setQuestions(createSession(grade));
    setRound(0);
    setSelected(null);
    setAnswerState(null);
    setCorrectCount(0);
    setEarnedXP(0);
    setComplete(false);
    setSessionResults([]);
    setStartedAt(Date.now());
  }

  function answer(optionId: string) {
    if (!player || !currentQuestion || selected !== null) return;

    const correct = optionId === currentQuestion.correctOptionId;
    const existingResults = getActivityResults(player.id);
    const alreadyRewarded = existingResults.some(
      (result) => result.activityType === "practice_challenge" && result.activityId === currentQuestion.id && result.xpAwarded > 0
    );
    const responseTimeMs = Math.max(0, Date.now() - startedAt);
    const xpAwarded = correct && !alreadyRewarded ? XP_PER_QUESTION : 0;

    if (xpAwarded) {
      awardXP(player.id, xpAwarded);
      setEarnedXP((value) => value + xpAwarded);
    }

    const result = {
      id: crypto.randomUUID(),
      playerId: player.id,
      activityType: "practice_challenge" as const,
      activityId: currentQuestion.id,
      skills: [currentQuestion.skill],
      curriculumId: currentQuestion.curriculumId,
      strand: currentQuestion.strand,
      subStrand: currentQuestion.subStrand,
      concept: currentQuestion.concept,
      responseTimeMs,
      correct,
      attempts: 1,
      hintsUsed: 0,
      difficulty: currentQuestion.difficulty,
      xpAwarded,
      timestamp: new Date().toISOString(),
    };

    recordActivityResult(result);
    setSessionResults((items) => [...items, result]);
    setSelected(optionId);
    setAnswerState(correct ? "correct" : "wrong");
    if (correct) setCorrectCount((value) => value + 1);

    window.setTimeout(() => {
      if (round + 1 >= questions.length) {
        setComplete(true);
        return;
      }
      setRound((value) => value + 1);
      setSelected(null);
      setAnswerState(null);
      setStartedAt(Date.now());
    }, 800);
  }

  if (!player || !currentQuestion) return null;

  const mastery = questions.length ? Math.round((correctCount / questions.length) * 100) : 0;
  const progressWidth = ((round + 1) / questions.length) * 100;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link href="/" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl" aria-label="Back to KIDDO">←</Link>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">KIDDO Mathematics</p>
            <h1 className="text-xl font-black sm:text-2xl">Number World 🔢</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-black">Grade {grade}</div>
        </header>

        {!complete ? (
          <>
            <section className="mt-8 rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-white/5 to-blue-500/10 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">{currentQuestion.strand}</p>
                  <h2 className="mt-2 text-2xl font-black">{currentQuestion.subStrand}</h2>
                  <p className="mt-1 text-sm text-slate-400">Concept: {currentQuestion.concept}</p>
                </div>
                <div className="text-right"><p className="text-xs text-slate-500">QUESTION</p><p className="text-2xl font-black">{round + 1}/{questions.length}</p></div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${progressWidth}%` }} /></div>
            </section>

            <MathActivityCard question={currentQuestion} selected={selected} answerState={answerState} onAnswer={answer} />
          </>
        ) : (
          <section className="mx-auto mt-12 max-w-3xl rounded-[2rem] border border-cyan-400/20 bg-gradient-to-br from-cyan-500/15 via-white/5 to-blue-500/10 p-8 sm:p-12">
            <div className="text-center">
              <div className="text-7xl">{mastery >= 80 ? "🏆" : mastery >= 50 ? "🌟" : "💪"}</div>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-cyan-300">Number World Complete</p>
              <h2 className="mt-2 text-4xl font-black">{mastery >= 80 ? "Amazing work!" : "Keep practising!"}</h2>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/5 p-4 text-center"><p className="text-xs text-slate-500">SCORE</p><p className="mt-1 text-2xl font-black">{correctCount}/{questions.length}</p></div>
              <div className="rounded-2xl bg-white/5 p-4 text-center"><p className="text-xs text-slate-500">MASTERY</p><p className="mt-1 text-2xl font-black text-cyan-300">{mastery}%</p></div>
              <div className="rounded-2xl bg-white/5 p-4 text-center"><p className="text-xs text-slate-500">XP</p><p className="mt-1 text-2xl font-black text-yellow-300">+{earnedXP}</p></div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">What KIDDO learned</p>
              <div className="mt-4 space-y-3">
                {insights.slice(-8).map((insight) => (
                  <div key={insight.concept} className="flex items-center justify-between gap-4">
                    <span className="text-sm font-bold text-slate-200">{insight.concept}</span>
                    <span className="font-black text-cyan-300">{insight.accuracy}% · {insight.mastery}</span>
                  </div>
                ))}
              </div>
            </div>

            {recommendation && <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5"><p className="text-xs font-bold uppercase tracking-widest text-cyan-300">KIDDO recommendation</p><p className="mt-2 font-black">{recommendation}</p></div>}
            <div className="mt-6 flex flex-wrap justify-center gap-3"><button type="button" onClick={restart} className="rounded-2xl bg-cyan-400 px-6 py-3 font-black text-slate-950">Play again</button><Link href="/" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-black">Back to KIDDO</Link></div>
          </section>
        )}
      </div>
    </main>
  );
}
