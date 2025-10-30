"use client";
import React, { useEffect, useMemo, useState } from "react";

type Props = {
  imageUrl: string;
  rows?: number;
  cols?: number;
  boardSizePx?: number;
  gapPx?: number;
  onWin?: () => void;
};

export default function PuzzleBoard({
  imageUrl,
  rows = 2,
  cols = 2,
  boardSizePx = 400,
  gapPx = 4,
  onWin,
}: Props) {
  const N = rows * cols;
  const [pieces, setPieces] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [isWin, setIsWin] = useState(false);

  useEffect(() => {
    // initialize & shuffle
    const arr = Array.from({ length: N }, (_, i) => i);
    setPieces(shuffle(arr));
    setSelected(null);
    setIsWin(false);
  }, [imageUrl, rows, cols]);

  useEffect(() => {
    if (pieces.length === N && pieces.every((p, i) => p === i)) {
      setIsWin(true);
      onWin?.();
    } else {
      setIsWin(false);
    }
  }, [pieces, N, onWin]);

  function shuffle<T>(array: T[]) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    // avoid already-solved
    if (a.every((v, i) => v === (array as any)[i])) return shuffle(array);
    return a;
  }

  const handleClick = (index: number) => {
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    const next = pieces.slice();
    [next[selected], next[index]] = [next[index], next[selected]];
    setPieces(next);
    setSelected(null);
  };

  // compute style values
  const cellSize = (boardSizePx - gapPx * (cols - 1)) / cols;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: boardSizePx,
          height: (boardSizePx * rows) / cols, // if want square board, set height = boardSizePx
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
          gap: gapPx,
          userSelect: "none",
        }}
      >
        {pieces.map((pieceId, index) => {
          const xIndex = pieceId % cols;
          const yIndex = Math.floor(pieceId / cols);
          const posX = cols === 1 ? 50 : (xIndex / (cols - 1)) * 100;
          const posY = rows === 1 ? 50 : (yIndex / (rows - 1)) * 100;
          return (
            <div
              key={index}
              onClick={() => handleClick(index)}
              role="button"
              aria-label={`Puzzle piece ${index + 1}`}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${posX}% ${posY}%`,
                border: selected === index ? "3px solid #2473ff" : "1px solid #e0e0e0",
                borderRadius: 6,
                boxSizing: "border-box",
                cursor: "pointer",
              }}
            />
          );
        })}
      </div>

      {isWin && <div style={{ marginTop: 12, color: "#0a7", fontWeight: 700 }}>🎉 Hoàn thành!</div>}
    </div>
  );
}