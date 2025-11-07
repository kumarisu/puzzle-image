"use client";
import { useState } from "react";
import UploadImage from "./components/UploadImage";
import PuzzleBoard from "./components/PuzzleBoard";
import ImageMatching from "./components/ImageMatching";

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

// Dữ liệu mẫu cho game nối ảnh
const SAMPLE_IMAGE_PAIRS = [
  {
    id: "pair1",
    leftImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzNiODJmNiIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk3DqG88L3RleHQ+PC9zdmc+",
    rightImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNow688L3RleHQ+PC9zdmc+",
    leftLabel: "Mèo",
    rightLabel: "Chó"
  },
  {
    id: "pair2", 
    leftImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzc5N2U4MiIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk7Dumk8L3RleHQ+PC9zdmc+",
    rightImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzIyYzU1ZSIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkPDonk8L3RleHQ+PC9zdmc+",
    leftLabel: "Núi",
    rightLabel: "Cây"
  },
  {
    id: "pair3",
    leftImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzA2OWZkYiIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJp4bq/bjwvdGV4dD48L3N2Zz4=",
    rightImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzg3Y2VlYiIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkLhuqd1IHRyw7RpPC90ZXh0Pjwvc3ZnPg==",
    leftLabel: "Biển",
    rightLabel: "Bầu trời"
  },
  {
    id: "pair4",
    leftImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2Y5N2MzMCIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkhvYTwvdGV4dD48L3N2Zz4=",
    rightImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iIzUxY2M2MiIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkzDoTwvdGV4dD48L3N2Zz4=",
    leftLabel: "Hoa",
    rightLabel: "Lá"
  }
];

type GameType = 'puzzle' | 'matching';

export default function Page() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [selectedGrid, setSelectedGrid] = useState<GridOption>(GRID_OPTIONS[0]);
  const [gameType, setGameType] = useState<GameType>('puzzle');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Game Type Selector */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Trò chơi giải trí
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setGameType('puzzle')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              gameType === 'puzzle'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
          >
            🧩 Xếp hình
          </button>
          <button
            onClick={() => setGameType('matching')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              gameType === 'matching'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
            }`}
          >
            🔗 Nối ảnh
          </button>
        </div>
      </div>

      {/* Game Content */}
      {gameType === 'puzzle' ? (
        !imageUrl ? (
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
            
            <button
              onClick={() => setImageUrl(null)}
              className="mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Chọn ảnh khác
            </button>
          </>
        )
      ) : (
        <ImageMatching imagePairs={SAMPLE_IMAGE_PAIRS} />
      )}
    </main>
  );
}
