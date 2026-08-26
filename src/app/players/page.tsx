"use client";

import { useEffect, useState } from "react";
import { Player } from "@/lib/kiddo";
import { getPlayers, setCurrentPlayer } from "@/lib/player";
import { PlayerAvatar } from "@/components/PlayerAvatar";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    setPlayers(getPlayers());
  }, []);

  function selectPlayer(player: Player) {
    setCurrentPlayer(player);
    window.location.href = "/";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8">

        {/* Logo */}
        <header className="flex justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-300 to-orange-500 text-3xl shadow-xl">
              ⭐
            </div>

            <h1 className="mt-4 text-3xl font-black">
              KIDDO
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Learn • Play • Discover
            </p>
          </div>
        </header>

        {/* Main */}
        <section className="flex flex-1 flex-col items-center justify-center">

          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              Welcome back!
            </p>

            <h2 className="mt-2 text-4xl font-black sm:text-5xl">
              Who&apos;s playing?
            </h2>

            <p className="mt-3 text-slate-400">
              Choose your explorer and continue your adventure.
            </p>
          </div>

          {/* Players */}
          <div className="mt-10 grid w-full max-w-4xl gap-5 sm:grid-cols-3">

            {players.map((player) => (
              <button
                key={player.id}
                onClick={() => selectPlayer(player)}
                className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 text-center transition duration-200 hover:-translate-y-2 hover:border-emerald-400/50 hover:bg-white/10"
              >

                <div className="mx-auto transition group-hover:scale-110">
                  <PlayerAvatar avatar={player.avatar} size="lg" />
                </div>

                <h3 className="mt-5 text-2xl font-black">
                  {player.name}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {player.grade}
                </p>

                <div className="mt-5 rounded-2xl bg-black/20 p-4">

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      LEVEL
                    </span>

                    <span className="font-black text-yellow-400">
                      {player.level}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      XP
                    </span>

                    <span className="font-bold">
                      ⭐ {player.xp}
                    </span>
                  </div>

                </div>

                <div className="mt-4 text-sm font-black text-emerald-400 opacity-0 transition group-hover:opacity-100">
                  Continue Adventure →
                </div>

              </button>
            ))}

          </div>

          {/* Add player */}
          <button
            onClick={() => alert("Player creation coming next!")}
            className="mt-8 rounded-2xl border border-dashed border-white/20 px-8 py-4 font-bold text-slate-400 transition hover:border-emerald-400 hover:text-white"
          >
            ＋ Add New Explorer
          </button>

        </section>

        <footer className="py-6 text-center text-xs text-slate-600">
          KIDDO • Every child has an adventure waiting.
        </footer>

      </div>
    </main>
  );
}
