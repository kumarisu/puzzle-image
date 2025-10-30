"use client";
import React, { useState, useEffect } from "react";
import Tile from "./Tile";

interface PuzzleBoardProps {
  imageUrl: string;
  rows?: number;
  cols?: number;
}

export default function PuzzleBoard({ imageUrl, rows = 2, cols = 3 }: PuzzleBoardProps) {
  const total = rows * cols;

  // Tạo mảng vị trí ban đầu (0, 1, 2, ...)
  const [positions, setPositions] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const initial = Array.from({ length: total }, (_, i) => i);
    // Xáo trộn mảng
    const shuffled = [...initial].sort(() => Math.random() - 0.5);
    setPositions(shuffled);
  }, [rows, cols]);

  const handleDropTile = (from: number, to: number) => {
    const newPositions = [...positions];
    const fromPos = newPositions[from];
    newPositions[from] = newPositions[to];
    newPositions[to] = fromPos;
    setPositions(newPositions);

    // Kiểm tra hoàn thành
    const isDone = newPositions.every((val, i) => val === i);
    setIsComplete(isDone);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className="relative border border-gray-400 rounded-lg"
        style={{
          width: 600,
          height: 400,
          display: "grid",
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {positions.map((pos, i) => (
          <Tile
            key={i}
            imageUrl={imageUrl}
            index={i}
            position={pos}
            rows={rows}
            cols={cols}
            onDropTile={handleDropTile}
          />
        ))}
      </div>
      {isComplete && (
        <div className="text-green-600 font-bold text-lg animate-bounce">
          🎉 Hoàn thành! Tuyệt vời lắm! 🎉
        </div>
      )}
    </div>
  );
}
