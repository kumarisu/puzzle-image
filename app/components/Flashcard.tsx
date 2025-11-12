"use client";
import React, { useState, useEffect } from "react";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  frontImage?: string;
  backImage?: string;
}

interface FlashcardProps {
  cards: FlashcardData[];
  onComplete?: () => void;
}

export default function Flashcard({ cards, onComplete }: FlashcardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [understoodCards, setUnderstoodCards] = useState<string[]>([]);
  const [needMorePractice, setNeedMorePractice] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Swipe gesture states
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  
  // Page flip animation states
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'left' | 'right'>('right');
  const [nextCardIndex, setNextCardIndex] = useState(0);

  const currentCard = cards[currentIndex];
  const previewCard = cards[nextCardIndex] || cards[0];

  // Reset khi cards thay đổi
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setUnderstoodCards([]);
    setNeedMorePractice([]);
    setIsCompleted(false);
  }, [cards]);

  const handleCardClick = () => {
    if (!isDragging) {
      setIsFlipped(!isFlipped);
    }
  };

  // Touch/Mouse event handlers for swipe
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setDragOffset({ x: 0, y: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    
    const swipeThreshold = 100; // Minimum distance for swipe
    const { x } = dragOffset;
    
    if (Math.abs(x) > swipeThreshold) {
      if (x > 0) {
        // Swipe right - đã hiểu
        handleRightSwipe();
      } else {
        // Swipe left - cần học thêm
        handleLeftSwipe();
      }
    } else {
      // Reset position if swipe not far enough
      setDragOffset({ x: 0, y: 0 });
    }
    
    setIsDragging(false);
  };

  const handleLeftSwipe = () => {
    // Đánh dấu cần học thêm
    if (!needMorePractice.includes(currentCard.id)) {
      setNeedMorePractice(prev => [...prev, currentCard.id]);
    }
    triggerPageFlip('left');
  };

  const handleRightSwipe = () => {
    // Đánh dấu đã hiểu
    if (!understoodCards.includes(currentCard.id)) {
      setUnderstoodCards(prev => [...prev, currentCard.id]);
    }
    triggerPageFlip('right');
  };

  const triggerPageFlip = (direction: 'left' | 'right') => {
    // Set up next card index
    const nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
    setNextCardIndex(nextIndex);
    setFlipDirection(direction);
    setIsFlipping(true);

    // After flip animation, actually change the card
    setTimeout(() => {
      nextCard();
      setIsFlipping(false);
    }, 600); // Match CSS animation duration
  };

  const nextCard = () => {
    // Reset swipe states
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Đã xem hết tất cả thẻ
      setIsCompleted(true);
    }
  };

  const resetFlashcards = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setUnderstoodCards([]);
    setNeedMorePractice([]);
    setIsCompleted(false);
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setIsFlipping(false);
    setNextCardIndex(0);
  };

  const goHome = () => {
    if (onComplete) {
      onComplete();
    }
  };

  if (isCompleted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[600px]">
        <div className="text-center space-y-6">
          {/* Hiệu ứng chúc mừng */}
          <div className="text-8xl animate-bounce">🎉</div>
          <h1 className="text-4xl font-bold text-green-600">Chúc mừng!</h1>
          <p className="text-xl text-gray-700">Bạn đã hoàn thành tất cả flashcards!</p>
          
          {/* Thống kê */}
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-4">Kết quả học tập:</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-600">✅ Đã hiểu:</span>
                <span className="font-bold text-green-600">{understoodCards.length}/{cards.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-orange-600">📚 Cần học thêm:</span>
                <span className="font-bold text-orange-600">{needMorePractice.length}/{cards.length}</span>
              </div>
              <div className="border-t pt-3">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(understoodCards.length / cards.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Tỷ lệ hiểu: {Math.round((understoodCards.length / cards.length) * 100)}%
                </p>
              </div>
            </div>
          </div>

          {/* Nút điều khiển */}
          <div className="flex space-x-4">
            <button
              onClick={resetFlashcards}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Học lại
            </button>
            <button
              onClick={goHome}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Flashcards</h2>
          <p className="text-gray-600">Thẻ {currentIndex + 1} / {cards.length}</p>
        </div>
        
        {/* Progress bar */}
        <div className="flex-1 max-w-xs ml-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Hướng dẫn */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Hướng dẫn:</strong> Click vào thẻ để lật. Vuốt sang trái (❌) nếu cần học thêm, vuốt sang phải (✅) nếu đã hiểu.
        </p>
      </div>

      {/* Main Card Area */}
      <div className="relative flex justify-center items-center min-h-[400px]">
        {/* Flip Effect Overlay */}
        {isFlipping && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className={`text-6xl animate-bounce ${flipDirection === 'right' ? 'text-green-500' : 'text-red-500'}`}>
              {flipDirection === 'right' ? '✅' : '❌'}
            </div>
          </div>
        )}

        {/* Swipe indicators */}
        <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
          isDragging && dragOffset.x < -50 ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
        }`}>
          <div className="bg-red-500 text-white p-4 rounded-full shadow-lg animate-pulse">
            <span className="text-3xl">❌</span>
          </div>
          <p className="text-sm font-medium text-red-600 mt-2 text-center">Cần học thêm</p>
        </div>

        <div className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 ${
          isDragging && dragOffset.x > 50 ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
        }`}>
          <div className="bg-green-500 text-white p-4 rounded-full shadow-lg animate-pulse">
            <span className="text-3xl">✅</span>
          </div>
          <p className="text-sm font-medium text-green-600 mt-2 text-center">Đã hiểu</p>
        </div>

        {/* Card Container with Page Flip Effect */}
        <div className="w-full max-w-2xl h-80 relative perspective-1000">
          {/* Current Card */}
          <div 
            className={`absolute inset-0 cursor-pointer select-none transition-all duration-600 ${
              isFlipping 
                ? (flipDirection === 'right' 
                    ? 'transform rotate-y-180 opacity-0' 
                    : 'transform rotate-y-neg-180 opacity-0')
                : 'transform rotate-y-0 opacity-100'
            }`}
            style={{
              transform: !isFlipping 
                ? `translateX(${dragOffset.x * 0.1}px) rotateZ(${dragOffset.x * 0.05}deg)` 
                : undefined,
              transition: isDragging && !isFlipping ? 'none' : 'transform 0.6s ease-out, opacity 0.6s ease-out'
            }}
            onClick={handleCardClick}
            onPointerDown={!isFlipping ? handlePointerDown : undefined}
            onPointerMove={!isFlipping ? handlePointerMove : undefined}
            onPointerUp={!isFlipping ? handlePointerUp : undefined}
            onPointerLeave={!isFlipping ? handlePointerUp : undefined}
          >
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front side */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-4 border-gray-300 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6">
                {currentCard.frontImage && (
                  <img 
                    src={currentCard.frontImage} 
                    alt="Front" 
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-3xl font-bold text-gray-800 text-center">
                  {currentCard.front}
                </h3>
                <p className="text-sm text-gray-500 mt-4">Click để lật • Vuốt để đánh giá</p>
              </div>

              {/* Back side */}
              <div className="absolute inset-0 w-full h-full backface-hidden bg-blue-50 border-4 border-blue-300 rounded-2xl shadow-lg flex flex-col items-center justify-center p-6 rotate-y-180">
                {currentCard.backImage && (
                  <img 
                    src={currentCard.backImage} 
                    alt="Back" 
                    className="w-32 h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-3xl font-bold text-blue-800 text-center">
                  {currentCard.back}
                </h3>
                <p className="text-sm text-blue-500 mt-4">Click để lật • Vuốt để đánh giá</p>
              </div>
            </div>
          </div>

          {/* Next Card (appears during flip) */}
          {isFlipping && (
            <div 
              className={`absolute inset-0 transition-all duration-600 ease-out ${
                flipDirection === 'right' 
                  ? 'animate-slide-in-right' 
                  : 'animate-slide-in-left'
              }`}
              style={{
                animationDelay: '300ms',
                animationFillMode: 'both'
              }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 w-full h-full bg-white border-4 border-gray-300 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6 transform scale-95 hover:scale-100 transition-transform">
                  {previewCard.frontImage && (
                    <img 
                      src={previewCard.frontImage} 
                      alt="Next Front" 
                      className="w-32 h-32 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-3xl font-bold text-gray-800 text-center">
                    {previewCard.front}
                  </h3>
                  <p className="text-sm text-gray-500 mt-4">Click để lật • Vuốt để đánh giá</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="mt-8 flex justify-center space-x-6">
        <button
          onClick={handleLeftSwipe}
          className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <span className="text-xl">❌</span>
          <span>Cần học thêm</span>
        </button>
        
        <button
          onClick={handleCardClick}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <span className="text-xl">🔄</span>
          <span>Lật thẻ</span>
        </button>

        <button
          onClick={handleRightSwipe}
          className="flex items-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <span className="text-xl">✅</span>
          <span>Đã hiểu</span>
        </button>
      </div>

      {/* Statistics */}
      <div className="mt-6 flex justify-center space-x-8 text-sm">
        <div className="text-green-600">
          ✅ Đã hiểu: {understoodCards.length}
        </div>
        <div className="text-red-600">
          ❌ Cần học thêm: {needMorePractice.length}
        </div>
      </div>
    </div>
  );
}

// CSS cho 3D flip effect (cần thêm vào global CSS)
const styles = `
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-preserve-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
