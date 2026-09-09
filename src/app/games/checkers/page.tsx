"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Player } from "@/lib/kiddo";
import { awardXP, getActivityResults, getCurrentPlayer, recordActivityResult } from "@/lib/player";
import { applyMove, CheckersBoard, CheckersMove, CheckersPlayer, createInitialBoard, countPieces, getCaptureMoves, getLegalMoves } from "@/lib/games/checkers";
import { getGameProgress, getGameTiers, getNextGameTier, recordGameResult } from "@/lib/game-progression";
import { GameProgress } from "@/types/game-progress";
import { GameResultCard } from "@/components/games/GameResultCard";

const GAME_XP = 50;
const GAME_ID = "checkers-v1";
type GameStatus = "playing" | "won" | "lost";
type FinishedGameStatus = Exclude<GameStatus, "playing">;

function samePosition(a: { row: number; col: number }, b: { row: number; col: number }) { return a.row === b.row && a.col === b.col; }
function chooseComputerMove(board: CheckersBoard): CheckersMove | null {
  const moves = getLegalMoves(board, "black"); if (moves.length === 0) return null;
  const captures = moves.filter((move) => move.capture); const pool = captures.length > 0 ? captures : moves;
  return [...pool].sort((a, b) => ((b.capture ? 10 : 0) + (b.to.row === 7 ? 3 : 0)) - ((a.capture ? 10 : 0) + (a.to.row === 7 ? 3 : 0)))[0];
}
function playComputerTurn(startBoard: CheckersBoard) {
  let currentBoard = startBoard; let totalMoves = 0; let move = chooseComputerMove(currentBoard);
  while (move) {
    const result = applyMove(currentBoard, move); currentBoard = result.board; totalMoves += 1;
    if (result.promoted || !move.capture) break;
    const continuations = getCaptureMoves(currentBoard, "black").filter((candidate) => samePosition(candidate.from, move!.to));
    if (continuations.length === 0) break;
    move = [...continuations].sort((a, b) => (b.to.row === 7 ? 3 : 0) - (a.to.row === 7 ? 3 : 0))[0];
  }
  return { board: currentBoard, moves: totalMoves };
}

