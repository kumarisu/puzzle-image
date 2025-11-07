"use client";
import React, { useState, useEffect } from "react";

interface ImagePair {
  id: string;
  leftImage: string;
  rightImage: string;
  leftLabel: string;
  rightLabel: string;
}

interface Connection {
  leftId: string;
  rightId: string;
}

interface ImageMatchingProps {
  imagePairs: ImagePair[];
}

// Component để vẽ đường nối
function ConnectionLine({ leftId, rightId, color, leftImages, rightImages }: { 
  leftId: string; 
  rightId: string; 
  color: string;
  leftImages: Array<{ id: string; image: string; label: string; originalPairId: string }>;
  rightImages: Array<{ id: string; image: string; label: string; originalPairId: string }>;
}) {
  const leftIndex = leftImages.findIndex(img => img.id === leftId);
  const rightIndex = rightImages.findIndex(img => img.id === rightId);
  
  // Tính toán vị trí dựa trên index (giả sử mỗi item cao 112px + khoảng cách 16px)
  const itemHeight = 112 + 16; // height + gap
  const startY = 50; // offset từ đầu
  
  const y1 = startY + (leftIndex * itemHeight) + (itemHeight / 2);
  const y2 = startY + (rightIndex * itemHeight) + (itemHeight / 2);
  
  return (
    <line
      x1="0"
      y1={y1}
      x2="200"
      y2={y2}
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  );
}

