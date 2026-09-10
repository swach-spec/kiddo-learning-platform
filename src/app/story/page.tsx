"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Player } from "@/lib/kiddo";
import { getCurrentPlayer } from "@/lib/player";
import { getAllStories } from "@/content";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { XPPill } from "@/components/XPPill";
import { StoryCard } from "@/components/StoryCard";
import { WordHelper } from "@/components/WordHelper";

export default function StoryForest() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = getCurrentPlayer();

    if (!current) {
      window.location.href = "/players";
      return;
    }

    setPlayer(current);
    setLoading(false);
  }, []);

  if (loading || !player) {
    return null;
  }

  const allStories = getAllStories();
  const playerGrade = Number.parseInt(player.grade.replace(/\D/g, ""), 10);
  const stories = allStories.filter((story) => story.grade === playerGrade);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-7xl px-5 py-6 sm:px-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl transition hover:bg-white/10"
            >
              ←
            </Link>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Learning World
              </p>

              <h1 className="text-2xl font-black sm:text-3xl">
                🌳 Story Forest
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <XPPill xp={player.xp} label="YOUR XP" />
            <PlayerAvatar avatar={player.avatar} size="md" />
          </div>
        </header>

        {/* Hero */}
        <section className="relative mt-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-7 sm:p-10">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-bold backdrop-blur">
              📖 Reading Adventure
            </div>

            <h2 className="text-4xl font-black leading-tight sm:text-5xl">
              Explore the
              <span className="block text-yellow-300">
                Story Forest
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-white/80">
              Read exciting stories, discover new words and answer questions
              to earn XP and unlock new adventures.
            </p>
          </div>

          {/* Forest decorations */}
          <div className="absolute right-8 top-4 text-6xl opacity-90">
            ☁️
          </div>

          <div className="absolute bottom-4 right-8 text-8xl">
            🌳
          </div>

          <div className="absolute bottom-2 right-36 text-6xl">
            🌲
          </div>

          <div className="absolute bottom-3 right-56 text-5xl">
            🌲
          </div>
        </section>

        {/* Story list */}
        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                Grade {playerGrade} adventures
              </p>

              <h2 className="mt-1 text-3xl font-black">
                Stories
              </h2>
            </div>

            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 sm:block">
              ⭐ {stories.length} stories for your grade
            </div>
          </div>

          {stories.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  unlocked={player.level >= story.unlocksAtLevel}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <p className="text-4xl">🌱</p>
              <h3 className="mt-3 text-xl font-black">More stories are growing!</h3>
              <p className="mt-2 text-slate-400">
                New Grade {playerGrade} adventures are coming soon.
              </p>
            </div>
          )}
        </section>

        {/* Reading stats */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              Stories Completed
            </p>

            <p className="mt-2 text-4xl font-black">
              {player.storiesCompleted}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              Reading Streak
            </p>

            <p className="mt-2 text-4xl font-black">
              {player.streak} 🔥
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              Reading XP
            </p>

            <p className="mt-2 text-4xl font-black">
              {player.xp.toLocaleString()} ⭐
            </p>
          </div>
        </section>

        <WordHelper className="mt-8" />

        <footer className="py-10 text-center text-xs text-slate-600">
          🌳 Every story is a new adventure.
        </footer>
      </div>
    </main>
  );
}
