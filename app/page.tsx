"use client";
import { useState } from "react";
import PuzzleGame from "./components/PuzzleGame";
import ImageMatchingGame from "./components/ImageMatchingGame";
import FlashcardGame from "./components/FlashcardGame";

type GameType = 'home' | 'puzzle' | 'matching' | 'flashcard';

export default function Page() {
  const [currentScreen, setCurrentScreen] = useState<GameType>('home');

  const goHome = () => setCurrentScreen('home');

  // Render màn hình tương ứng
  if (currentScreen === 'puzzle') {
    return <PuzzleGame onBack={goHome} />;
  }

  if (currentScreen === 'matching') {
    return <ImageMatchingGame onBack={goHome} />;
  }

  if (currentScreen === 'flashcard') {
    return <FlashcardGame onBack={goHome} />;
  }

  // Màn hình chính
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎮 Trò chơi giải trí
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Chọn một trò chơi để bắt đầu thử thách trí tuệ và giải trí của bạn!
        </p>
      </div>

      {/* Game Selection */}
      <div className="grid md:grid-cols-3 gap-8 max-w-4xl w-full">
        {/* Puzzle Game */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-6xl mb-4">🧩</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Xếp hình</h2>
          <p className="text-gray-600 mb-6">
            Tải lên hình ảnh và xếp các mảnh ghép để hoàn thành bức tranh
          </p>
          <button
            onClick={() => setCurrentScreen('puzzle')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Bắt đầu chơi
          </button>
        </div>

        {/* Image Matching Game */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nối ảnh</h2>
          <p className="text-gray-600 mb-6">
            Kết nối các hình ảnh tương ứng với nhau để hoàn thành thử thách
          </p>
          <button
            onClick={() => setCurrentScreen('matching')}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Bắt đầu chơi
          </button>
        </div>

        {/* Flashcard Game */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Flashcard</h2>
          <p className="text-gray-600 mb-6">
            Học từ vựng và kiến thức mới thông qua thẻ ghi nhớ tương tác
          </p>
          <button
            onClick={() => setCurrentScreen('flashcard')}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Bắt đầu chơi
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500">
        <p>Chọn trò chơi yêu thích và bắt đầu thử thách!</p>
      </div>
    </main>
  );
}
