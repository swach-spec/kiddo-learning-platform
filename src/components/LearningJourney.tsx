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
  const gradeStories = stories.filter((s) => s.status === "ready" && s.grade === grade);
  const completedStories = gradeStories.filter((s) => player.completedStoryIds.includes(s.id)).length;
  const storyProgress = gradeStories.length ? Math.round((completedStories / gradeStories.length) * 100) : 0;
  const gamesUnlocked = player.level >= 2;

  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl">
      <div className="border-b border-white/10 bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-cyan-500/10 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <PlayerAvatar avatar={player.avatar} size="sm" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Your learning journey</p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">Keep moving forward</h2>
              <p className="mt-1 text-sm text-slate-400">KIDDO follows your grade pathway and adjusts the practice when you need it.</p>
            </div>
          </div>
          <div className="hidden rounded-2xl bg-white/5 px-4 py-3 text-right sm:block">
            <p className="text-xs text-slate-400">Grade {grade}</p>
            <p className="text-xl font-black">{progress.percent}%</p>
          </div>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="mt-2 text-xs font-bold text-slate-500">{progress.completed} of {progress.total} required learning steps complete</p>
      </div>

      <div className="p-5 sm:p-8">
        {decision && (
          <div className={`mb-6 rounded-3xl border p-5 ${decision.route === "remediation" ? "border-amber-400/20 bg-amber-400/5" : "border-cyan-400/15 bg-cyan-400/5"}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-cyan-300">KIDDO&apos;s next step</p>
                <h3 className="mt-1 text-xl font-black">{decision.node.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{decision.reason}</p>
              </div>
              {decision.node.route && decision.action !== "support" && (
                <Link href={decision.node.route} className="shrink-0 rounded-2xl bg-white px-6 py-3 text-center font-black text-slate-950 hover:bg-yellow-300">
                  {decision.action === "learn" ? "Start Learning →" : decision.action === "challenge" ? "Take Challenge →" : "Practise →"}
                </Link>
              )}
              {decision.action === "support" && decision.node.route && (
                <Link href={decision.node.route} className="shrink-0 rounded-2xl bg-amber-300 px-6 py-3 text-center font-black text-slate-950 hover:bg-amber-200">Let&apos;s practise →</Link>
              )}
            </div>
          </div>
        )}

        <div className="grid gap-0 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
          {path.map((node, index) => (
            <div key={node.id} className="contents">
              <PathNode node={node} complete={isNodeComplete(activityResults, node)} current={decision?.node.id === node.id} />
              {index < path.length - 1 && <Connector done={isNodeComplete(activityResults, node)} />}
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Grade {grade} Story Forest</p>
              <p className="mt-1 text-sm font-bold">{completedStories} of {gradeStories.length || "the available"} reading adventures completed</p>
            </div>
            <div className="w-full sm:w-56">
              <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${storyProgress}%` }} /></div>
              <p className="mt-1 text-right text-[10px] text-slate-500">{storyProgress}% story progress</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-5">
            <p className="font-black">🧭 How KIDDO adapts</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">The curriculum stays the spine. Your answers, attempts and hints help KIDDO decide whether to advance, practise more, support you or give you a stronger challenge.</p>
          </div>
          <div className="rounded-3xl border border-purple-400/10 bg-purple-400/5 p-5">
            <p className="font-black">🎮 Play is earned</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">Games reinforce learning and reward progress. {gamesUnlocked ? "Your Game Room is unlocked." : "Reach Level 2 to unlock the Game Room."}</p>
            {gamesUnlocked && <Link href="/games" className="mt-3 inline-block text-sm font-black text-cyan-300 hover:text-cyan-200">Visit Game Room →</Link>}
          </div>
        </div>
      </div>
    </section>
  );
}

function PathNode({ node, complete, current }: { node: ReturnType<typeof getEnglishPath>[number]; complete: boolean; current: boolean }) {
  const state = complete ? "done" : current ? "current" : "locked";
  const canOpen = current && Boolean(node.route);
  const content = (
    <div className={`h-full rounded-[1.75rem] border p-5 transition sm:p-6 ${state === "current" ? "border-cyan-400/40 bg-cyan-400/10 shadow-lg shadow-cyan-950/20" : state === "done" ? "border-emerald-400/25 bg-emerald-400/5" : "border-white/10 bg-white/[0.03]"}`}>
      <div className="flex items-center justify-between"><span className="text-xs font-black tracking-widest text-slate-500">{node.kind.replace("_", " ").toUpperCase()}</span><span className="text-2xl">{complete ? "✅" : current ? "▶️" : "🔒"}</span></div>
      <p className={`mt-5 text-xs font-black tracking-[0.16em] ${current ? "text-cyan-300" : "text-slate-500"}`}>{node.concept}</p>
      <h3 className="mt-2 text-xl font-black">{node.title}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{node.description}</p>
      <div className="mt-5 text-sm font-bold"><span className={complete ? "text-emerald-300" : current ? "text-white" : "text-slate-600"}>{complete ? "✓ Complete" : current ? "Your next step" : "Coming next"}</span></div>
    </div>
  );
  return canOpen ? <Link href={node.route!} className="block h-full">{content}</Link> : content;
}

function Connector({ done }: { done: boolean }) {
  return <div className="flex items-center justify-center py-2 lg:px-3"><div className="flex items-center gap-1 text-slate-700 lg:flex-col"><div className={`h-px w-8 lg:h-8 lg:w-px ${done ? "bg-emerald-400/50" : "bg-white/10"}`} /><span className={done ? "text-emerald-300" : "text-slate-600"}>{done ? "✓" : "›"}</span></div></div>;
}
