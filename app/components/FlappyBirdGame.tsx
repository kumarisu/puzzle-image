"use client";
import FlappyBird from "./FlappyBird";

interface FlappyBirdGameProps {
  onBack: () => void;
}

export default function FlappyBirdGame({ onBack }: FlappyBirdGameProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-sky-100 to-blue-200">
      {/* Header với nút quay lại */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          ← Quay lại
        </button>
        <h1 className="text-3xl font-bold text-gray-800">🐦 Flappy Bird</h1>
        <div className="w-24"></div> {/* Spacer để cân bằng layout */}
      </div>

      {/* Game Content */}
      <FlappyBird />
      
      {/* Additional Info */}
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-md">
        <h3 className="text-lg font-semibold mb-2 text-center">🏆 Thử thách</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Mục tiêu:</strong> Bay qua càng nhiều ống càng tốt</p>
          <p>• <strong>Điều khiển:</strong> Click chuột hoặc phím Space</p>
          <p>• <strong>Khó khăn:</strong> Trọng lực sẽ kéo chim xuống liên tục</p>
          <p>• <strong>Kỹ năng:</strong> Thời gian phản xạ và độ chính xác</p>
        </div>
      </div>
    </main>
  );
}
