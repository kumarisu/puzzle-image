"use client";
import { useState } from "react";
import UploadImage from "./UploadImage";
import PuzzleBoard from "./PuzzleBoard";

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

interface PuzzleGameProps {
  onBack: () => void;
}

export default function PuzzleGame({ onBack }: PuzzleGameProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<GridOption>(GRID_OPTIONS[0]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header với nút quay lại */}
      <div className="w-full max-w-7xl flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          ← Quay lại
        </button>
        <h1 className="text-3xl font-bold text-gray-800">🧩 Xếp hình</h1>
        <div className="w-24"></div> {/* Spacer để cân bằng layout */}
      </div>

      {/* Game Content */}
      {!imageUrl ? (
        <div className="text-center">
          <div className="mb-6 p-6 bg-white rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Chọn ảnh để bắt đầu</h2>
            <p className="text-gray-600 mb-4">
              Tải lên một hình ảnh và chúng tôi sẽ tạo puzzle cho bạn!
            </p>
          </div>
          <UploadImage onImageSelected={setImageUrl} />
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          {/* Điều khiển độ khó */}
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn độ khó:
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Puzzle Board */}
          <PuzzleBoard
            imageUrl={imageUrl}
            rows={selectedGrid.rows}
            cols={selectedGrid.cols}
          />
          
          {/* Nút điều khiển */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => setImageUrl(null)}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Chọn ảnh khác
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Về trang chính
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
