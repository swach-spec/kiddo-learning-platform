"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getChallengeSession } from "@/lib/challenge";
import { usePlayer } from "@/hooks/usePlayer";
import { Button } from "@/components/Button";
import { WordHelper } from "@/components/WordHelper";
import { WorkedSolution } from "@/components/working/WorkedSolution";
import { SessionAnswer } from "@/lib/learning-completion";
import { FREE_PRACTICE_NODE, prepareCurriculumAttempt, submitCurriculumCompletion } from "@/lib/learning-session-flow";

export default function ChallengePage() {
  const params = useParams<{ id: string }>();
  const challengeId = Array.isArray(params.id) ? params.id[0] : params.id;
  const session = useMemo(() => getChallengeSession(challengeId), [challengeId]);

  const startIndex = 0;
  const searchParams = useSearchParams();
  const curriculumNodeId = searchParams.get("node");
  const replay = searchParams.get("replay") === "1";
  const { player, loading, refresh } = usePlayer();
  const [index, setIndex] = useState(startIndex);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<SessionAnswer[]>([]);
  const [completion, setCompletion] = useState<ReturnType<typeof submitCurriculumCompletion> | null>(null);
  const isFreePractice = !curriculumNodeId;
  const playerId = player?.id ?? null;
  // Keyed on the player id (not the player object) so refreshing XP after
  // completion does not start a stray new attempt.
  const attempt = useMemo(() => playerId ? prepareCurriculumAttempt(playerId, curriculumNodeId ?? FREE_PRACTICE_NODE, challengeId, replay) : null, [playerId, curriculumNodeId, challengeId, replay]);

  useEffect(() => { if (!loading && !player) window.location.href = "/players"; }, [loading, player]);
  if (loading || !player || !attempt) return null;

  const activePlayer = player; const activeAttempt = attempt;
  const challenge = session.challenges[index];
  if (!challenge) return <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white"><div className="text-center"><div className="text-6xl">🧭</div><h1 className="mt-6 text-3xl font-black">Challenge not found</h1><Link href="/" className="mt-8 inline-block"><Button variant="primary">Back Home</Button></Link></div></main>;

  const answered = selected !== null;
  const correct = selected === challenge.correctOptionId;

  function answer(optionId: string) {
    if (answered) return;
    const isCorrect = optionId === challenge.correctOptionId;
    setSelected(optionId);
    setAnswers((current) => [...current, { questionId: challenge.id, correct: isCorrect, xp: challenge.xp, skills: [challenge.skill], difficulty: challenge.difficulty }]);
  }

  function next() {
    if (!answered) return;
    if (index < session.challenges.length - 1) { setIndex((value) => value + 1); setSelected(null); return; }
    const result = submitCurriculumCompletion({ playerId: activePlayer.id, grade: Number(activePlayer.grade.match(/\d+/)?.[0] ?? 2), nodeId: curriculumNodeId, routeId: challengeId, sessionId: activeAttempt.id, answers });
    setCompletion(result); setFinished(true); refresh();
  }
  if (finished && completion) {
    const destinationNode = completion.nextAction?.node;
    const destinationHref = destinationNode?.route ? `${destinationNode.route}?node=${encodeURIComponent(destinationNode.id)}` : "/";
    const destinationLabel = completion.status === "invalid" || !destinationNode ? "Back to Home →" : !isFreePractice && destinationNode.id === curriculumNodeId && completion.nextAction?.route !== "remediation" && !/support/.test(challengeId) ? "Try Again →" : "Continue Your Learning →";
    const passed = completion.totalQuestions > 0 && completion.score / completion.totalQuestions >= 0.6;
    const showSupport = !isFreePractice && completion.nextAction?.route === "remediation";
    // The words must match what KIDDO actually does next: only say "next step"
    // when the learner really moves on; otherwise encourage another try.
    const wasSupport = /support/.test(challengeId);
    const movesOn = Boolean(destinationNode && destinationNode.id !== curriculumNodeId);
    const tryAgain = !isFreePractice && !showSupport && !wasSupport && completion.status !== "invalid" && !movesOn;
    const almost = completion.totalQuestions > 0 && completion.score / completion.totalQuestions >= 0.6;
    const headline = completion.status === "invalid" ? "Let’s return to your learning path." : showSupport ? "Let’s practise one part together." : isFreePractice ? (passed ? "Great practice!" : "Good effort!") : wasSupport ? (passed ? "Great work! Back to your adventure." : "Good effort!") : tryAgain ? (almost ? "So close! Let’s try once more." : "Good effort! Let’s try again.") : "You’re ready for the next step!";
    const message = completion.status === "invalid" ? "KIDDO could not save this activity as part of your learning path." : showSupport ? "KIDDO has a short practice activity ready before the next adventure." : isFreePractice ? "Practice keeps your skills sharp. Your next adventure is waiting." : wasSupport ? "You practised the tricky part. Now try the main activity again." : tryAgain ? "Practise this step one more time. Every try makes you stronger." : "Your learning path is ready for you.";    return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-2xl px-5 py-10"><section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center sm:p-12"><div className="text-6xl">{showSupport ? "🧩" : tryAgain ? "💪" : passed ? "🎉" : "💪"}</div><h1 className="mt-4 text-4xl font-black">{headline}</h1><p className="mt-3 text-lg text-slate-400">You got <strong className="text-white">{completion.score}</strong> of {completion.totalQuestions} correct.</p><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">{message}</p><a href={destinationHref} className="mt-8 flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-6 py-4 text-center font-black text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950">{destinationLabel}</a></section></div></main>;
  }

  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-3xl px-5 py-6 sm:px-8"><header className="flex items-center justify-between"><Link href="/" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">←</Link><div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-purple-300">{challenge.activityType?.replace(/_/g, " ")}</p><h1 className="text-xl font-black">{challenge.concept}</h1></div><div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-yellow-300">{index + 1}/{session.challenges.length}</div></header><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${((index + (answered ? 1 : 0)) / session.challenges.length) * 100}%` }} /></div><section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10"><h2 className="text-3xl font-black leading-tight sm:text-4xl">{challenge.prompt}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{challenge.options.map((option, optionIndex) => { const isCorrect = answered && option.id === challenge.correctOptionId; const isWrong = selected === option.id && !isCorrect; return <button key={option.id} type="button" onClick={() => answer(option.id)} className={`rounded-2xl border p-5 text-left text-lg font-bold transition ${isCorrect ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : isWrong ? "border-red-400 bg-red-500/20 text-red-300" : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"}`}><span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">{String.fromCharCode(65 + optionIndex)}</span>{option.text}</button>; })}</div>{answered && <div className={`mt-6 rounded-2xl p-5 ${correct ? "bg-emerald-500/10" : "bg-orange-500/10"}`}><p className="text-lg font-black">{correct ? "🎉 Great work!" : "💡 Keep learning!"}</p><p className="mt-2 text-sm leading-6 text-slate-300">{challenge.explanation}</p>{challenge.working && <WorkedSolution key={challenge.id} working={challenge.working} startOpen={!correct} />}<Button variant="primary" onClick={next} className="mt-5 w-full sm:w-auto">{index === session.challenges.length - 1 ? "Finish Practice →" : "Next Question →"}</Button></div>}</section>{challenge.subject === "english" && <WordHelper className="mt-6" />}</div></main>;
}
