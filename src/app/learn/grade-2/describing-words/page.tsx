"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePlayer } from "@/hooks/usePlayer";
import { recordActivityResult, getActivityResults } from "@/lib/player";
import { grade2GuidedQuestions, grade2IndependentQuestions, grade2MasteryQuestions, grade2CompositionPrompts, Grade2PracticeMode } from "@/content/english/grade-2-describing-words";

const CONFIG = {
  guided: { title: "Guided Practice", eyebrow: "I will help you", questions: grade2GuidedQuestions, curriculumId: "english-g2-guided-practice", xp: 30, pass: 5, next: "independent", nextLabel: "Independent Practice" },
  independent: { title: "Independent Practice", eyebrow: "Show what you know", questions: grade2IndependentQuestions, curriculumId: "english-g2-independent-practice", xp: 40, pass: 5, next: "mastery", nextLabel: "Mastery Mission" },
  mastery: { title: "Mastery Mission", eyebrow: "Use the skill", questions: grade2MasteryQuestions, curriculumId: "english-g2-mastery", xp: 60, pass: 4, next: null, nextLabel: null },
} as const;

export default function Grade2DescribingWordsPage() {
  const { player, loading, awardXP } = usePlayer();
  const [mode, setMode] = useState<Grade2PracticeMode>("guided");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [compositionIndex, setCompositionIndex] = useState(0);
  const [builtWords, setBuiltWords] = useState<string[]>([]);
  const [compositionDone, setCompositionDone] = useState(0);
  const [earned, setEarned] = useState(0);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requested = query.get("mode");
    if (requested === "guided" || requested === "independent" || requested === "mastery") setMode(requested);
  }, []);

  const config = CONFIG[mode];
  const question = config.questions[index];
  const currentComposition = grade2CompositionPrompts[compositionIndex];
  const shuffledWords = useMemo(() => currentComposition ? [...currentComposition.words].sort(() => 0.5 - Math.random()) : [], [currentComposition]);

  useEffect(() => {
    setIndex(0); setSelected(null); setScore(0); setFinished(false); setCompositionIndex(0); setBuiltWords([]); setCompositionDone(0); setEarned(0);
  }, [mode]);

  if (loading || !player) return null;

  if (Number(player.grade.replace(/\D/g, "")) !== 2) {
    return <main className="min-h-screen bg-slate-950 px-5 py-12 text-white"><div className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center"><div className="text-6xl">🧭</div><h1 className="mt-5 text-3xl font-black">This adventure is for Grade 2</h1><p className="mt-3 text-slate-400">Your own grade pathway will take you to the right learning activity.</p><Link href="/" className="mt-7 inline-block rounded-2xl bg-white px-6 py-3 font-black text-slate-950">Back to my journey</Link></div></main>;
  }

  function recordAnswer(correct: boolean) {
    recordActivityResult({ id: crypto.randomUUID(), playerId: player!.id, activityType: "practice_challenge", activityId: question.id, curriculumId: config.curriculumId, skills: ["vocabulary", "grammar"], correct, attempts: 1, hintsUsed: 0, xpAwarded: 0, timestamp: new Date().toISOString() });
  }

  function choose(answer: string) {
    if (selected) return;
    const correct = answer === question.correct;
    setSelected(answer);
    if (correct) setScore((value) => value + 1);
    recordAnswer(correct);
  }

  function nextQuestion() {
    if (index < config.questions.length - 1) { setIndex((value) => value + 1); setSelected(null); return; }
    const finalScore = score + (selected === question.correct ? 1 : 0);
    if (finalScore >= config.pass) completePractice(finalScore);
    else setFinished(true);
  }

  function completePractice(finalScore: number) {
    const alreadyRewarded = getActivityResults(player!.id).some((r) => r.activityType === "lesson" && r.activityId === config.curriculumId && r.xpAwarded > 0);
    if (!alreadyRewarded) { awardXP(config.xp); setEarned(config.xp); recordActivityResult({ id: crypto.randomUUID(), playerId: player!.id, activityType: "lesson", activityId: config.curriculumId, curriculumId: config.curriculumId, skills: ["vocabulary", "grammar"], correct: true, attempts: config.questions.length, hintsUsed: 0, xpAwarded: config.xp, timestamp: new Date().toISOString() }); }
    setScore(finalScore); setFinished(true);
  }

  function chooseComposition(word: string) {
    if (builtWords.includes(word)) return;
    const next = [...builtWords, word];
    setBuiltWords(next);
    if (next.length === currentComposition.words.length) {
      const correct = next.every((word, i) => word === currentComposition.answer[i]);
      recordActivityResult({ id: crypto.randomUUID(), playerId: player.id, activityType: "practice_challenge", activityId: currentComposition.id, curriculumId: "english-g2-mastery", skills: ["grammar", "writing"], correct, attempts: 1, hintsUsed: 0, xpAwarded: 0, timestamp: new Date().toISOString() });
      if (correct) setCompositionDone((value) => value + 1);
      setTimeout(() => {
        if (compositionIndex < grade2CompositionPrompts.length - 1) { setCompositionIndex((value) => value + 1); setBuiltWords([]); }
        else finishMastery(compositionDone + (correct ? 1 : 0));
      }, 450);
    }
  }

  function finishMastery(compositions: number) {
    const passed = score >= 4 && compositions >= 2;
    if (passed) {
      const alreadyRewarded = getActivityResults(player.id).some((r) => r.activityType === "lesson" && r.activityId === "english-g2-mastery" && r.xpAwarded > 0);
      if (!alreadyRewarded) { awardXP(60); setEarned(60); recordActivityResult({ id: crypto.randomUUID(), playerId: player.id, activityType: "lesson", activityId: "english-g2-mastery", curriculumId: "english-g2-mastery", skills: ["grammar", "writing"], correct: true, attempts: 8, hintsUsed: 0, xpAwarded: 60, timestamp: new Date().toISOString() }); }
    }
    setFinished(true);
  }

  if (finished) {
    const passed = mode === "mastery" ? score >= 4 && compositionDone >= 2 : score >= config.pass;
    return <main className="min-h-screen bg-slate-950 px-5 py-8 text-white"><div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-8 text-center sm:p-12"><div className="text-7xl">{passed ? "🏆" : "💪"}</div><p className="mt-5 text-sm font-black uppercase tracking-widest text-yellow-300">{passed ? "Skill complete" : "Keep practising"}</p><h1 className="mt-2 text-4xl font-black">{passed ? "You did it!" : "Almost there!"}</h1><p className="mx-auto mt-4 max-w-lg text-white/75">{passed ? `You passed ${config.title.toLowerCase()} with ${score}/${config.questions.length}.` : `You scored ${score}/${config.questions.length}. You need ${config.pass} correct answers to move on.`}</p>{mode === "mastery" && <p className="mt-3 font-bold text-white/80">Sentence builds completed: {compositionDone}/3</p>}{earned > 0 && <p className="mt-5 text-xl font-black text-yellow-300">⭐ +{earned} XP</p>}<div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">{passed && config.next ? <Link href={`/learn/grade-2/describing-words?mode=${config.next}`} className="flex-1 rounded-2xl bg-white py-4 font-black text-slate-950">{config.nextLabel} →</Link> : passed && mode === "mastery" ? <Link href="/story/benchmark-grade-2-the-garden-clock" className="flex-1 rounded-2xl bg-white py-4 font-black text-slate-950">Read Your Story →</Link> : <button onClick={() => { setIndex(0); setSelected(null); setScore(0); setFinished(false); setCompositionIndex(0); setBuiltWords([]); setCompositionDone(0); }} className="flex-1 rounded-2xl bg-white py-4 font-black text-slate-950">Try Again →</button>}<Link href="/" className="flex-1 rounded-2xl bg-white/10 py-4 font-black">Back to Journey</Link></div></div></main>;
  }

  if (mode === "mastery" && compositionIndex < grade2CompositionPrompts.length) {
    return <main className="min-h-screen bg-slate-950 px-5 py-8 text-white"><div className="mx-auto max-w-3xl"><header className="flex items-center justify-between"><Link href="/" className="text-2xl">←</Link><div className="text-center"><p className="text-xs font-black uppercase tracking-widest text-purple-300">{config.eyebrow}</p><h1 className="text-2xl font-black">Sentence Builder</h1></div><span className="text-sm font-black text-yellow-300">{compositionIndex + 1}/3</span></header><section className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10"><p className="text-sm font-bold text-cyan-300">{currentComposition.prompt}</p><h2 className="mt-3 text-3xl font-black">Put the words in the right order.</h2><div className="mt-8 min-h-20 rounded-2xl border border-dashed border-white/20 bg-black/10 p-4 text-xl font-black">{builtWords.length ? builtWords.join(" ") : <span className="text-slate-600">Your sentence will appear here…</span>}</div><div className="mt-7 flex flex-wrap gap-3">{shuffledWords.map((word) => <button key={word} disabled={builtWords.includes(word)} onClick={() => chooseComposition(word)} className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 font-black hover:bg-white/15 disabled:opacity-30">{word}</button>)}</div></section></div></main>;
  }

  return <main className="min-h-screen bg-slate-950 px-5 py-8 text-white"><div className="mx-auto max-w-3xl"><header className="flex items-center justify-between"><Link href="/" className="text-2xl">←</Link><div className="text-center"><p className="text-xs font-black uppercase tracking-widest text-cyan-300">{config.eyebrow}</p><h1 className="text-2xl font-black">{config.title}</h1></div><span className="text-sm font-black text-yellow-300">{index + 1}/{config.questions.length}</span></header><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500" style={{ width: `${((index + 1) / config.questions.length) * 100}%` }} /></div><section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10"><p className="text-xs font-black uppercase tracking-widest text-purple-300">Describing Words • Grade 2</p><h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">{question.prompt}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{question.options.map((option) => <button key={option} onClick={() => choose(option)} disabled={Boolean(selected)} className={`rounded-2xl border p-5 text-left text-lg font-bold transition ${selected === option && option === question.correct ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : selected === option ? "border-red-400 bg-red-500/20 text-red-300" : selected && option === question.correct ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}>{option}</button>)}</div>{selected && <div className={`mt-6 rounded-2xl p-5 ${selected === question.correct ? "bg-emerald-500/10" : "bg-orange-500/10"}`}><p className="font-black">{selected === question.correct ? "🎉 Correct!" : "Not quite."}</p><p className="mt-2 text-sm leading-6 text-slate-300">{question.explanation}</p><button onClick={nextQuestion} className="mt-5 w-full rounded-2xl bg-white py-3 font-black text-slate-950">{index === config.questions.length - 1 ? "Finish →" : "Next →"}</button></div>}</section></div></main>;
}
