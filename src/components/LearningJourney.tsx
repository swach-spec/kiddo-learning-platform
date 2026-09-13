"use client";

import Link from "next/link";
import { useState } from "react";
import { Player } from "@/lib/kiddo";
import { Story } from "@/types/content";
import { ActivityResult } from "@/types/activity";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { getEnglishPath } from "@/content/curriculum/english-path";
import { getNextLearningDecision, getNodeLearningState, getPathProgress, isNodeComplete } from "@/lib/curriculum-path";
import { startLearningNode } from "@/lib/guided-learning";

type Props = { player: Player; stories: Story[]; activityResults: ActivityResult[] };

function getNodeHref(node: ReturnType<typeof getEnglishPath>[number]) {
  if (!node.route) return undefined;
  if (node.kind === "guided_practice" || node.kind === "independent_practice" || node.kind === "mastery") {
    return `${node.route}?node=${encodeURIComponent(node.id)}`;
  }
  return node.route;
}

function stateCopy(state: ReturnType<typeof getNodeLearningState>) {
  if (state === "secure") return { label: "Secure", detail: "Ready to move forward" };
  if (state === "needs_support") return { label: "Needs support", detail: "KIDDO will give extra practice" };
  return { label: "Developing", detail: "Keep practising and KIDDO will adapt" };
}

export function LearningJourney({ player, stories, activityResults }: Props) {
  const [showPath, setShowPath] = useState(false);
  const grade = Number(player.grade.replace(/\D/g, "")) || 2;
  const path = getEnglishPath(grade);
  const progress = getPathProgress(activityResults, path);
  const decision = getNextLearningDecision(activityResults, grade);
  const learningState = decision ? getNodeLearningState(activityResults, decision.node) : "secure";
  const state = stateCopy(learningState);
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
      {decision && <div className="mb-5 rounded-3xl border border-cyan-400/15 bg-cyan-400/5 p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><p className="text-xs font-black uppercase tracking-widest text-cyan-300">KIDDO&apos;s next step</p><span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-300">{state.label}</span></div><h3 className="mt-1 text-xl font-black">{decision.node.title}</h3><p className="mt-1 text-sm leading-6 text-slate-400">{decision.reason}</p><p className="mt-2 text-xs font-bold text-slate-500">{state.detail}</p></div>{decision.node.route && <Link href={getNodeHref(decision.node) ?? decision.node.route} onClick={() => startLearningNode(player.id, decision.node)} className="shrink-0 rounded-2xl bg-white px-6 py-3 text-center font-black text-slate-950 hover:bg-yellow-300">{decision.action === "learn" ? "Start Learning →" : decision.action === "support" ? "Let&apos;s practise →" : decision.action === "challenge" ? "Take Challenge →" : "Practise →"}</Link>}</div></div>}

      <button type="button" onClick={() => setShowPath((current) => !current)} aria-expanded={showPath} className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:bg-white/[0.06]"><span><span className="block text-xs font-black uppercase tracking-widest text-slate-500">Grade {grade} pathway</span><span className="mt-1 block text-sm font-bold text-slate-300">{progress.completed} of {progress.total} steps complete</span></span><span className="text-sm font-black text-cyan-300">{showPath ? "Hide path ↑" : "View learning path →"}</span></button>

      {showPath && <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{path.map((node) => { const complete = isNodeComplete(activityResults, node); const current = decision?.node.id === node.id; return <div key={node.id} className={`rounded-3xl border p-5 ${complete ? "border-emerald-400/25 bg-emerald-400/5" : current ? "border-cyan-400/35 bg-cyan-400/10" : "border-white/10 bg-white/[0.03]"}`}><div className="flex items-center justify-between"><span className="text-xs font-black uppercase tracking-widest text-slate-500">{node.kind.replace(/_/g, " ")}</span><span>{complete ? "✅" : current ? "▶️" : "🔒"}</span></div><p className="mt-4 text-xs font-black uppercase tracking-widest text-cyan-300">{node.concept}</p><h3 className="mt-1 text-lg font-black">{node.title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{node.description}</p></div>; })}</div>}

      <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5"><p className="text-xs font-black uppercase tracking-widest text-slate-500">Grade {grade} Story Forest</p><p className="mt-1 text-sm font-bold">{completedStories} of {gradeStories.length || "the available"} reading adventures completed</p></div>
      <div className="mt-5 rounded-3xl border border-purple-400/10 bg-purple-400/5 p-5"><p className="font-black">🎮 Play is earned</p><p className="mt-1 text-sm leading-6 text-slate-400">Games reinforce learning and reward progress. {gamesUnlocked ? "Your Game Room is unlocked." : "Reach Level 2 to unlock the Game Room."}</p>{gamesUnlocked && <Link href="/games" className="mt-3 inline-block text-sm font-black text-cyan-300">Visit Game Room →</Link>}</div>
    </div>
  </section>;
}
