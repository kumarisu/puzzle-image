"use client";
import { useEffect, useState } from "react";

export default function PuzzleBoard({ imageUrl, gridSize = 2 }: { imageUrl: string, gridSize?: number }) {
  const [pieces, setPieces] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const arr = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    setPieces(shuffle(arr));
  }, [gridSize, imageUrl]);

  const shuffle = (array: number[]) => [...array].sort(() => Math.random() - 0.5);

  const handleClick = (index: number) => {
    if (selected === null) {
      setSelected(index);
    } else {
      const newPieces = [...pieces];
      [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]];
      setPieces(newPieces);
      setSelected(null);
    }
  };

  const checkWin = pieces.every((p, i) => p === i);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative"
        style={{
          width: 400,
          height: 400,
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
          gap: 2,
        }}
      >
        {pieces.map((piece, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
              backgroundPosition: `${(piece % gridSize) * (100 / (gridSize - 1))}% ${Math.floor(piece / gridSize) * (100 / (gridSize - 1))}%`,
            }}
            className={`border cursor-pointer ${selected === i ? "border-blue-500" : "border-gray-300"}`}
          />
        ))}
      </div>
      {checkWin && <p className="text-green-600 font-bold mt-3">🎉 Hoàn thành!</p>}
    </div>
  );
}
