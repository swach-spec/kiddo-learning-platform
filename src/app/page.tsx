"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Player } from "@/lib/kiddo";
import { getCurrentPlayer, getActivityResults } from "@/lib/player";
import { isLoggedIn } from "@/lib/auth";
import { getAllStories } from "@/content";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { AdventurePaths } from "@/components/AdventurePaths";
import { LearningJourney } from "@/components/LearningJourney";
import { WordHelper } from "@/components/WordHelper";
import { getNextActivityRecommendation, recordHomePrompt } from "@/lib/activity-balance";
import type { BalancedActivityRecommendation } from "@/lib/activity-balance";

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<BalancedActivityRecommendation | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) { window.location.href = "/login"; return; }
    const current = getCurrentPlayer();
    if (!current) { window.location.href = "/players"; return; }
    setPlayer(current);
    const next = getNextActivityRecommendation(current.id);
    setRecommendation(next);
    if (next) recordHomePrompt(next.activityId);
    setLoading(false);
  }, []);

  if (loading || !player) return null;

  const stories = getAllStories();
  const activityResults = getActivityResults(player.id);
  const readyStories = stories.filter((story) => story.status === "ready");
  const storyForestProgress = readyStories.length === 0 ? 0 : Math.min(100, Math.round((player.completedStoryIds.length / readyStories.length) * 100));
  const numberWorldActivities = activityResults.filter((result) => result.activityId.startsWith("number-world-"));
  const numberWorldProgress = Math.min(100, Math.round((new Set(numberWorldActivities.map((result) => result.activityId)).size / 48) * 100));

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" /><div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" /><div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" /></div>
      <div className="relative mx-auto min-h-screen max-w-6xl px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-xl shadow-lg">⭐</div><div><h1 className="text-xl font-black tracking-tight">KIDDO</h1><p className="text-xs font-medium text-slate-500">Learn • Play • Discover</p></div></div>
          <div className="flex items-center gap-2"><div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 sm:block"><p className="text-[10px] uppercase tracking-widest text-slate-500">XP</p><p className="font-black">{player.xp.toLocaleString()}</p></div><Link href="/players" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 pr-3 transition hover:bg-white/10"><PlayerAvatar avatar={player.avatar} size="sm" /><div className="hidden text-left sm:block"><p className="text-sm font-bold">{player.name}</p><p className="text-xs text-slate-500">Level {player.level}</p></div></Link></div>
        </header>

        <section className="mt-8"><div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-7 shadow-2xl sm:p-9"><div className="max-w-2xl"><p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest backdrop-blur">🚀 Welcome, {player.name}!</p><h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Your next adventure<br /><span className="text-yellow-300">starts here.</span></h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Choose a path and keep your learning balanced. KIDDO will guide you toward what to learn next.</p><Link href="#adventure-paths" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-yellow-100">START HERE <span>→</span></Link></div></div></section>

        {recommendation && (
          <section className="mt-5 rounded-3xl border border-yellow-400/20 bg-yellow-400/5 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs font-black uppercase tracking-widest text-yellow-300">A smart next step</p><h2 className="mt-1 text-xl font-black">Try {recommendation.title}</h2><p className="mt-1 text-sm text-slate-400">{recommendation.description} KIDDO is mixing your paths so you keep growing.</p></div>
              <Link href={recommendation.href} className="shrink-0 rounded-2xl bg-yellow-300 px-5 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-yellow-200">Try it →</Link>
            </div>
          </section>
        )}

        <div id="adventure-paths"><AdventurePaths /></div>
        <LearningJourney player={player} stories={stories} activityResults={activityResults} />
        <WordHelper className="mt-6" />

        <section className="mt-8 grid gap-3 sm:grid-cols-3"><StatCard icon="🔥" label="Learning streak" value={String(player.streak)} suffix="days" /><StatCard icon="🏆" label="Badges earned" value={String(player.badges)} suffix="badges" /><StatCard icon="⭐" label="XP" value={player.xp.toLocaleString()} suffix="points" /></section>
        <section className="mt-8 grid gap-3 sm:grid-cols-2"><ProgressCard title="Story Forest" icon="📖" progress={storyForestProgress} href="/story" /><ProgressCard title="Number World" icon="🔢" progress={numberWorldProgress} href="/number-world-cbc" /></section>
        <footer className="py-8 text-center text-xs text-slate-700">KIDDO • Learn something amazing every day ⭐</footer>
      </div>
    </main>
  );
}

function StatCard({ icon, label, value, suffix }: { icon: string; label: string; value: string; suffix: string }) { return <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">{icon} {label}</p><div className="mt-2 flex items-end gap-2"><span className="text-3xl font-black">{value}</span><span className="mb-1 text-xs text-slate-500">{suffix}</span></div></div>; }
function ProgressCard({ title, icon, progress, href }: { title: string; icon: string; progress: number; href: string }) { return <Link href={href} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 transition hover:bg-white/[0.06]"><div className="flex items-center justify-between"><p className="text-sm font-black">{icon} {title}</p><span className="text-xs font-bold text-slate-500">{progress}%</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-white/70 transition-all" style={{ width: `${progress}%` }} /></div></Link>; }
