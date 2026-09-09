"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Player } from "@/lib/kiddo";
import { awardXP, getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { getGameProgress, getGameTiers, getNextGameTier, recordGameResult } from "@/lib/game-progression";
import { GameProgress } from "@/types/game-progress";
import { GameResultCard } from "@/components/games/GameResultCard";

type Card = { id: string; pairId: string; content: string };

const PAIRS = [["HAPPY", "😊"], ["BIG", "LARGE"], ["FAST", "QUICK"], ["BRAVE", "COURAGEOUS"], ["BEGIN", "START"], ["SMART", "CLEVER"]];
const GAME_XP = 50;
const GAME_ID = "memory-match-v1";

function createDeck(): Card[] {
  return PAIRS.flatMap(([first, second], index) => [
    { id: `${index}-a`, pairId: `${index}`, content: first },
    { id: `${index}-b`, pairId: `${index}`, content: second },
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
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    const current = getCurrentPlayer();
    if (!current) { window.location.href = "/players"; return; }
    const alreadyPlayed = getActivityResults(current.id).some((result) => result.activityType === "memory_match" && result.activityId === GAME_ID && result.xpAwarded > 0);
    setPlayer(current);
    setRewarded(alreadyPlayed);
    setGameProgress(getGameProgress(current.id, GAME_ID, current.grade));
    setCards(createDeck());
  }, []);

  const progress = useMemo(() => cards.length === 0 ? 0 : Math.round((matched.length / cards.length) * 100), [matched.length, cards.length]);

  function restartGame() {
    setCards(createDeck()); setFlipped([]); setMatched([]); setMoves(0); setBusy(false); setCompleted(false);
  }

  function handleCardClick(card: Card) {
    if (busy || completed || flipped.includes(card.id) || matched.includes(card.id)) return;
    const nextFlipped = [...flipped, card.id];
    setFlipped(nextFlipped);
    if (nextFlipped.length !== 2) return;
    setMoves((current) => current + 1); setBusy(true);
    const first = cards.find((item) => item.id === nextFlipped[0]);
    const second = cards.find((item) => item.id === nextFlipped[1]);
    if (!first || !second) { setFlipped([]); setBusy(false); return; }
    if (first.pairId === second.pairId) {
      const nextMatched = [...matched, first.id, second.id];
      setMatched(nextMatched); setFlipped([]); setBusy(false);
      if (nextMatched.length === cards.length) finishGame();
      return;
    }
    window.setTimeout(() => { setFlipped([]); setBusy(false); }, 800);
  }

  function finishGame() {
    if (!player || !gameProgress || completed) return;
    setCompleted(true);
    const performance = Math.max(60, Math.min(100, 100 - Math.max(0, moves - PAIRS.length) * 5));
    const nextProgress = recordGameResult(player.id, GAME_ID, player.grade, "won", performance);
    setGameProgress(nextProgress);
    if (rewarded) return;
    awardXP(player.id, GAME_XP);
    recordActivityResult({ id: `memory-match-${player.id}-${Date.now()}`, playerId: player.id, activityType: "memory_match", activityId: GAME_ID, skills: ["vocabulary"], correct: true, attempts: moves + 1, hintsUsed: 0, xpAwarded: GAME_XP, timestamp: new Date().toISOString() });
    setRewarded(true);
  }

  if (!player || !gameProgress) return null;
  const tiers = getGameTiers();
  const nextTier = getNextGameTier(gameProgress);
  const currentTierStats = gameProgress.tierStats[gameProgress.currentTier];

  return (
    <main className="kiddo-game-screen min-h-screen bg-slate-950 text-white">
      <div className="kiddo-game-shell mx-auto min-h-screen max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/games" className="text-sm font-bold text-slate-400 transition hover:text-white">← Game Room</Link>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2"><span className="text-xs text-slate-500">PLAYER</span><span className="ml-2 font-black">{player.name}</span></div>
        </header>

        <section className="kiddo-game-title mt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">KIDDO Game</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Memory Match 🧠</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">Find the matching pairs and strengthen your vocabulary.</p>
        </section>

        <section className="kiddo-progression-panel mx-auto mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Game Level</p><p className="mt-1 text-2xl font-black capitalize text-cyan-300">{gameProgress.currentTier}</p></div>
            <div className="text-right"><p className="text-xs text-slate-500">{gameProgress.wins} wins • {gameProgress.masteryScore}% overall mastery</p><p className="mt-1 text-sm font-bold text-slate-300">{nextTier ? `${currentTierStats?.wins ?? 0}/${nextTier.unlockWins} wins • ${currentTierStats?.masteryScore ?? 0}%/${nextTier.masteryRequired}% mastery` : "Master level reached!"}</p></div>
          </div>
          <div className="kiddo-tier-list mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {tiers.map((tier) => { const currentIndex = tiers.findIndex((item) => item.id === gameProgress.currentTier); const tierIndex = tiers.findIndex((item) => item.id === tier.id); const unlocked = currentIndex >= tierIndex; return <div key={tier.id} className={`rounded-xl px-2 py-2 text-center text-xs font-black capitalize ${unlocked ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-slate-600"}`}>{unlocked ? "✓ " : "🔒 "}{tier.name}</div>; })}
          </div>
        </section>

        <section className="kiddo-game-stats mx-auto mt-6 flex max-w-3xl items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
          <div><p className="text-xs text-slate-500">MOVES</p><p className="text-2xl font-black">{moves}</p></div>
          <div className="w-1/2"><div className="mb-2 flex justify-between text-xs"><span className="text-slate-500">Progress</span><span className="font-bold">{progress}%</span></div><div className="h-3 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300" style={{ width: `${progress}%` }} /></div></div>
          <div className="text-right"><p className="text-xs text-slate-500">REWARD</p><p className="text-2xl font-black text-yellow-400">+{GAME_XP} XP</p></div>
        </section>

        <section className="kiddo-game-stage mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4">
          {cards.map((card) => { const isFlipped = flipped.includes(card.id) || matched.includes(card.id); const isMatched = matched.includes(card.id); return <button key={card.id} onClick={() => handleCardClick(card)} disabled={busy || isMatched} className={`aspect-square rounded-2xl border p-3 text-center transition duration-200 sm:rounded-3xl ${isMatched ? "border-emerald-400/40 bg-emerald-400/10" : isFlipped ? "border-cyan-400/40 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:-translate-y-1 hover:bg-white/10"}`}>{isFlipped ? <span className="break-words text-lg font-black sm:text-2xl">{card.content}</span> : <span className="text-3xl opacity-60">❓</span>}</button>; })}
        </section>

        {completed && <GameResultCard result="won" playerName={player.name} gameName="Memory Match" xp={GAME_XP} progress={gameProgress} rewardClaimed={rewarded} onRetry={restartGame} />}
        {!completed && <div className="kiddo-restart mt-8 text-center"><button onClick={restartGame} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-400 transition hover:bg-white/10 hover:text-white">↻ Restart Game</button></div>}
        <footer className="py-10 text-center text-xs text-slate-600">KIDDO • Learn more. Unlock more. Play more. ⭐</footer>
      </div>
    </main>
  );
}