export default function CheckersPage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [board, setBoard] = useState<CheckersBoard>(createInitialBoard());
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [legalMoves, setLegalMoves] = useState<CheckersMove[]>([]);
  const [turn, setTurn] = useState<CheckersPlayer>("red");
  const [status, setStatus] = useState<GameStatus>("playing");
  const [moves, setMoves] = useState(0);
  const [rewarded, setRewarded] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [gameProgress, setGameProgress] = useState<GameProgress | null>(null);

  useEffect(() => {
    const current = getCurrentPlayer();
    if (!current) { window.location.href = "/players"; return; }
    setPlayer(current);
    setRewarded(getActivityResults(current.id).some((result) => result.activityType === "checkers" && result.activityId === GAME_ID));
    setGameProgress(getGameProgress(current.id, GAME_ID, current.grade));
  }, []);

  function resetGame() { setBoard(createInitialBoard()); setSelected(null); setLegalMoves([]); setTurn("red"); setStatus("playing"); setMoves(0); setThinking(false); }
  function finishGame(result: FinishedGameStatus, finalMoves = moves) {
    if (status !== "playing" || !player) return;
    setStatus(result);
    const nextProgress = recordGameResult(player.id, GAME_ID, player.grade, result); setGameProgress(nextProgress);
    if (result !== "won" || rewarded) return;
    awardXP(player.id, GAME_XP);
    recordActivityResult({ id: `checkers-${player.id}-${Date.now()}`, playerId: player.id, activityType: "checkers", activityId: GAME_ID, skills: [], correct: true, attempts: finalMoves, hintsUsed: 0, difficulty: 1, xpAwarded: GAME_XP, timestamp: new Date().toISOString() });
    setRewarded(true);
  }
  function evaluatePosition(nextBoard: CheckersBoard, nextTurn: CheckersPlayer, moveCount = moves) {
    const opponent: CheckersPlayer = nextTurn === "red" ? "black" : "red";
    if (countPieces(nextBoard, opponent) === 0 || getLegalMoves(nextBoard, opponent).length === 0) { finishGame(nextTurn === "red" ? "won" : "lost", moveCount); return true; }
    return false;
  }
  function makeComputerTurn(nextBoard: CheckersBoard, currentMoveCount: number) {
    setThinking(true);
    window.setTimeout(() => {
      const computerResult = playComputerTurn(nextBoard); const totalMoveCount = currentMoveCount + computerResult.moves;
      setBoard(computerResult.board); setMoves(totalMoveCount);
      if (!evaluatePosition(computerResult.board, "red", totalMoveCount)) setTurn("red");
      setThinking(false);
    }, 450);
  }
  function handleSquareClick(row: number, col: number) {
    if (turn !== "red" || status !== "playing" || thinking) return;
    const piece = board[row][col];
    if (selected) {
      const chosenMove = legalMoves.find((move) => move.to.row === row && move.to.col === col);
      if (chosenMove) {
        const result = applyMove(board, chosenMove); const nextMoveCount = moves + 1;
        setBoard(result.board); setSelected(null); setLegalMoves([]); setMoves(nextMoveCount);
        if (evaluatePosition(result.board, "black", nextMoveCount)) return;
        if (chosenMove.capture && !result.promoted) {
          const continued = getCaptureMoves(result.board, "red").filter((move) => samePosition(move.from, chosenMove.to));
          if (continued.length > 0) { setSelected(chosenMove.to); setLegalMoves(continued); return; }
        }
        setTurn("black"); makeComputerTurn(result.board, nextMoveCount); return;
      }
    }
    if (piece?.player === "red") {
      const fromThisPiece = getLegalMoves(board, "red").filter((move) => samePosition(move.from, { row, col }));
      if (fromThisPiece.length > 0) { setSelected({ row, col }); setLegalMoves(fromThisPiece); return; }
    }
    setSelected(null); setLegalMoves([]);
  }

  if (!player || !gameProgress) return null;
  const redPieces = countPieces(board, "red"); const blackPieces = countPieces(board, "black"); const tiers = getGameTiers(); const nextTier = getNextGameTier(gameProgress);

  return (
    <main className="kiddo-game-screen min-h-screen bg-slate-950 text-white">
      <div className="kiddo-game-shell mx-auto min-h-screen max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between">
          <Link href="/games" className="text-sm font-bold text-slate-400 transition hover:text-white">← Game Room</Link>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2"><span className="text-xs text-slate-500">PLAYER</span><span className="ml-2 font-black">{player.name}</span></div>
        </header>
        <section className="kiddo-game-title mt-8 text-center"><p className="text-sm font-bold uppercase tracking-widest text-cyan-400">KIDDO Game</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">Draughts 🔴</h1><p className="mx-auto mt-3 max-w-xl text-slate-400">Think ahead, capture pieces and reach the other side to become a flying king.</p></section>
        <section className="kiddo-progression-panel mx-auto mt-6 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-4"><div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-slate-500">Game Level</p><p className="mt-1 text-2xl font-black capitalize text-cyan-300">{gameProgress.currentTier}</p></div><div className="text-right"><p className="text-xs text-slate-500">{gameProgress.wins} wins • {gameProgress.masteryScore}% mastery</p><p className="mt-1 text-sm font-bold text-slate-300">{nextTier ? `Win ${Math.max(0, nextTier.unlockWins - gameProgress.wins)} more to reach ${nextTier.name}` : "Master level reached!"}</p></div></div><div className="kiddo-tier-list mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">{tiers.map((tier) => { const unlocked = tiers.findIndex((item) => item.id === gameProgress.currentTier) >= tiers.findIndex((item) => item.id === tier.id); return <div key={tier.id} className={`rounded-xl px-2 py-2 text-center text-xs font-black capitalize ${unlocked ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-slate-600"}`}>{unlocked ? "✓ " : "🔒 "}{tier.name}</div>; })}</div></section>
        <section className="kiddo-game-stats mx-auto mt-6 flex max-w-3xl items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4"><div><p className="text-xs text-slate-500">YOUR PIECES</p><p className="text-2xl font-black">{redPieces}</p></div><div className="text-center"><p className="text-xs text-slate-500">TURN</p><p className="text-lg font-black">{thinking ? "Computer thinking…" : turn === "red" ? "Your turn" : "Computer"}</p></div><div className="text-right"><p className="text-xs text-slate-500">COMPUTER</p><p className="text-2xl font-black">{blackPieces}</p></div></section>
        <section className="kiddo-game-stage mx-auto mt-8 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-2 shadow-2xl sm:p-4">
          <div className="kiddo-checkers-board grid grid-cols-8 overflow-hidden rounded-2xl">{board.map((row, rowIndex) => row.map((piece, colIndex) => { const dark = (rowIndex + colIndex) % 2 === 1; const isSelected = selected?.row === rowIndex && selected?.col === colIndex; const isDestination = legalMoves.some((move) => move.to.row === rowIndex && move.to.col === colIndex); const key = `${rowIndex}-${colIndex}`; return <button key={key} onClick={() => handleSquareClick(rowIndex, colIndex)} className={`relative aspect-square flex items-center justify-center ${dark ? "bg-amber-900/70" : "bg-amber-100"} ${isSelected ? "ring-4 ring-inset ring-cyan-400" : ""}`} aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}`}>{isDestination && !piece && <span className="h-4 w-4 rounded-full bg-cyan-400/70 shadow-lg sm:h-5 sm:w-5" />}{piece && <span className={`flex h-[68%] w-[68%] items-center justify-center rounded-full border-4 shadow-lg transition ${piece.player === "red" ? "border-red-200/40 bg-red-600" : "border-slate-300/40 bg-slate-900"}`}>{piece.king && <span className="text-lg sm:text-2xl">👑</span>}</span>}</button>; }))}</div>
        </section>
        <p className="kiddo-game-help mx-auto mt-4 max-w-2xl text-center text-sm text-slate-500">Captures are mandatory. Kings can move any distance along a clear diagonal. Select one of your pieces, then choose a highlighted square.</p>
        {status !== "playing" && <GameResultCard result={status} playerName={player.name} gameName="Draughts" xp={GAME_XP} progress={gameProgress} rewardClaimed={rewarded} onRetry={resetGame} />}
        <footer className="py-10 text-center text-xs text-slate-600">KIDDO • Learn more. Unlock more. Play more. ⭐</footer>
      </div>
    </main>
  );
}
