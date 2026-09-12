"use client";

import { useEffect, useState } from "react";
import { grade2DescribingGuided } from "@/content/challenges/grade-2-english";
import { buildPracticeSession, evaluatePracticeSession } from "@/lib/learning-session";
import { getCurrentPlayer, awardXP, recordActivityResult } from "@/lib/player";

export default function Grade2GuidedPage() {
  const [session] = useState(() => buildPracticeSession(grade2DescribingGuided, 5));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(() => Date.now());

  const current = session[index];

  useEffect(() => { document.title = "Guided Practice | KIDDO"; }, []);

  function answer(optionId: string) {
    if (selected || !current) return;
    setSelected(optionId);
    if (optionId === current.correctOptionId) setScore((value) => value + 1);
  }

  function next() {
    if (!selected) return;
    if (index === session.length - 1) {
      const finalScore = score + (selected === current.correctOptionId ? 1 : 0);
      const result = evaluatePracticeSession(finalScore, session.length);
      const player = getCurrentPlayer();
      if (player) {
        const xp = result.passed ? 30 : 10;
        awardXP(player.id, xp);
        recordActivityResult({ id: `g2-guided-${Date.now()}`, playerId: player.id, activityType: "practice_challenge", activityId: "g2-describing-guided", skills: ["grammar", "vocabulary", "reading"], curriculumId: "g2-describing-words", strand: "Reading", subStrand: "Language Patterns and Comprehension", concept: "describing words", correct: result.passed, attempts: session.length, hintsUsed: 0, responseTimeMs: Date.now() - startedAt, xpAwarded: xp, difficulty: 1, timestamp: new Date().toISOString() });
      }
      setScore(finalScore);
      setDone(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected(null);
  }

  if (done) {
    const result = evaluatePracticeSession(score, session.length);
    return <main className="mx-auto max-w-2xl p-6"><div className="rounded-3xl border bg-white p-8 text-center shadow-sm"><div className="text-5xl">{result.passed ? "⭐" : "💪"}</div><h1 className="mt-4 text-3xl font-bold">{result.passed ? "Great work!" : "Good try!"}</h1><p className="mt-2 text-lg">You scored {score} out of {session.length}.</p><p className="mt-4 text-slate-600">{result.passed ? "You are ready for the next step." : "Let’s strengthen this skill before moving on."}</p><a href="/" className="mt-6 inline-block rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white">Back to My Journey</a></div></main>;
  }

  if (!current) return null;
  return <main className="mx-auto max-w-2xl p-6"><div className="mb-6"><p className="text-sm font-semibold text-slate-500">GRADE 2 • GUIDED PRACTICE</p><h1 className="mt-2 text-3xl font-bold">Describing Words</h1><p className="mt-2 text-slate-600">Question {index + 1} of {session.length}</p></div><div className="rounded-3xl border bg-white p-6 shadow-sm"><h2 className="text-xl font-semibold">{current.prompt}</h2><div className="mt-6 grid gap-3">{current.options.map((option) => <button key={option.id} onClick={() => answer(option.id)} className={`rounded-2xl border p-4 text-left font-medium ${selected === option.id ? (option.id === current.correctOptionId ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50") : "hover:bg-slate-50"}`}>{option.label}</button>)}</div>{selected && <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm">{selected === current.correctOptionId ? "Correct! " : "Not quite. "}{current.explanation}</div>}<button disabled={!selected} onClick={next} className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-40">{index === session.length - 1 ? "Finish Practice" : "Next Question"}</button></div></main>;
}
