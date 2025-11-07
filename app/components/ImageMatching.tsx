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
  connectionId: number;
}

interface ImageMatchingProps {
  imagePairs: ImagePair[];
}

// Màu sắc để phân biệt các cặp đã nối
const CONNECTION_COLORS = [
  { bg: "bg-red-200", border: "border-red-500", icon: "🔴", name: "red" },
  { bg: "bg-blue-200", border: "border-blue-500", icon: "🔵", name: "blue" },
  { bg: "bg-green-200", border: "border-green-500", icon: "🟢", name: "green" },
  { bg: "bg-yellow-200", border: "border-yellow-500", icon: "🟡", name: "yellow" },
  { bg: "bg-purple-200", border: "border-purple-500", icon: "🟣", name: "purple" },
  { bg: "bg-pink-200", border: "border-pink-500", icon: "🩷", name: "pink" }
];

// Hàm để lấy số thứ tự cặp từ originalPairId
const getPairNumber = (originalPairId: string, imagePairs: ImagePair[]) => {
  return imagePairs.findIndex(pair => pair.id === originalPairId) + 1;
};

// Hàm shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function ImageMatching({ imagePairs }: ImageMatchingProps) {
  const [leftColumn, setLeftColumn] = useState<{id: string, image: string, label: string, originalPairId: string}[]>([]);
  const [rightColumn, setRightColumn] = useState<{id: string, image: string, label: string, originalPairId: string}[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [connectionCounter, setConnectionCounter] = useState(0);

  useEffect(() => {
    // Tạo cột trái và cột phải
    const leftImages = imagePairs.map(pair => ({
      id: `left-${pair.id}`,
      image: pair.leftImage,
      label: pair.leftLabel,
      originalPairId: pair.id
    }));

    const rightImages = imagePairs.map(pair => ({
      id: `right-${pair.id}`,
      image: pair.rightImage, 
      label: pair.rightLabel,
      originalPairId: pair.id
    }));

    // Shuffle cả hai cột
    setLeftColumn(shuffleArray(leftImages));
    setRightColumn(shuffleArray(rightImages));
  }, [imagePairs]);

  const handleImageClick = (imageId: string, side: 'left' | 'right') => {
    // Kiểm tra xem ảnh đã được nối chưa
    const isConnected = connections.some(conn => conn.leftId === imageId || conn.rightId === imageId);
    if (isConnected) return;

    if (side === 'left') {
      if (selectedLeft === imageId) {
        setSelectedLeft(null);
      } else {
        setSelectedLeft(imageId);
        // Nếu đã có ảnh phải được chọn, tạo kết nối ngay
        if (selectedRight) {
          const newConnection: Connection = {
            leftId: imageId,
            rightId: selectedRight,
            connectionId: connectionCounter
          };
          setConnections(prev => [...prev, newConnection]);
          setConnectionCounter(prev => prev + 1);
          setSelectedLeft(null);
          setSelectedRight(null);
        }
      }
    } else {
      if (selectedRight === imageId) {
        setSelectedRight(null);
      } else {
        setSelectedRight(imageId);
        // Nếu đã có ảnh trái được chọn, tạo kết nối ngay
        if (selectedLeft) {
          const newConnection: Connection = {
            leftId: selectedLeft,
            rightId: imageId,
            connectionId: connectionCounter
          };
          setConnections(prev => [...prev, newConnection]);
          setConnectionCounter(prev => prev + 1);
          setSelectedLeft(null);
          setSelectedRight(null);
        }
      }
    }
  };

  const removeConnection = (connectionId: number) => {
    setConnections(prev => prev.filter(conn => conn.connectionId !== connectionId));
  };

  const getConnectionColor = (imageId: string) => {
    const connection = connections.find(conn => conn.leftId === imageId || conn.rightId === imageId);
    if (!connection) return null;
    
    return CONNECTION_COLORS[connection.connectionId % CONNECTION_COLORS.length];
  };

  const checkResults = () => {
    setShowResults(true);
  };

  const resetGame = () => {
    setConnections([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setShowResults(false);
    setConnectionCounter(0);
    
    // Shuffle lại cột
    const leftImages = imagePairs.map(pair => ({
      id: `left-${pair.id}`,
      image: pair.leftImage,
      label: pair.leftLabel,
      originalPairId: pair.id
    }));

    const rightImages = imagePairs.map(pair => ({
      id: `right-${pair.id}`,
      image: pair.rightImage,
      label: pair.rightLabel,
      originalPairId: pair.id
    }));

    setLeftColumn(shuffleArray(leftImages));
    setRightColumn(shuffleArray(rightImages));
  };

  const isCorrectConnection = (connection: Connection) => {
    const leftImage = leftColumn.find(img => img.id === connection.leftId);
    const rightImage = rightColumn.find(img => img.id === connection.rightId);
    
    return leftImage?.originalPairId === rightImage?.originalPairId;
  };

  const getCorrectPairs = () => {
    return connections.filter(conn => isCorrectConnection(conn)).length;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Hướng dẫn */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Hướng dẫn chơi:</h2>
        <p className="text-gray-700">
          Nhấp vào một ảnh ở cột A, sau đó nhấp vào ảnh tương ứng ở cột B để tạo kết nối. 
          Sau khi hoàn thành, nhấn "Kiểm tra kết quả" để xem kết quả.
        </p>
      </div>
      
      <div className="relative flex justify-center w-full max-w-7xl gap-8">
        {/* Cột trái */}
        <div className="flex flex-col space-y-4 w-[40%]">
          <h3 className="text-lg font-semibold text-center">Cột A</h3>
          {leftColumn.map((image) => {
            const color = getConnectionColor(image.id);
            const isSelected = selectedLeft === image.id;
            const connection = connections.find(conn => conn.leftId === image.id);
            const isCorrect = connection ? isCorrectConnection(connection) : null;
            
            return (
              <div
                key={image.id}
                className={`
                  relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-4
                  ${isSelected ? 'border-blue-500 shadow-lg' : 
                    showResults && connection ?
                      (isCorrect ? 'border-green-500' : 'border-red-500') :
                    color ? `${color.border}` : 'border-gray-300 hover:border-gray-400'}
                  ${color && !showResults ? color.bg : ''}
                `}
                onClick={() => handleImageClick(image.id, 'left')}
              >
                <img 
                  src={image.image} 
                  alt={image.label}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2 bg-white">
                  <p className="text-sm font-medium text-center">{image.label}</p>
                </div>
                
                {/* Badge hiển thị số cặp khi đã kiểm tra kết quả */}
                {showResults && connection && (
                  <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {getPairNumber(leftColumn.find(img => img.id === image.id)?.originalPairId || '', imagePairs)}
                  </div>
                )}
                
                {/* Hiển thị số thứ tự kết nối khi chưa kiểm tra */}
                {!showResults && color && (
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                    {connection?.connectionId !== undefined ? (connection.connectionId + 1) : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Cột phải */}
        <div className="flex flex-col space-y-4 w-[40%]">
          <h3 className="text-lg font-semibold text-center">Cột B</h3>
          {rightColumn.map((image) => {
            const color = getConnectionColor(image.id);
            const isSelected = selectedRight === image.id;
            const connection = connections.find(conn => conn.rightId === image.id);
            const isCorrect = connection ? isCorrectConnection(connection) : null;
            
            return (
              <div
                key={image.id}
                className={`
                  relative cursor-pointer transition-all duration-200 rounded-lg overflow-hidden border-4
                  ${isSelected ? 'border-blue-500 shadow-lg' : 
                    showResults && connection ?
                      (isCorrect ? 'border-green-500' : 'border-red-500') :
                    color ? `${color.border}` : 'border-gray-300 hover:border-gray-400'}
                  ${color && !showResults ? color.bg : ''}
                `}
                onClick={() => handleImageClick(image.id, 'right')}
              >
                <img 
                  src={image.image} 
                  alt={image.label}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2 bg-white">
                  <p className="text-sm font-medium text-center">{image.label}</p>
                </div>
                
                {/* Badge hiển thị số cặp khi đã kiểm tra kết quả */}
                {showResults && connection && (
                  <div className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                    {getPairNumber(rightColumn.find(img => img.id === image.id)?.originalPairId || '', imagePairs)}
                  </div>
                )}
                
                {/* Hiển thị số thứ tự kết nối khi chưa kiểm tra */}
                {!showResults && color && (
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                    {connection?.connectionId !== undefined ? (connection.connectionId + 1) : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Khu vực điều khiển và thông tin - di chuyển xuống dưới */}
      <div className="mt-8 flex flex-col items-center space-y-4">
        {/* Hiển thị các kết nối */}
        <div className="flex flex-wrap justify-center gap-2">
          {connections.map((connection) => {
            const color = CONNECTION_COLORS[connection.connectionId % CONNECTION_COLORS.length];
            return (
              <button
                key={connection.connectionId}
                onClick={() => removeConnection(connection.connectionId)}
                className={`px-3 py-1 rounded-full text-white text-sm font-medium hover:opacity-80 ${color.border.replace('border-', 'bg-')}`}
                title="Nhấp để xóa kết nối"
              >
                {connection.connectionId + 1}
              </button>
            );
          })}
        </div>
        
        {/* Nút điều khiển */}
        <div className="flex space-x-4">
          <button
            onClick={checkResults}
            disabled={connections.length === 0}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Kiểm tra kết quả
          </button>
          
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Chơi lại
          </button>
        </div>

        {/* Hiển thị kết quả */}
        {showResults && (
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-lg font-semibold text-green-800 text-center">
              Kết quả: {getCorrectPairs()}/{connections.length} cặp đúng
            </p>
          </div>
        )}
      </div>

      {/* Chú thích ở dưới */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Chú thích:</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p>• <span className="font-medium">Số trong vòng tròn đen:</span> Thứ tự kết nối bạn đã tạo</p>
          <p>• <span className="font-medium">Số trong vòng tròn xanh/đỏ:</span> Số thứ tự cặp đúng sau khi kiểm tra (xanh = đúng, đỏ = sai)</p>
          <p>• <span className="font-medium">Viền xanh lá/đỏ:</span> Màu viền sau khi kiểm tra kết quả</p>
        </div>
      </div>
    </div>
  );
}
