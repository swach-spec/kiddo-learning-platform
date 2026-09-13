"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getChallengeSession } from "@/lib/challenge";
import { getActivityResults, recordActivityResult } from "@/lib/player";
import { usePlayer } from "@/hooks/usePlayer";
import { Button } from "@/components/Button";
import { WordHelper } from "@/components/WordHelper";
import { getEnglishPath } from "@/content/curriculum/english-path";
import { getProgressionDecision } from "@/lib/progression";
import type { CurriculumNode } from "@/types/curriculum-path";

export default function ChallengePage() {
  const params = useParams<{ id: string }>();
  const challengeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const session = useMemo(() => getChallengeSession(challengeId), [challengeId]);
  const startIndex = Math.max(0, session.challenges.findIndex((item) => item.id === challengeId));
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const curriculumNodeId = searchParams?.get("node") ?? null;
  const isSupportActivity = challengeId.startsWith("g2-support-") || searchParams?.get("support") === "1";
  const { player, loading, awardXP } = usePlayer();
  const [index, setIndex] = useState(startIndex);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

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
    recordActivityResult({ id: crypto.randomUUID(), playerId: activePlayer.id, activityType: "practice_challenge", activityId: challenge.id, curriculumNodeId: isSupportActivity ? undefined : curriculumNodeId ?? undefined, skills: [challenge.skill], curriculumId: challenge.curriculumId, strand: challenge.strand, subStrand: challenge.subStrand, concept: challenge.concept, correct: isCorrect, attempts: 1, hintsUsed: 0, difficulty: challenge.difficulty, xpAwarded: isCorrect ? challenge.xp : 0, timestamp: new Date().toISOString(), sessionId });
    if (isCorrect) awardXP(challenge.xp);
  }

  function next() {
    if (!answered) return;
    if (index < session.challenges.length - 1) { setIndex((value) => value + 1); setSelected(null); return; }

    // `score` already contains the current answer because this runs on the
    // render after the answer was selected. Adding `correct` here double-counts
    // the final question and can produce impossible scores such as 7 of 6.
    const finalScore = score;
    if (!getActivityResults(activePlayer.id).some((result) => result.activityId === session.completionActivityId && result.curriculumNodeId === (isSupportActivity ? undefined : curriculumNodeId ?? undefined) && result.sessionId === sessionId && result.isSessionSummary === true)) {
      const passed = finalScore / session.challenges.length >= 0.7;
      recordActivityResult({ id: crypto.randomUUID(), playerId: activePlayer.id, activityType: "practice_challenge", activityId: session.completionActivityId, curriculumNodeId: isSupportActivity ? undefined : curriculumNodeId ?? undefined, skills: [challenge.skill], curriculumId: challenge.curriculumId, strand: challenge.strand, subStrand: challenge.subStrand, concept: challenge.concept, correct: passed, attempts: session.challenges.length, hintsUsed: 0, difficulty: challenge.difficulty, xpAwarded: 0, timestamp: new Date().toISOString(), sessionId, isSessionSummary: true, score: finalScore, totalQuestions: session.challenges.length });
    }
    setScore(finalScore);
    setFinished(true);
  }

  if (finished) {
    const passed = score / session.challenges.length >= 0.7;
    const grade = Number(activePlayer.grade.match(/\d+/)?.[0] ?? 2);
    const node: CurriculumNode | null = curriculumNodeId ? getEnglishPath(grade).find((item) => item.id === curriculumNodeId) ?? null : null;
    const results = getActivityResults(activePlayer.id);
    const progression = node && !isSupportActivity ? getProgressionDecision(results, getEnglishPath(node.grade), node) : null;

    // A support activity is an intervention, not a curriculum step. It must
    // return the learner to the original node rather than accidentally moving
    // them forward or creating another support loop.
    const destinationNode = isSupportActivity ? node : progression?.outcome === "support" ? progression.node : progression?.nextNode;
    const destinationHref = destinationNode ? `${destinationNode.route}?node=${encodeURIComponent(destinationNode.id)}` : "/";
    const destinationLabel = isSupportActivity ? "Return to This Skill →" : progression?.outcome === "support" ? "Try a Support Activity →" : destinationNode ? `Continue to ${destinationNode.title} →` : "Continue Your Learning →";
    const headline = isSupportActivity ? (passed ? "Good work — keep building!" : "Let’s keep strengthening this skill.") : progression?.outcome === "support" ? "Let’s strengthen this skill." : progression?.outcome === "advance" ? "You’re ready for the next step!" : passed ? "Great work!" : "Good effort!";
    const message = isSupportActivity ? "This support activity gives you another chance to practise the idea before moving on." : progression?.outcome === "support" ? "KIDDO noticed that this idea needs more support before you move on." : progression?.outcome === "advance" ? "You have met the evidence needed for this step." : "Keep practising. KIDDO is using your work to decide what you need next.";

    return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-2xl px-5 py-10"><section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center sm:p-12"><div className="text-6xl">{isSupportActivity ? "🧩" : progression?.outcome === "support" ? "🧩" : passed ? "🎉" : "💪"}</div><h1 className="mt-4 text-4xl font-black">{headline}</h1><p className="mt-3 text-lg text-slate-400">You got <strong className="text-white">{score}</strong> of {session.challenges.length} correct.</p><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">{message}</p><Link href={destinationHref} className="mt-8 flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950">{destinationLabel}</Link></section></div></main>;
  }

  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-3xl px-5 py-6 sm:px-8"><header className="flex items-center justify-between"><Link href="/" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">←</Link><div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-purple-300">{challenge.activityType?.replace(/_/g, " ")}</p><h1 className="text-xl font-black">{challenge.concept}</h1></div><div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-yellow-300">{index + 1}/{session.challenges.length}</div></header><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${((index + (answered ? 1 : 0)) / session.challenges.length) * 100}%` }} /></div><section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10"><h2 className="text-3xl font-black leading-tight sm:text-4xl">{challenge.prompt}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{challenge.options.map((option, optionIndex) => { const isCorrect = answered && option.id === challenge.correctOptionId; const isWrong = selected === option.id && !isCorrect; return <button key={option.id} type="button" onClick={() => answer(option.id)} className={`rounded-2xl border p-5 text-left text-lg font-bold transition ${isCorrect ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : isWrong ? "border-red-400 bg-red-500/20 text-red-300" : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"}`}><span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">{String.fromCharCode(65 + optionIndex)}</span>{option.text}</button>; })}</div>{answered && <div className={`mt-6 rounded-2xl p-5 ${correct ? "bg-emerald-500/10" : "bg-orange-500/10"}`}><p className="text-lg font-black">{correct ? "🎉 Great work!" : "💡 Keep learning!"}</p><p className="mt-2 text-sm leading-6 text-slate-300">{challenge.explanation}</p><Button variant="primary" onClick={next} className="mt-5 w-full sm:w-auto">{index === session.challenges.length - 1 ? "Finish Practice →" : "Next Question →"}</Button></div>}</section><WordHelper className="mt-6" /></div></main>;
}
