"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getChallengeSession } from "@/lib/challenge";
import { getActivityResults, recordActivityResult } from "@/lib/player";
import { usePlayer } from "@/hooks/usePlayer";
import { Button } from "@/components/Button";
import { WordHelper } from "@/components/WordHelper";

export default function ChallengePage() {
  const params = useParams<{ id: string }>();
  const challengeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const session = useMemo(() => getChallengeSession(challengeId), [challengeId]);
  const startIndex = Math.max(0, session.challenges.findIndex((item) => item.id === challengeId));
  const { player, loading, awardXP } = usePlayer();
  const [index, setIndex] = useState(startIndex);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => setIndex(startIndex), [startIndex]);
  useEffect(() => { if (!loading && !player) window.location.href = "/players"; }, [loading, player]);
  if (loading || !player) return null;

  const activePlayer = player;
  const challenge = session.challenges[index];
  if (!challenge) return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><div className="text-center"><div className="text-6xl">🧭</div><h1 className="mt-6 text-3xl font-black">Challenge not found</h1><Link href="/" className="mt-8 inline-block"><Button variant="primary">Back Home</Button></Link></div></main>;

  const answered = selected !== null;
  const correct = selected === challenge.correctOptionId;

  function answer(optionId: string) {
    if (answered) return;
    const isCorrect = optionId === challenge.correctOptionId;
    setSelected(optionId);
    if (isCorrect) setScore((value) => value + 1);
    recordActivityResult({ id: crypto.randomUUID(), playerId: activePlayer.id, activityType: "practice_challenge", activityId: challenge.id, skills: [challenge.skill], curriculumId: challenge.curriculumId, strand: challenge.strand, subStrand: challenge.subStrand, concept: challenge.concept, correct: isCorrect, attempts: 1, hintsUsed: 0, difficulty: challenge.difficulty, xpAwarded: isCorrect ? challenge.xp : 0, timestamp: new Date().toISOString() });
    if (isCorrect) awardXP(challenge.xp);
  }

  function next() {
    if (!answered) return;
    const finalScore = score + (correct ? 1 : 0);
    if (index < session.challenges.length - 1) { setIndex((value) => value + 1); setSelected(null); return; }
    const passed = finalScore / session.challenges.length >= 0.7;
    if (!getActivityResults(activePlayer.id).some((result) => result.activityId === session.completionActivityId && result.correct === true)) {
      recordActivityResult({ id: crypto.randomUUID(), playerId: activePlayer.id, activityType: "practice_challenge", activityId: session.completionActivityId, skills: [challenge.skill], curriculumId: challenge.curriculumId, strand: challenge.strand, subStrand: challenge.subStrand, concept: challenge.concept, correct: passed, attempts: session.challenges.length, hintsUsed: 0, difficulty: challenge.difficulty, xpAwarded: 0, timestamp: new Date().toISOString() });
    }
    setScore(finalScore);
    setFinished(true);
  }

  if (finished) {
    const passed = score / session.challenges.length >= 0.7;
    return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-2xl px-5 py-10"><section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center sm:p-12"><div className="text-6xl">{passed ? "🎉" : "💪"}</div><h1 className="mt-4 text-4xl font-black">{passed ? "Great work!" : "Good effort!"}</h1><p className="mt-3 text-lg text-slate-400">You got <strong className="text-white">{score}</strong> of {session.challenges.length} correct.</p><p className="mt-3 text-sm text-slate-500">KIDDO has recorded this learning evidence and will choose your next step.</p><Link href="/" className="mt-8 block"><Button variant="primary" className="w-full">Continue Your Learning →</Button></Link></section></div></main>;
  }

  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-3xl px-5 py-6 sm:px-8"><header className="flex items-center justify-between"><Link href="/" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">←</Link><div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-purple-300">{challenge.activityType?.replace(/_/g, " ")}</p><h1 className="text-xl font-black">{challenge.concept}</h1></div><div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-yellow-300">{index + 1}/{session.challenges.length}</div></header><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${((index + (answered ? 1 : 0)) / session.challenges.length) * 100}%` }} /></div><section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10"><h2 className="text-3xl font-black leading-tight sm:text-4xl">{challenge.prompt}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{challenge.options.map((option, optionIndex) => { const isCorrect = answered && option.id === challenge.correctOptionId; const isWrong = selected === option.id && !isCorrect; return <button key={option.id} type="button" onClick={() => answer(option.id)} className={`rounded-2xl border p-5 text-left text-lg font-bold transition ${isCorrect ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : isWrong ? "border-red-400 bg-red-500/20 text-red-300" : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"}`}><span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">{String.fromCharCode(65 + optionIndex)}</span>{option.text}</button>; })}</div>{answered && <div className={`mt-6 rounded-2xl p-5 ${correct ? "bg-emerald-500/10" : "bg-orange-500/10"}`}><p className="text-lg font-black">{correct ? "🎉 Great work!" : "💡 Keep learning!"}</p><p className="mt-2 text-sm leading-6 text-slate-300">{challenge.explanation}</p><Button variant="primary" onClick={next} className="mt-5 w-full sm:w-auto">{index === session.challenges.length - 1 ? "Finish Practice →" : "Next Question →"}</Button></div>}</section><WordHelper className="mt-6" /></div></main>;
}
