"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Player } from "@/lib/kiddo";
import { awardXP, getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { getGameProgress, getGameTiers, getNextGameTier } from "@/lib/game-progression";
import { recordGameResult } from "@/lib/game-progression";
import { GameProgress, GameTierId } from "@/types/game-progress";
import { GameResultCard } from "@/components/games/GameResultCard";
import { getWordBuilderWords, WordBuilderWord } from "@/content/games/word-builder";
import { getExtraWordBuilderWords } from "@/content/games/word-builder-expansion";

const GAME_ID = "word-builder-v1";
const GAME_XP = 50;
const ROUNDS = 7;
const WIN_SCORE = 4;

type LetterTile = { id: string; letter: string };

function difficultyForTier(tier: GameTierId): 1 | 2 | 3 {
  if (tier === "novice" || tier === "easy") return 1;
  if (tier === "intermediate" || tier === "advanced") return 2;
  return 3;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function selectRandomWords(pool: WordBuilderWord[], count: number, excludeWords: string[] = []): WordBuilderWord[] {
  const uniquePool = Array.from(new Map(pool.map((item) => [item.word, item])).values());
  const excluded = new Set(excludeWords);
  const freshPool = uniquePool.filter((item) => !excluded.has(item.word));
  const source = freshPool.length >= count ? freshPool : uniquePool;
  return shuffle(source).slice(0, Math.min(count, source.length));
}

function getReplayPool(grade: string, tier: GameTierId): WordBuilderWord[] {
  return [...getWordBuilderWords(grade, tier), ...getExtraWordBuilderWords(grade, tier)];
}

function scrambleWord(word: string, round: number): LetterTile[] {
  const source = word.split("");
  let letters = [...source];
  for (let attempt = 0; attempt < 12 && letters.join("") === word; attempt += 1) letters = shuffle(source);
  if (letters.join("") === word && letters.length > 1) [letters[0], letters[1]] = [letters[1], letters[0]];
  return letters.map((letter, index) => ({ id: `${round}-${index}-${letter}`, letter }));
}

export default function WordBuilderPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);
  const [words, setWords] = useState<WordBuilderWord[]>([]);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<LetterTile[]>([]);
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<"won" | "lost" | null>(null);
  const [rewarded, setRewarded] = useState(false);

  useEffect(() => {
    const current = getCurrentPlayer();
    if (!current) { window.location.href = "/players"; return; }
    const progress = getGameProgress(current.id, GAME_ID, current.grade);
    const alreadyWon = getActivityResults(current.id).some((result) => result.activityType === "practice_challenge" && result.activityId === GAME_ID && result.xpAwarded > 0);
    setPlayer(current);
    setGameProgress(progress);
    setRewarded(alreadyWon);
    setWords(selectRandomWords(getReplayPool(current.grade, progress.currentTier), ROUNDS));
  }, []);

  const currentWord = words[round];

  useEffect(() => {
    if (!currentWord) return;
    setTiles(scrambleWord(currentWord.word, round));
    setSelected([]);
    setFeedback(null);
  }, [currentWord, round]);

  const answer = useMemo(() => selected.map((tile) => tile.letter).join(""), [selected]);

  function restartGame() {
    if (!player || !gameProgress) return;
    const pool = getReplayPool(player.grade, gameProgress.currentTier);
    setWords(selectRandomWords(pool, ROUNDS, words.map((word) => word.word)));
    setRound(0);
    setSelected([]);
    setScore(0);
    setFeedback(null);
    setHintsUsed(0);
    setFinalResult(null);
    setCompleted(false);
  }

  function chooseTile(tile: LetterTile) {
    if (feedback || selected.some((item) => item.id === tile.id)) return;
    setSelected((current) => [...current, tile]);
  }

  function removeLast() {
    if (!feedback) setSelected((current) => current.slice(0, -1));
  }

  function useHint() {
    if (!currentWord || feedback || selected.length >= currentWord.word.length) return;
    const targetLetter = currentWord.word[selected.length];
    const tile = tiles.find((candidate) => candidate.letter === targetLetter && !selected.some((item) => item.id === candidate.id));
    if (!tile) return;
    setSelected((current) => [...current, tile]);
    setHintsUsed((current) => current + 1);
  }

  function submitAnswer() {
    if (!currentWord || feedback || answer.length !== currentWord.word.length) return;
    const correct = answer === currentWord.word;
    const nextScore = score + (correct ? 1 : 0);
    setScore(nextScore);
    setFeedback(correct ? "correct" : "wrong");
    window.setTimeout(() => {
      if (round + 1 >= ROUNDS) { finishGame(nextScore >= WIN_SCORE, nextScore); return; }
      setRound((current) => current + 1);
    }, 900);
  }

  function finishGame(won: boolean, finalScore: number) {
    if (!player || !gameProgress || completed) return;
    setCompleted(true);
    setFinalResult(won ? "won" : "lost");
    const performance = Math.round((finalScore / ROUNDS) * 100);
    const result = recordGameResult(player.id, GAME_ID, player.grade, won ? "won" : "lost", performance);
    setGameProgress(result);
    if (!won || rewarded) return;
    awardXP(player.id, GAME_XP);
    recordActivityResult({
      id: `word-builder-${player.id}-${Date.now()}`,
      playerId: player.id,
      activityType: "practice_challenge",
      activityId: GAME_ID,
      skills: ["spelling", "vocabulary", "reading"],
      correct: true,
      attempts: ROUNDS,
      hintsUsed,
      difficulty: difficultyForTier(gameProgress.currentTier),
      xpAwarded: GAME_XP,
      timestamp: new Date().toISOString(),
    });
    setRewarded(true);
  }

  if (!player || !gameProgress || words.length < ROUNDS || !currentWord) return null;

  const tiers = getGameTiers();
  const nextTier = getNextGameTier(gameProgress);
  const tierIndex = tiers.findIndex((tier) => tier.id === gameProgress.currentTier);
  const currentTierStats = gameProgress.tierStats[gameProgress.currentTier];

  return (
    <main className="kiddo-game-screen min-h-screen bg-slate-950 text-white">
      <div className="kiddo-game-shell mx-auto min-h-screen max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/games" className="text-sm font-bold text-slate-400 transition hover:text-white">← Game Room</Link>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2"><span className="text-xs text-slate-500">PLAYER</span><span className="ml-2 font-black">{player.name}</span></div>
        </header>

        <section className="kiddo-game-title mt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-400">KIDDO Game</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">Word Builder 🔤</h1>
          <p className="mx-auto mt-3 max-w-xl text-slate-400">Read the clue, build the word, and learn what the word means.</p>
        </section>

        <section className="kiddo-progression-panel mx-auto mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Game Level</p><p className="mt-1 text-2xl font-black capitalize text-amber-300">{gameProgress.currentTier}</p></div>
            <div className="text-right"><p className="text-xs text-slate-500">{gameProgress.wins} wins • {gameProgress.masteryScore}% overall mastery</p><p className="mt-1 text-sm font-bold text-slate-300">{nextTier ? `${currentTierStats?.wins ?? 0}/${nextTier.unlockWins} wins • ${currentTierStats?.masteryScore ?? 0}%/${nextTier.masteryRequired}% mastery` : "Master level reached!"}</p></div>
          </div>
          <div className="kiddo-tier-list mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">{tiers.map((tier, index) => <div key={tier.id} className={`rounded-xl px-2 py-2 text-center text-xs font-black capitalize ${index <= tierIndex ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-slate-600"}`}>{index <= tierIndex ? "✓ " : "🔒 "}{tier.name}</div>)}</div>
        </section>

        <section className="kiddo-game-stats mx-auto mt-6 flex max-w-3xl items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
          <div><p className="text-xs text-slate-500">ROUND</p><p className="text-2xl font-black">{Math.min(round + 1, ROUNDS)} / {ROUNDS}</p></div>
          <div className="text-center"><p className="text-xs text-slate-500">SCORE</p><p className="text-2xl font-black text-emerald-300">{score}</p></div>
          <div className="text-right"><p className="text-xs text-slate-500">REWARD</p><p className="text-2xl font-black text-yellow-400">+{GAME_XP} XP</p></div>
        </section>

        <section className="kiddo-game-stage mx-auto mt-8 flex max-w-3xl flex-col items-center justify-center">
          <div className="w-full rounded-[2rem] border border-white/10 bg-gradient-to-br from-amber-500/10 via-white/5 to-purple-500/10 p-5 sm:p-8">
            <div className="text-center"><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Clue</p><p className="mx-auto mt-3 max-w-2xl text-lg font-bold text-white sm:text-2xl">{currentWord.clue}</p></div>
            <div className="mt-7 flex min-h-16 flex-wrap items-center justify-center gap-2">{Array.from({ length: currentWord.word.length }).map((_, index) => <div key={`${currentWord.word}-${index}`} className="flex h-12 w-10 items-center justify-center border-b-4 border-amber-400 text-2xl font-black sm:h-14 sm:w-12 sm:text-3xl">{selected[index]?.letter ?? ""}</div>)}</div>
            <div className="mt-7 flex flex-wrap justify-center gap-2 sm:gap-3">{tiles.map((tile) => { const used = selected.some((item) => item.id === tile.id); return <button key={tile.id} onClick={() => chooseTile(tile)} disabled={used || Boolean(feedback)} className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-black transition sm:h-14 sm:w-14 sm:text-2xl ${used ? "border-emerald-400/20 bg-emerald-400/5 text-slate-700" : "border-white/10 bg-white/10 hover:-translate-y-1 hover:bg-white/15"}`}>{tile.letter}</button>; })}</div>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button onClick={removeLast} disabled={selected.length === 0 || Boolean(feedback)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-slate-300 disabled:opacity-30">← Undo</button>
              <button onClick={useHint} disabled={selected.length >= currentWord.word.length || Boolean(feedback)} className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm font-black text-amber-300 disabled:opacity-30">💡 Hint</button>
              <button onClick={submitAnswer} disabled={answer.length !== currentWord.word.length || Boolean(feedback)} className="rounded-xl bg-amber-400 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-30">Build Word →</button>
            </div>
            <div className="mt-5 min-h-12 text-center text-sm font-black">
              {feedback === "correct" && <div className="text-emerald-300">✓ Correct! <span className="text-white">{currentWord.word}</span> — {currentWord.clue}</div>}
              {feedback === "wrong" && <div className="text-rose-300">Not quite. The word was <span className="text-white">{currentWord.word}</span>. Read the clue again and remember it.</div>}
            </div>
            <p className="mt-2 text-center text-xs text-slate-600">Hints used: {hintsUsed}</p>
          </div>
        </section>

        {completed && <GameResultCard result={finalResult ?? "lost"} playerName={player.name} gameName="Word Builder" xp={GAME_XP} progress={gameProgress} rewardClaimed={rewarded} onRetry={restartGame} />}
        {!completed && <div className="kiddo-restart mt-8 text-center"><button onClick={restartGame} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-400 transition hover:bg-white/10 hover:text-white">↻ Restart Game</button></div>}
        <footer className="py-10 text-center text-xs text-slate-600">KIDDO • Learn more. Unlock more. Play more. ⭐</footer>
      </div>
    </main>
  );
}
