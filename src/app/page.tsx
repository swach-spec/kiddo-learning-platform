"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Player } from "@/lib/kiddo";
import { getCurrentPlayer, getActivityResults } from "@/lib/player";
import { isLoggedIn } from "@/lib/auth";
import { getAllStories } from "@/content";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { WorldCard, World } from "@/components/WorldCard";
import { LearningJourney } from "@/components/LearningJourney";
import { WordHelper } from "@/components/WordHelper";

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) {
      window.location.href = "/login";
      return;
    }

    const current = getCurrentPlayer();
    if (!current) {
      window.location.href = "/players";
      return;
    }
    setPlayer(current);
    setLoading(false);
  }, []);

  if (loading || !player) return null;

  const stories = getAllStories();
  const activityResults = getActivityResults(player.id);
  const readyStories = stories.filter((story) => story.status === "ready");
  const storyForestProgress = readyStories.length === 0
    ? 0
    : Math.min(100, Math.round((player.completedStoryIds.length / readyStories.length) * 100));

  const numberWorldActivities = activityResults.filter((result) => result.activityId.startsWith("number-world-"));
  const numberWorldProgress = Math.min(100, Math.round((new Set(numberWorldActivities.map((result) => result.activityId)).size / 48) * 100));

  const worlds: World[] = [
    {
      title: "Story Forest",
      subtitle: "Read & discover",
      icon: "📖",
      color: "from-emerald-400 to-green-600",
      progress: storyForestProgress,
      unlocked: true,
      href: "/story",
    },
    {
      title: "Number World",
      subtitle: "Count, calculate & solve",
      icon: "🔢",
      color: "from-blue-400 to-cyan-600",
      progress: numberWorldProgress,
      unlocked: true,
      href: "/number-world-cbc",
    },
    {
      title: "Game Room",
      subtitle: "Play what you unlock",
      icon: "🎮",
      color: "from-cyan-400 to-purple-600",
      progress: 0,
      unlocked: player.level >= 2,
      href: "/games",
    },
    {
      title: "More Worlds",
      subtitle: "New adventures are coming",
      icon: "🌈",
      color: "from-purple-400 to-fuchsia-600",
      progress: 0,
      unlocked: false,
      href: "#",
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-6xl px-5 py-5 sm:px-8 sm:py-7">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-xl shadow-lg">⭐</div>
            <div>
              <h1 className="text-xl font-black tracking-tight">KIDDO</h1>
              <p className="text-xs font-medium text-slate-500">Learn • Play • Discover</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 sm:block">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">XP</p>
              <p className="font-black">{player.xp.toLocaleString()}</p>
            </div>
            <Link href="/players" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 pr-3 transition hover:bg-white/10">
              <PlayerAvatar avatar={player.avatar} size="sm" />
              <div className="hidden text-left sm:block"><p className="text-sm font-bold">{player.name}</p><p className="text-xs text-slate-500">Level {player.level}</p></div>
            </Link>
          </div>
        </header>

        <section className="mt-8">
          <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-7 shadow-2xl sm:p-9">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-widest backdrop-blur">🚀 Welcome, {player.name}!</p>
              <h2 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">Your next adventure<br /><span className="text-yellow-300">starts here.</span></h2>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">Follow your learning path. KIDDO will show you what to learn, what to practise and what you can unlock next.</p>
            </div>
          </div>
        </section>

        <LearningJourney player={player} stories={stories} activityResults={activityResults} />

        <WordHelper className="mt-6" />

        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between">
            <div><p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Optional</p><h2 className="mt-1 text-2xl font-black">Explore KIDDO</h2></div>
            <p className="hidden text-sm text-slate-600 sm:block">Your journey comes first</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {worlds.map((world) => <WorldCard key={world.title} world={world} />)}
          </div>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          <StatCard label="Learning streak" value={String(player.streak)} suffix="days 🔥" />
          <StatCard label="Stories completed" value={String(player.storiesCompleted)} suffix="stories" />
          <StatCard label="Badges earned" value={String(player.badges)} suffix="badges 🏆" />
        </section>

        <footer className="py-8 text-center text-xs text-slate-700">KIDDO • Learn something amazing every day ⭐</footer>
      </div>
    </main>
  );
}

function StatCard({ label, value, suffix }: { label: string; value: string; suffix: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <div className="mt-2 flex items-end gap-2"><span className="text-3xl font-black">{value}</span><span className="mb-1 text-xs text-slate-500">{suffix}</span></div>
    </div>
  );
}
