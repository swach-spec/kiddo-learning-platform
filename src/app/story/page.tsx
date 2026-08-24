"use client";

import Link from "next/link";

const stories = [
  {
    id: 1,
    title: "The Lost Kite",
    description: "Help Tom discover where his favourite red kite has gone.",
    icon: "🪁",
    level: "Level 2",
    time: "5 min",
    xp: 100,
    progress: 0,
    unlocked: true,
    gradient: "from-sky-400 to-blue-600",
  },
  {
    id: 2,
    title: "The Clever Tortoise",
    description: "A clever tortoise discovers that patience can be powerful.",
    icon: "🐢",
    level: "Level 2",
    time: "6 min",
    xp: 120,
    progress: 0,
    unlocked: true,
    gradient: "from-emerald-400 to-green-600",
  },
  {
    id: 3,
    title: "The Lion and the Mouse",
    description: "Discover how even the smallest friend can make a big difference.",
    icon: "🦁",
    level: "Level 3",
    time: "7 min",
    xp: 150,
    progress: 0,
    unlocked: true,
    gradient: "from-orange-400 to-amber-600",
  },
  {
    id: 4,
    title: "The Secret Garden",
    description: "Something mysterious is waiting behind an old wooden gate.",
    icon: "🌺",
    level: "Level 4",
    time: "8 min",
    xp: 180,
    progress: 0,
    unlocked: false,
    gradient: "from-pink-400 to-rose-600",
  },
];

export default function StoryForest() {
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
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
              <p className="text-xs text-slate-500">YOUR XP</p>
              <p className="font-black">⭐ 1,240</p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-xl">
              🧑🏾‍🚀
            </div>
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
                Choose your adventure
              </p>

              <h2 className="mt-1 text-3xl font-black">
                Stories
              </h2>
            </div>

            <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 sm:block">
              ⭐ 4 stories available
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {stories.map((story) => (
              <div
                key={story.id}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 transition ${
                  story.unlocked
                    ? "hover:-translate-y-2 hover:bg-white/10"
                    : "opacity-50"
                }`}
              >

                {/* Illustration */}
                <div
                  className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${story.gradient}`}
                >
                  <div className="text-8xl transition duration-300 group-hover:scale-110">
                    {story.icon}
                  </div>

                  {!story.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="text-center">
                        <div className="text-4xl">🔒</div>
                        <p className="mt-2 text-sm font-bold">
                          Unlock at Level 5
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 rounded-full bg-black/20 px-3 py-1 text-xs font-bold backdrop-blur">
                    {story.level}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">

                  <h3 className="text-xl font-black">
                    {story.title}
                  </h3>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-400">
                    {story.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      ⏱ {story.time}
                    </span>

                    <span className="font-bold text-yellow-400">
                      ⭐ +{story.xp} XP
                    </span>
                  </div>

                  {story.unlocked ? (
                    <Link
                      href={`/story/${story.id}`}
                      className="mt-5 block w-full rounded-2xl bg-white py-3 text-center font-black text-slate-900 transition hover:bg-yellow-300"
                    >
                      Start Story →
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="mt-5 w-full cursor-not-allowed rounded-2xl bg-white/10 py-3 font-bold text-slate-500"
                    >
                      🔒 Locked
                    </button>
                  )}

                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Reading stats */}
        <section className="mt-10 grid gap-4 sm:grid-cols-3">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              Stories Completed
            </p>

            <p className="mt-2 text-4xl font-black">
              18
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              Reading Streak
            </p>

            <p className="mt-2 text-4xl font-black">
              7 🔥
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">
              Reading XP
            </p>

            <p className="mt-2 text-4xl font-black">
              860 ⭐
            </p>
          </div>

        </section>

        <footer className="py-10 text-center text-xs text-slate-600">
          🌳 Every story is a new adventure.
        </footer>

      </div>
    </main>
  );
}