"use client";
import { useState } from "react";
import UploadImage from "./components/UploadImage";
import PuzzleBoard from "./components/PuzzleBoard";

interface GridOption {
  label: string;
  rows: number;
  cols: number;
}

const GRID_OPTIONS: GridOption[] = [
  { label: "4 mảnh (2x2)", rows: 2, cols: 2 },
  { label: "6 mảnh (2x3)", rows: 2, cols: 3 },
  { label: "8 mảnh (2x4)", rows: 2, cols: 4 },
  { label: "9 mảnh (3x3)", rows: 3, cols: 3 },
  { label: "10 mảnh (2x5)", rows: 2, cols: 5 },
];

export default function Page() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<GridOption>(GRID_OPTIONS[0]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      {!imageUrl ? (
        <UploadImage onImageSelected={setImageUrl} />
      ) : (
        <>
          <div className="mb-4">
            <label className="mr-2 font-semibold">Chọn độ khó:</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedGrid.label}
              onChange={(e) => {
                const option = GRID_OPTIONS.find((o) => o.label === e.target.value);
                if (option) setSelectedGrid(option);
              }}
            >
              {GRID_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <PuzzleBoard
            imageUrl={imageUrl}
            rows={selectedGrid.rows}
            cols={selectedGrid.cols}
          />
        </>
      )}
    </main>
  );
}
