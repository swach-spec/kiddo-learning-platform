"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Player } from "@/lib/kiddo";
import { getCurrentPlayer } from "@/lib/player";
import { getPlayerUnlocks, getNextUnlock } from "@/lib/unlocks";
import { isActivityRestricted } from "@/lib/activity-balance";

const GAME_ROUTES: Record<string, string> = {
  "memory-match": "/games/memory-match",
  checkers: "/games/checkers",
  "word-builder": "/games/word-builder",
};

const GAME_ACTIVITY_IDS: Record<string, string> = {
  "memory-match": "memory-match-v1",
  checkers: "checkers-v1",
  "word-builder": "word-builder-v1",
};

export default function GamesPage() {
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

  if (loading || !player) return null;

  const availableUnlocks = getPlayerUnlocks(player.level);
  const nextUnlock = getNextUnlock(player.level);
  const playableAlternatives = availableUnlocks.filter((unlock) => {
    const activityId = GAME_ACTIVITY_IDS[unlock.id];
    return unlock.unlocked && GAME_ROUTES[unlock.id] && activityId && !isActivityRestricted(activityId);
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-7xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-sm font-bold text-slate-400 transition hover:text-white">← Back to Adventure</Link>
            <h1 className="mt-4 text-4xl font-black tracking-tight">Game Room 🎮</h1>
            <p className="mt-2 text-slate-400">Learn, level up and unlock new ways to play.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Your Level</p>
            <p className="mt-1 text-3xl font-black text-yellow-400">{player.level}</p>
          </div>
        </header>

        <section className="mt-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-600 via-purple-600 to-fuchsia-600 p-7 sm:p-9">
          <p className="text-sm font-bold uppercase tracking-widest text-white/60">Your Progress</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black">{player.name}&apos;s Game Journey</h2>
              <p className="mt-2 text-white/75">Keep learning to unlock more games.</p>
            </div>
            {nextUnlock && (
              <div className="rounded-2xl bg-black/20 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Next Unlock</p>
                <p className="mt-1 text-lg font-black">{nextUnlock.icon} {nextUnlock.name}</p>
                <p className="mt-1 text-xs text-white/60">Unlocks at Level {nextUnlock.requiredLevel}</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">Game Collection</p>
            <h2 className="mt-1 text-3xl font-black">What&apos;s available?</h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {availableUnlocks.filter((unlock) => unlock.type === "game").map((unlock) => {
              const activityId = GAME_ACTIVITY_IDS[unlock.id];
              const balancedOut = Boolean(activityId && isActivityRestricted(activityId));
              const alternative = playableAlternatives.find((item) => item.id !== unlock.id);

              return (
                <div key={unlock.id} className={`rounded-[1.75rem] border p-6 ${unlock.unlocked && !balancedOut ? "border-emerald-400/20 bg-white/5" : "border-white/10 bg-white/[0.025] opacity-70"}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-3xl">{unlock.icon}</div>
                    {balancedOut ? (
                      <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-black text-yellow-300">TRY ANOTHER</span>
                    ) : unlock.unlocked ? (
                      <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-black text-emerald-400">UNLOCKED</span>
                    ) : (
                      <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-black text-slate-500">LOCKED</span>
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-black">{unlock.name}</h3>
                  <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{unlock.description}</p>

                  {balancedOut ? (
                    <div className="mt-5">
                      <div className="rounded-2xl bg-yellow-400/5 px-4 py-3 text-sm font-bold text-yellow-200/80">
                        You&apos;ve played this enough for now. Try something else to unlock it again.
                      </div>
                      {alternative && (
                        <Link href={GAME_ROUTES[alternative.id]} className="mt-3 block w-full rounded-2xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-yellow-300">
                          Try {alternative.name} →
                        </Link>
                      )}
                      <Link href="/" className="mt-2 block text-center text-xs font-bold text-slate-500 transition hover:text-white">
                        Or choose another learning path
                      </Link>
                    </div>
                  ) : unlock.unlocked ? (
                    GAME_ROUTES[unlock.id] ? (
                      <Link href={GAME_ROUTES[unlock.id]} className="mt-5 block w-full rounded-2xl bg-emerald-500 px-4 py-3 text-center text-sm font-black text-slate-950 transition hover:bg-emerald-300">
                        Play Game →
                      </Link>
                    ) : (
                      <button disabled className="mt-5 w-full rounded-2xl bg-emerald-500/20 px-4 py-3 text-sm font-black text-emerald-300">Coming next →</button>
                    )
                  ) : (
                    <div className="mt-5 rounded-2xl bg-black/20 px-4 py-3 text-sm font-bold text-slate-500">🔒 Reach Level {unlock.requiredLevel}</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <footer className="py-10 text-center text-xs text-slate-600">KIDDO • Learn more. Unlock more. Play more. ⭐</footer>
      </div>
    </main>
  );
}
