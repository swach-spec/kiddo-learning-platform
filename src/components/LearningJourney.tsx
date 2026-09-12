"use client";

import Link from "next/link";
import { Player } from "@/lib/kiddo";
import { Story } from "@/types/content";
import { ActivityResult } from "@/types/activity";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { getEnglishPath } from "@/content/curriculum/english-path";
import { getNextLearningDecision, getPathProgress, isNodeComplete } from "@/lib/curriculum-path";

type Props = { player: Player; stories: Story[]; activityResults: ActivityResult[] };

export function LearningJourney({ player, stories, activityResults }: Props) {
  const grade = Number(player.grade.replace(/\D/g, "")) || 2;
  const path = getEnglishPath(grade);
  const progress = getPathProgress(activityResults, path);
  const decision = getNextLearningDecision(activityResults, grade);
  const gradeStories = stories.filter((story) => story.status === "ready" && story.grade === grade);
  const completedStories = gradeStories.filter((story) => player.completedStoryIds.includes(story.id)).length;
  const gamesUnlocked = player.level >= 2;

  return <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl">
    <div className="border-b border-white/10 bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-cyan-500/10 p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3"><PlayerAvatar avatar={player.avatar} size="sm" /><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Your learning journey</p><h2 className="mt-1 text-2xl font-black sm:text-3xl">Keep moving forward</h2><p className="mt-1 text-sm text-slate-400">One clear next step. KIDDO adapts the practice while keeping you on your grade pathway.</p></div></div><div className="hidden rounded-2xl bg-white/5 px-4 py-3 text-right sm:block"><p className="text-xs text-slate-400">Grade {grade}</p><p className="text-xl font-black">{progress.percent}%</p></div></div>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${progress.percent}%` }} /></div>
      <p className="mt-2 text-xs font-bold text-slate-500">{progress.completed} of {progress.total} required learning steps complete</p>
    </div>
    <div className="p-5 sm:p-8">
      {decision && <div className="mb-6 rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-black uppercase tracking-widest text-cyan-300">KIDDO&apos;s next step</p><h3 className="mt-1 text-xl font-black">{decision.node.title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{decision.reason}</p></div>{decision.node.route && <Link href={decision.node.route} className="shrink-0 rounded-2xl bg-white px-6 py-3 text-center font-black text-slate-950 hover:bg-yellow-300">{decision.action === "learn" ? "Start Learning →" : decision.action === "support" ? "Let&apos;s practise →" : decision.action === "challenge" ? "Take Challenge →" : "Practise →"}</Link>}</div></div>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{path.map((node) => { const complete = isNodeComplete(activityResults, node); const current = decision?.node.id === node.id; return <div key={node.id} className={`rounded-3xl border p-5 ${complete ? "border-emerald-400/25 bg-emerald-400/5" : current ? "border-cyan-400/35 bg-cyan-400/10" : "border-white/10 bg-white/[0.03]"}`}><div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-widest text-slate-500">{node.kind.replace(/_/g, " ")}</span><span>{complete ? "✅" : current ? "▶️" : "🔒"}</span></div><p className="mt-4 text-xs font-black uppercase tracking-widest text-cyan-300">{node.concept}</p><h3 className="mt-1 text-lg font-black">{node.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{node.description}</p></div>; })}</div>
      <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5"><p className="text-xs font-black uppercase tracking-widest text-slate-500">Grade {grade} Story Forest</p><p className="mt-1 text-sm font-bold">{completedStories} of {gradeStories.length || "the available"} reading adventures completed</p></div>
      <div className="mt-5 rounded-3xl border border-purple-400/10 bg-purple-400/5 p-5"><p className="font-black">🎮 Play is earned</p><p className="mt-1 text-sm leading-6 text-slate-400">Games reinforce learning and reward progress. {gamesUnlocked ? "Your Game Room is unlocked." : "Reach Level 2 to unlock the Game Room."}</p>{gamesUnlocked && <Link href="/games" className="mt-3 inline-block text-sm font-black text-cyan-300">Visit Game Room →</Link>}</div>
    </div>
  </section>;
}