export default function ImageMatching({ imagePairs }: ImageMatchingProps) {
  const [leftImages, setLeftImages] = useState<Array<{ id: string; image: string; label: string; originalPairId: string }>>([]);
  const [rightImages, setRightImages] = useState<Array<{ id: string; image: string; label: string; originalPairId: string }>>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{ correct: Connection[]; incorrect: Connection[] }>({ correct: [], incorrect: [] });

  useEffect(() => {
    // Tạo danh sách ảnh trái và phải, sau đó xáo trộn
    const left = imagePairs.map((pair, index) => ({
      id: `left-${pair.id}`,
      image: pair.leftImage,
      label: pair.leftLabel,
      originalPairId: pair.id
    }));
    
    const right = imagePairs.map((pair, index) => ({
      id: `right-${pair.id}`,
      image: pair.rightImage,
      label: pair.rightLabel,
      originalPairId: pair.id
    }));

    // Xáo trộn vị trí
    setLeftImages([...left].sort(() => Math.random() - 0.5));
    setRightImages([...right].sort(() => Math.random() - 0.5));
  }, [imagePairs]);

  const handleImageClick = (id: string, side: 'left' | 'right') => {
    if (side === 'left') {
      if (selectedLeft === id) {
        // Bỏ chọn nếu click vào ảnh đã chọn
        setSelectedLeft(null);
        return;
      }
      setSelectedLeft(id);
    } else {
      if (selectedRight === id) {
        // Bỏ chọn nếu click vào ảnh đã chọn
        setSelectedRight(null);
        return;
      }
      setSelectedRight(id);
    }

    // Kiểm tra xem có cần tạo kết nối không
    const currentLeft = side === 'left' ? id : selectedLeft;
    const currentRight = side === 'right' ? id : selectedRight;

    if (currentLeft && currentRight) {
      // Kiểm tra xem đã có kết nối nào với 2 ảnh này chưa
      const existingConnectionIndex = connections.findIndex(
        conn => conn.leftId === currentLeft || conn.rightId === currentRight
      );

      if (existingConnectionIndex !== -1) {
        // Xóa kết nối cũ
        const newConnections = connections.filter((_, index) => index !== existingConnectionIndex);
        setConnections(newConnections);
      }

      // Tạo kết nối mới
      const newConnection: Connection = {
        leftId: currentLeft,
        rightId: currentRight
      };

      setConnections([...connections.filter(conn => 
        conn.leftId !== currentLeft && conn.rightId !== currentRight
      ), newConnection]);

      // Reset selection
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const checkResults = () => {
    const correct: Connection[] = [];
    const incorrect: Connection[] = [];

    connections.forEach(connection => {
      const leftItem = leftImages.find(img => img.id === connection.leftId);
      const rightItem = rightImages.find(img => img.id === connection.rightId);

      if (leftItem && rightItem && leftItem.originalPairId === rightItem.originalPairId) {
        correct.push(connection);
      } else {
        incorrect.push(connection);
      }
    });

    setResults({ correct, incorrect });
    setShowResults(true);
  };

  const resetGame = () => {
    setConnections([]);
    setShowResults(false);
    setResults({ correct: [], incorrect: [] });
    setSelectedLeft(null);
    setSelectedRight(null);
    
    // Xáo trộn lại vị trí
    setLeftImages(prev => [...prev].sort(() => Math.random() - 0.5));
    setRightImages(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  const getConnectionColor = (connection: Connection) => {
    if (!showResults) return "#3B82F6"; // Blue default
    if (results.correct.some(c => c.leftId === connection.leftId && c.rightId === connection.rightId)) {
      return "#10B981"; // Green for correct
    }
    return "#EF4444"; // Red for incorrect
  };

  const getImageBorderColor = (id: string, side: 'left' | 'right') => {
    const isSelected = (side === 'left' && selectedLeft === id) || (side === 'right' && selectedRight === id);
    if (isSelected) return "border-blue-500 border-4";
    
    if (showResults) {
      const connection = connections.find(conn => 
        conn.leftId === id || conn.rightId === id
      );
      if (connection) {
        const isCorrect = results.correct.some(c => 
          c.leftId === connection.leftId && c.rightId === connection.rightId
        );
        return isCorrect ? "border-green-500 border-2" : "border-red-500 border-2";
      }
    }
    
    return "border-gray-300 border-2";
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-800">Nối ảnh đúng cặp</h2>
      
      <div className="relative flex justify-between w-full max-w-4xl">
        {/* Cột trái */}
        <div className="flex flex-col space-y-4 w-2/5">
          <h3 className="text-lg font-semibold text-center">Cột A</h3>
          {leftImages.map((item, index) => (
            <div
              key={item.id}
              data-id={item.id}
              className={`cursor-pointer rounded-lg overflow-hidden transition-all ${getImageBorderColor(item.id, 'left')}`}
              onClick={() => handleImageClick(item.id, 'left')}
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-24 object-cover"
              />
              <div className="p-2 bg-white">
                <p className="text-sm text-center font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Khu vực vẽ đường nối */}
        <div className="relative w-1/5 flex items-center justify-center">
          <svg
            width="100%"
            height="400px"
            className="absolute"
            style={{ zIndex: 10 }}
            viewBox="0 0 200 400"
          >
            {connections.map((connection, index) => (
              <ConnectionLine
                key={`${connection.leftId}-${connection.rightId}`}
                leftId={connection.leftId}
                rightId={connection.rightId}
                color={getConnectionColor(connection)}
                leftImages={leftImages}
                rightImages={rightImages}
              />
            ))}
          </svg>
        </div>

        {/* Cột phải */}
        <div className="flex flex-col space-y-4 w-2/5">
          <h3 className="text-lg font-semibold text-center">Cột B</h3>
          {rightImages.map((item, index) => (
            <div
              key={item.id}
              data-id={item.id}
              className={`cursor-pointer rounded-lg overflow-hidden transition-all ${getImageBorderColor(item.id, 'right')}`}
              onClick={() => handleImageClick(item.id, 'right')}
            >
              <img
                src={item.image}
                alt={item.label}
                className="w-full h-24 object-cover"
              />
              <div className="p-2 bg-white">
                <p className="text-sm text-center font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={checkResults}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          disabled={connections.length === 0}
        >
          Kiểm tra kết quả
        </button>
        <button
          onClick={resetGame}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Chơi lại
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg w-full max-w-2xl">
          <h3 className="text-lg font-bold mb-4">Kết quả:</h3>
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">
              ✅ Đúng: {results.correct.length}/{imagePairs.length}
            </p>
            <p className="text-red-600 font-semibold">
              ❌ Sai: {results.incorrect.length}
            </p>
            
            {results.correct.length === imagePairs.length && (
              <p className="text-xl text-green-600 font-bold animate-bounce mt-4">
                🎉 Hoàn thành xuất sắc! 🎉
              </p>
            )}

            {/* Hiển thị đáp án đúng cho những cặp sai */}
            {results.incorrect.length > 0 && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700 mb-2">Đáp án đúng:</p>
                {imagePairs.map((pair) => {
                  const leftItem = leftImages.find(img => img.originalPairId === pair.id);
                  const rightItem = rightImages.find(img => img.originalPairId === pair.id);
                  
                  return (
                    <div key={pair.id} className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{leftItem?.label}</span>
                      <span>↔</span>
                      <span>{rightItem?.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
