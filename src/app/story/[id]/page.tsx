"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Player } from "@/lib/kiddo";
import { getCurrentPlayer, getActivityResults, recordActivityResult, markStoryCompleted, awardXP } from "@/lib/player";
import { getAllStories } from "@/content";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { WordHelper } from "@/components/WordHelper";
import { Button } from "@/components/Button";

export default function StoryReader() {
  const params = useParams<{ id: string }>();
  const storyId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [scene, setScene] = useState(0);
  const [question, setQuestion] = useState(0);
  const [readingFinished, setReadingFinished] = useState(false);
  const [finished, setFinished] = useState(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    const current = getCurrentPlayer();
    if (!current) { window.location.href = "/players"; return; }
    setPlayer(current);
    setLoading(false);
  }, []);

  if (loading || !player) return null;
  const story = getAllStories().find((candidate) => candidate.id === storyId);
  if (!story) return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white"><div className="text-center"><div className="text-6xl">🌳</div><h1 className="mt-6 text-3xl font-black">Story not found</h1><Link href="/story" className="mt-8 inline-block"><Button variant="primary">Back to Story Forest</Button></Link></div></main>;

  const questions = story.questions;
  const currentQuestion = questions[question];
  const correct = currentQuestion ? selectedOptionId === currentQuestion.correctOptionId : false;

  function nextScene() {
    if (scene < story.scenes.length - 1) { setScene((current) => current + 1); return; }
    setReadingFinished(true);
  }

  function chooseAnswer(optionId: string) {
    if (selectedOptionId !== null || !player || !currentQuestion) return;
    const isCorrect = optionId === currentQuestion.correctOptionId;
    setSelectedOptionId(optionId);
    setShowResult(true);
    if (isCorrect) setEarnedXp((current) => current + currentQuestion.xp);
    recordActivityResult({ id: crypto.randomUUID(), playerId: player.id, activityType: "story_question", activityId: currentQuestion.id, storyId: story.id, skills: currentQuestion.skills, correct: isCorrect, attempts: 1, hintsUsed: 0, difficulty: currentQuestion.difficulty, xpAwarded: isCorrect ? currentQuestion.xp : 0, timestamp: new Date().toISOString() });
  }

  function nextQuestion() {
    if (question < questions.length - 1) { setQuestion((current) => current + 1); setSelectedOptionId(null); setShowResult(false); return; }
    setFinished(true);
    awardXP(earnedXp);
    markStoryCompleted(story.id);
    if (!getActivityResults(player.id).some((result) => result.activityType === "story_reading" && result.activityId === story.id && result.correct === true)) {
      recordActivityResult({ id: crypto.randomUUID(), playerId: player.id, activityType: "story_reading", activityId: story.id, storyId: story.id, skills: ["reading_comprehension"], correct: true, attempts: 1, hintsUsed: 0, xpAwarded: 0, timestamp: new Date().toISOString() });
    }
  }

  if (finished) return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto max-w-2xl px-5 py-10 sm:px-8"><section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center sm:p-12"><div className="text-6xl">📖✨</div><h1 className="mt-4 text-4xl font-black">Adventure complete!</h1><p className="mt-3 text-slate-400">{story.title} is complete. KIDDO has recorded your reading evidence.</p><p className="mt-4 text-2xl font-black text-yellow-300">+{earnedXp} XP</p><Link href="/" className="mt-8 block"><Button variant="primary" className="w-full">Continue Your Learning →</Button></Link></section></div></main>;

  return <main className="min-h-screen bg-slate-950 text-white"><div className="mx-auto min-h-screen max-w-5xl px-5 py-6 sm:px-8"><header className="flex items-center justify-between"><Link href="/story" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">←</Link><div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Story Quest</p><h1 className="text-xl font-black">{story.title}</h1></div><div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">⭐ {earnedXp} XP</div></header>
    {!readingFinished && <section className="mt-8"><div className="mb-5"><div className="mb-2 flex justify-between text-xs text-slate-500"><span>Reading</span><span>Page {scene + 1} of {story.scenes.length}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${((scene + 1) / story.scenes.length) * 100}%` }} /></div></div><div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5"><div className="flex h-64 items-center justify-center bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600 text-8xl">{story.scenes[scene].illustration}</div><div className="p-7 sm:p-10"><span className="rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-bold text-emerald-300">📖 Read carefully</span><p className="mt-5 text-xl font-medium leading-9 text-slate-200 sm:text-2xl sm:leading-10">{story.scenes[scene].text}</p><button onClick={nextScene} className="mt-8 w-full rounded-2xl bg-emerald-400 py-4 text-lg font-black text-slate-950">{scene === story.scenes.length - 1 ? "Finish Reading →" : "Next Page →"}</button></div></div></section>}
    {readingFinished && currentQuestion && <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-7 sm:p-10"><p className="text-xs font-black uppercase tracking-widest text-emerald-400">Comprehension</p><h2 className="mt-3 text-3xl font-black">{currentQuestion.prompt}</h2><div className="mt-8 grid gap-4 sm:grid-cols-2">{currentQuestion.options.map((option, optionIndex) => <button key={option.id} type="button" onClick={() => chooseAnswer(option.id)} className={`rounded-2xl border p-5 text-left text-lg font-bold ${selectedOptionId !== null && option.id === currentQuestion.correctOptionId ? "border-emerald-400 bg-emerald-500/20 text-emerald-300" : selectedOptionId === option.id ? "border-red-400 bg-red-500/20 text-red-300" : "border-white/10 bg-white/5"}`}><span className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm">{String.fromCharCode(65 + optionIndex)}</span>{option.text}</button>)}</div>{showResult && <div className="mt-6 rounded-2xl bg-white/5 p-5"><p className="font-black">{correct ? "🎉 Great work!" : "💡 Keep going!"}</p><p className="mt-2 text-sm leading-6 text-slate-300">{currentQuestion.explanation}</p><Button variant="primary" onClick={nextQuestion} className="mt-5 w-full sm:w-auto">{question === questions.length - 1 ? "Finish Adventure →" : "Next Question →"}</Button></div>}</section>}
    <WordHelper className="mt-6" /></div></main>;
}
