"use client";

import Link from "next/link";
import { GameProgress } from "@/types/game-progress";

const CONFETTI = [
  ["left-[8%]", "top-8", "rotate-12", "bg-yellow-400"],
  ["left-[16%]", "top-20", "-rotate-12", "bg-pink-400"],
  ["left-[27%]", "top-5", "rotate-45", "bg-cyan-400"],
  ["left-[38%]", "top-24", "-rotate-45", "bg-emerald-400"],
  ["left-[50%]", "top-3", "rotate-12", "bg-orange-400"],
  ["left-[61%]", "top-20", "-rotate-12", "bg-purple-400"],
  ["left-[73%]", "top-7", "rotate-45", "bg-yellow-400"],
  ["left-[84%]", "top-24", "-rotate-45", "bg-pink-400"],
  ["left-[92%]", "top-10", "rotate-12", "bg-cyan-400"],
  ["left-[12%]", "top-[45%]", "-rotate-45", "bg-emerald-400"],
  ["left-[24%]", "top-[58%]", "rotate-12", "bg-orange-400"],
  ["left-[78%]", "top-[52%]", "-rotate-12", "bg-purple-400"],
  ["left-[89%]", "top-[63%]", "rotate-45", "bg-yellow-400"],
  ["left-[6%]", "top-[72%]", "-rotate-45", "bg-pink-400"],
  ["left-[94%]", "top-[76%]", "rotate-12", "bg-cyan-400"],
];

type GameResultCardProps = {
  result: "won" | "lost";
  playerName: string;
  gameName: string;
  xp: number;
  progress: GameProgress;
  rewardClaimed: boolean;
  onRetry: () => void;
};

export function GameResultCard({
  result,
  playerName,
  gameName,
  xp,
  progress,
  rewardClaimed,
  onRetry,
}: GameResultCardProps) {
  const won = result === "won";
  const nextTier = progress.currentTier === "master" ? null : progress.currentTier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-sm">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900 p-7 text-center shadow-2xl sm:p-10">
        {won && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {CONFETTI.map(([position, top, rotation, background], index) => (
              <span
                key={index}
                className={`absolute h-3 w-2 rounded-sm ${position} ${top} ${rotation} ${background} animate-bounce opacity-90`}
              />
            ))}
          </div>
        )}

        <div className="relative z-10">
          <div className="text-7xl sm:text-8xl">{won ? "🏆" : "😞"}</div>

          <p className={`mt-4 text-sm font-black uppercase tracking-[0.25em] ${won ? "text-emerald-400" : "text-rose-400"}`}>
            KIDDO {gameName}
          </p>

          <h2 className="mt-2 text-4xl font-black sm:text-6xl">
            {won ? "YOU'VE WON!" : "OH OH… YOU'VE LOST!"}
          </h2>

          <p className="mt-4 text-lg text-slate-300 sm:text-xl">
            {won
              ? `Fantastic playing, ${playerName}! You showed great strategy.`
              : `Don't give up, ${playerName}. Try again and keep improving!`}
          </p>

          {won ? (
            <div className="mx-auto mt-7 max-w-sm rounded-3xl border border-yellow-300/30 bg-yellow-300/10 px-6 py-5">
              <div className="text-4xl font-black text-yellow-300">⭐ +{xp} XP</div>
              <p className="mt-1 font-bold text-slate-200">
                earned on your first win in {gameName}
              </p>
            </div>
          ) : (
            <div className="mx-auto mt-7 max-w-sm rounded-3xl border border-white/10 bg-white/5 px-6 py-5">
              <div className="text-3xl font-black">Keep going!</div>
              <p className="mt-1 text-sm text-slate-400">
                Win the next round to progress your {gameName} level.
              </p>
            </div>
          )}

          {won && rewardClaimed && (
            <p className="mt-4 rounded-2xl bg-emerald-400/10 px-4 py-3 font-bold text-emerald-300">
              ⭐ You've already earned the XP for this game. Keep playing to improve your skills!
            </p>
          )}

          <div className="mt-7 grid grid-cols-[1fr_auto] gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <Link
              href="/games"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-black transition hover:bg-white/10"
            >
              <span className="text-2xl">←</span>
              <span>Back</span>
            </Link>

            <button
              onClick={onRetry}
              aria-label="Retry game"
              title="Retry game"
              className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-2xl font-black text-slate-950 transition hover:scale-105 hover:bg-cyan-300"
            >
              ↻
            </button>

            <div className="hidden items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4 sm:flex">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Game level</p>
                <p className="text-lg font-black capitalize">{nextTier ?? "Master"}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:hidden">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Game level</p>
            <p className="mt-1 text-lg font-black capitalize">{nextTier ?? "Master"}</p>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            {progress.wins} wins • {progress.losses} losses • {progress.masteryScore}% mastery
          </p>
        </div>
      </section>
    </div>
  );
}
