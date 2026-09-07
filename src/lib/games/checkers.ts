export type CheckersPlayer = "red" | "black";

export type CheckersPiece = {
  player: CheckersPlayer;
  king: boolean;
};

export type CheckersBoard = Array<Array<CheckersPiece | null>>;

export type CheckersPosition = {
  row: number;
  col: number;
};

export type CheckersMove = {
  from: CheckersPosition;
  to: CheckersPosition;
  capture?: CheckersPosition;
};

export const BOARD_SIZE = 8;

export function createInitialBoard(): CheckersBoard {
  const board: CheckersBoard = Array.from({ length: BOARD_SIZE }, () =>
    Array<CheckersPiece | null>(BOARD_SIZE).fill(null)
  );

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if ((row + col) % 2 !== 1) continue;

      if (row < 3) board[row][col] = { player: "black", king: false };
      if (row > 4) board[row][col] = { player: "red", king: false };
    }
  }

  return board;
}

function inside(row: number, col: number) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function directions(piece: CheckersPiece): Array<[number, number]> {
  if (piece.king) {
    return [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
  }

  const forward = piece.player === "red" ? -1 : 1;
  return [
    [forward, -1],
    [forward, 1],
  ];
}

export function getCaptureMoves(
  board: CheckersBoard,
  player: CheckersPlayer
): CheckersMove[] {
  const moves: CheckersMove[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.player !== player) continue;

      for (const [dr, dc] of directions(piece)) {
        let scanRow = row + dr;
        let scanCol = col + dc;

        if (!piece.king) {
          const landingRow = row + dr * 2;
          const landingCol = col + dc * 2;
          if (!inside(landingRow, landingCol) || !inside(scanRow, scanCol)) continue;

          const jumped = board[scanRow][scanCol];
          if (!jumped || jumped.player === player || board[landingRow][landingCol]) continue;

          moves.push({
            from: { row, col },
            to: { row: landingRow, col: landingCol },
            capture: { row: scanRow, col: scanCol },
          });
          continue;
        }

        // Flying king: scan until the first occupied square. If it is an
        // opponent, every empty square beyond it is a legal landing square.
        while (inside(scanRow, scanCol) && !board[scanRow][scanCol]) {
          scanRow += dr;
          scanCol += dc;
        }

        if (!inside(scanRow, scanCol)) continue;

        const jumped = board[scanRow][scanCol];
        if (!jumped || jumped.player === player) continue;

        let landingRow = scanRow + dr;
        let landingCol = scanCol + dc;
        while (inside(landingRow, landingCol) && !board[landingRow][landingCol]) {
          moves.push({
            from: { row, col },
            to: { row: landingRow, col: landingCol },
            capture: { row: scanRow, col: scanCol },
          });
          landingRow += dr;
          landingCol += dc;
        }
      }
    }
  }

  return moves;
}

export function getSimpleMoves(
  board: CheckersBoard,
  player: CheckersPlayer
): CheckersMove[] {
  const moves: CheckersMove[] = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.player !== player) continue;

      for (const [dr, dc] of directions(piece)) {
        let nextRow = row + dr;
        let nextCol = col + dc;

        if (!piece.king) {
          if (!inside(nextRow, nextCol) || board[nextRow][nextCol]) continue;
          moves.push({
            from: { row, col },
            to: { row: nextRow, col: nextCol },
          });
          continue;
        }

        // Flying king: any unobstructed square along the diagonal is legal.
        while (inside(nextRow, nextCol) && !board[nextRow][nextCol]) {
          moves.push({
            from: { row, col },
            to: { row: nextRow, col: nextCol },
          });
          nextRow += dr;
          nextCol += dc;
        }
      }
    }
  }

  return moves;
}

export function getLegalMoves(
  board: CheckersBoard,
  player: CheckersPlayer
): CheckersMove[] {
  const captures = getCaptureMoves(board, player);
  return captures.length > 0 ? captures : getSimpleMoves(board, player);
}

export function applyMove(
  board: CheckersBoard,
  move: CheckersMove
): { board: CheckersBoard; promoted: boolean } {
  const next = board.map((row) => row.map((piece) => (piece ? { ...piece } : null)));
  const piece = next[move.from.row][move.from.col];

  if (!piece) return { board: next, promoted: false };

  next[move.from.row][move.from.col] = null;
  next[move.to.row][move.to.col] = piece;

  if (move.capture) {
    next[move.capture.row][move.capture.col] = null;
  }

  const promoted =
    !piece.king &&
    ((piece.player === "red" && move.to.row === 0) ||
      (piece.player === "black" && move.to.row === BOARD_SIZE - 1));

  if (promoted) piece.king = true;

  return { board: next, promoted };
}

export function hasAnyMove(board: CheckersBoard, player: CheckersPlayer) {
  return getLegalMoves(board, player).length > 0;
}

export function countPieces(board: CheckersBoard, player: CheckersPlayer) {
  return board.flat().filter((piece) => piece?.player === player).length;
}
