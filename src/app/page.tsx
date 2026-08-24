"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Player } from "@/lib/kiddo";

const worlds = [
  {
    title: "Story Forest",
    subtitle: "Read & discover",
    icon: "📖",
    color: "from-emerald-400 to-green-600",
    progress: 65,
    unlocked: true,
  },
  {
    title: "Word Castle",
    subtitle: "Grammar & words",
    icon: "🏰",
    color: "from-purple-400 to-indigo-600",
    progress: 42,
    unlocked: true,
  },
  {
    title: "Puzzle Island",
    subtitle: "Think & solve",
    icon: "🧩",
    color: "from-orange-400 to-amber-600",
    progress: 28,
    unlocked: true,
  },
  {
    title: "Number Mountain",
    subtitle: "Math adventures",
    icon: "🔢",
    color: "from-blue-400 to-cyan-600",
    progress: 0,
    unlocked: false,
  },
];

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("kiddo-current-player");

    if (saved) {
      try {
        const parsedPlayer: Player = JSON.parse(saved);
        setPlayer(parsedPlayer);
      } catch {
        localStorage.removeItem("kiddo-current-player");
        window.location.href = "/players";
        return;
      }
    } else {
      window.location.href = "/players";
      return;
    }

    setLoading(false);
  }, []);

  if (loading || !player) {
    return null;
  }

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-7xl px-5 py-6 sm:px-8">

        {/* Header */}
        <header className="flex items-center justify-between">

          <div>
            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-2xl shadow-lg shadow-orange-500/20">
                ⭐
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight">
                  KIDDO
                </h1>

                <p className="text-xs font-medium text-slate-400">
                  Learn • Play • Discover
                </p>
              </div>

            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* XP */}
            <div className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 sm:flex">

              <span>⭐</span>

              <div>
                <p className="text-xs text-slate-400">
                  XP
                </p>

                <p className="font-bold">
                  {player.xp.toLocaleString()}
                </p>
              </div>

            </div>

            {/* Profile */}
            <Link
              href="/players"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 pr-4 transition hover:bg-white/10"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl">
                {player.avatar}
              </div>

              <div className="hidden text-left sm:block">

                <p className="text-sm font-bold">
                  {player.name}
                </p>

                <p className="text-xs text-slate-400">
                  Level {player.level}
                </p>

              </div>

            </Link>

          </div>

        </header>

        {/* Welcome */}
        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">

          {/* Main adventure */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-7 shadow-2xl shadow-purple-900/20 sm:p-10">

            <div className="relative z-10 max-w-xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                🚀 Welcome back, {player.name}!
              </div>

              <h2 className="text-4xl font-black leading-tight sm:text-5xl">

                Ready for your

                <span className="block text-yellow-300">
                  next adventure?
                </span>

              </h2>

              <p className="mt-4 max-w-lg text-base leading-7 text-white/80">
                Explore stories, solve puzzles, master words and collect
                rewards as you learn.
              </p>

              <Link
                href="/story"
                className="mt-7 inline-block rounded-2xl bg-white px-7 py-4 text-base font-black text-indigo-700 shadow-xl transition hover:-translate-y-1 hover:bg-yellow-300 hover:shadow-2xl active:translate-y-0"
              >
                ▶ Continue Adventure
              </Link>

            </div>

            {/* Decorations */}
            <div className="absolute right-8 top-8 text-5xl opacity-80">
              🌙
            </div>

            <div className="absolute bottom-8 right-16 text-7xl">
              🚀
            </div>

            <div className="absolute bottom-6 right-5 text-3xl">
              ✨
            </div>

          </div>

          {/* Daily Challenge */}
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur">

            <div className="flex items-center justify-between">

              <span className="text-sm font-bold text-slate-400">
                DAILY CHALLENGE
              </span>

              <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-300">
                +50 XP
              </span>

            </div>

            <div className="mt-8 text-5xl">
              🧠
            </div>

            <h3 className="mt-5 text-2xl font-black">
              Word Detective
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Find the hidden word and earn today's bonus.
            </p>

            <button className="mt-6 w-full rounded-2xl bg-white/10 py-3 font-bold transition hover:bg-white/15">
              Start Challenge →
            </button>

          </div>

        </section>

        {/* Worlds */}
        <section className="mt-10">

          <div className="mb-5 flex items-end justify-between">

            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                Explore
              </p>

              <h2 className="mt-1 text-3xl font-black">
                Learning Worlds
              </h2>

            </div>

            <p className="hidden text-sm text-slate-500 sm:block">
              Choose your adventure
            </p>

          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {worlds.map((world) => (

              <Link
                key={world.title}
                href={world.title === "Story Forest" ? "/story" : "#"}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 p-5 text-left transition ${
                  world.unlocked
                    ? "bg-white/5 hover:-translate-y-1 hover:bg-white/10"
                    : "cursor-not-allowed bg-white/[0.025] opacity-50"
                }`}
              >

                <div
                  className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${world.color} text-3xl shadow-lg`}
                >
                  {world.icon}
                </div>

                <h3 className="text-lg font-black">
                  {world.title}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {world.subtitle}
                </p>

                {world.unlocked ? (

                  <div className="mt-5">

                    <div className="mb-2 flex justify-between text-xs">

                      <span className="text-slate-500">
                        Progress
                      </span>

                      <span className="font-bold">
                        {world.progress}%
                      </span>

                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-white/10">

                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${world.color}`}
                        style={{
                          width: `${world.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                ) : (

                  <div className="mt-5 text-xs font-bold text-slate-500">
                    🔒 Unlock at Level 6
                  </div>

                )}

                <div className="absolute right-5 top-5 text-slate-600 transition group-hover:text-white">
                  →
                </div>

              </Link>

            ))}

          </div>

        </section>

        {/* Progress */}
        <section className="mt-10 grid gap-4 md:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <p className="text-sm text-slate-400">
              Reading Streak
            </p>

            <div className="mt-3 flex items-end gap-2">

              <span className="text-4xl font-black">
                {player.streak}
              </span>

              <span className="mb-1 text-sm font-bold text-orange-400">
                days 🔥
              </span>

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <p className="text-sm text-slate-400">
              Stories Completed
            </p>

            <div className="mt-3 flex items-end gap-2">

              <span className="text-4xl font-black">
                {player.storiesCompleted}
              </span>

              <span className="mb-1 text-sm text-slate-500">
                stories
              </span>

            </div>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <p className="text-sm text-slate-400">
              Badges Earned
            </p>

            <div className="mt-3 flex items-end gap-2">

              <span className="text-4xl font-black">
                {player.badges}
              </span>

              <span className="mb-1 text-sm text-slate-500">
                badges 🏆
              </span>

            </div>

          </div>

        </section>

        {/* Footer */}
        <footer className="py-10 text-center text-xs text-slate-600">
          KIDDO • Learn something amazing every day ⭐
        </footer>

      </div>

    </main>
  );
}