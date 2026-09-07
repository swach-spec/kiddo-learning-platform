"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Player } from "@/lib/kiddo";
import {
  awardXP,
  getActivityResults,
  getCurrentPlayer,
  recordActivityResult,
} from "@/lib/player";

type Card = {
  id: string;
  pairId: string;
  content: string;
};

const PAIRS = [
  ["HAPPY", "😊"],
  ["BIG", "LARGE"],
  ["FAST", "QUICK"],
  ["BRAVE", "COURAGEOUS"],
  ["BEGIN", "START"],
  ["SMART", "CLEVER"],
];

const GAME_XP = 50;

function createDeck(): Card[] {
  return PAIRS.flatMap(([first, second], index) => [
    {
      id: `${index}-a`,
      pairId: `${index}`,
      content: first,
    },
    {
      id: `${index}-b`,
      pairId: `${index}`,
      content: second,
    },
  ]).sort(() => Math.random() - 0.5);
}

export default function MemoryMatchPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [busy, setBusy] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    const current = getCurrentPlayer();

    if (!current) {
      window.location.href = "/players";
      return;
    }

    const alreadyPlayed = getActivityResults(current.id).some(
      (result) =>
        result.activityType === "memory_match" &&
        result.activityId === "memory-match-v1"
    );

    setPlayer(current);
    setRewarded(alreadyPlayed);
    setCards(createDeck());
  }, []);

  const progress = useMemo(() => {
    if (cards.length === 0) return 0;
    return Math.round((matched.length / cards.length) * 100);
  }, [matched.length, cards.length]);

  function restartGame() {
    setCards(createDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setBusy(false);
    setCompleted(false);
  }

  function handleCardClick(card: Card) {
    if (
      busy ||
      completed ||
      flipped.includes(card.id) ||
      matched.includes(card.id)
    ) {
      return;
    }

    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);

    if (nextFlipped.length !== 2) {
      return;
    }

    setMoves((current) => current + 1);
    setBusy(true);

    const first = cards.find((item) => item.id === nextFlipped[0]);
    const second = cards.find((item) => item.id === nextFlipped[1]);

    if (!first || !second) {
      setFlipped([]);
      setBusy(false);
      return;
    }

    if (first.pairId === second.pairId) {
      const nextMatched = [...matched, first.id, second.id];
      setMatched(nextMatched);
      setFlipped([]);
      setBusy(false);

      if (nextMatched.length === cards.length) {
        finishGame();
      }

      return;
    }

    window.setTimeout(() => {
      setFlipped([]);
      setBusy(false);
    }, 800);
  }

  function finishGame() {
    setCompleted(true);

    if (!player || rewarded) {
      return;
    }

    awardXP(player.id, GAME_XP);

    recordActivityResult({
      id: `memory-match-${player.id}-${Date.now()}`,
      playerId: player.id,
      activityType: "memory_match",
      activityId: "memory-match-v1",
      skills: ["vocabulary"],
      correct: true,
      attempts: moves + 1,
      hintsUsed: 0,
      xpAwarded: GAME_XP,
      timestamp: new Date().toISOString(),
    });

    setRewarded(true);
  }

  if (!player) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto min-h-screen max-w-6xl px-5 py-6 sm:px-8">

        <header className="flex items-center justify-between">
          <Link
            href="/games"
            className="text-sm font-bold text-slate-400 transition hover:text-white"
          >
            ← Game Room
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
            <span className="text-xs text-slate-500">PLAYER</span>
            <span className="ml-2 font-black">{player.name}</span>
          </div>
        </header>

        <section className="mt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
            KIDDO Game
          </p>

          <h1 className="mt-2 text-4xl font-black sm:text-5xl">
            Memory Match 🧠
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-slate-400">
            Find the matching pairs and strengthen your vocabulary.
          </p>
        </section>

        <section className="mx-auto mt-8 flex max-w-3xl items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-xs text-slate-500">MOVES</p>
            <p className="text-2xl font-black">{moves}</p>
          </div>

          <div className="w-1/2">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-slate-500">Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500">REWARD</p>
            <p className="text-2xl font-black text-yellow-400">
              +{GAME_XP} XP
            </p>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
          {cards.map((card) => {
            const isFlipped =
              flipped.includes(card.id) || matched.includes(card.id);

            const isMatched = matched.includes(card.id);

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card)}
                disabled={busy || isMatched}
                className={`aspect-square rounded-2xl border p-3 text-center transition duration-200 sm:rounded-3xl ${
                  isMatched
                    ? "border-emerald-400/40 bg-emerald-400/10"
                    : isFlipped
                      ? "border-cyan-400/40 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"
                }`}
              >
                {isFlipped ? (
                  <span className="break-words text-lg font-black sm:text-2xl">
                    {card.content}
                  </span>
                ) : (
                  <span className="text-3xl opacity-60">❓</span>
                )}
              </button>
            );
          })}
        </section>

        {completed && (
          <section className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-emerald-400/20 bg-emerald-400/10 p-7 text-center">
            <div className="text-5xl">🎉</div>

            <h2 className="mt-3 text-3xl font-black">
              Great job, {player.name}!
            </h2>

            <p className="mt-2 text-slate-300">
              You matched all the pairs in {moves} moves.
            </p>

           {rewarded ? (
  <p className="mt-4 font-black text-yellow-400">
    ⭐ +{GAME_XP} XP earned on your first completion
  </p>
) : null}

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={restartGame}
                className="rounded-2xl bg-white px-6 py-3 font-black text-slate-900 transition hover:bg-yellow-300"
              >
                Play Again
              </button>

              <Link
                href="/games"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-black transition hover:bg-white/10"
              >
                Back to Game Room
              </Link>
            </div>
          </section>
        )}

        {!completed && (
          <div className="mt-8 text-center">
            <button
              onClick={restartGame}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              ↻ Restart Game
            </button>
          </div>
        )}

        <footer className="py-10 text-center text-xs text-slate-600">
          KIDDO • Learn more. Unlock more. Play more. ⭐
        </footer>

      </div>
    </main>
  );
}