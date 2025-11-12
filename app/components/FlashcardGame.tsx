"use client";
import Flashcard from "./Flashcard";

// Dữ liệu mẫu cho flashcards
const SAMPLE_FLASHCARDS = [
  {
    id: "card1",
    front: "Hello",
    back: "Xin chào",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%233b82f6'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='30' fill='white' text-anchor='middle'%3EH%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%2310b981'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3EXin%3C/text%3E%3C/svg%3E"
  },
  {
    id: "card2", 
    front: "Thank you",
    back: "Cảm ơn",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%2310b981'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3ETY%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23f97316'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='16' fill='white' text-anchor='middle'%3ECảm%3C/text%3E%3C/svg%3E"
  },
  {
    id: "card3",
    front: "Good morning",
    back: "Chào buổi sáng",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23f97c30'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='18' fill='white' text-anchor='middle'%3EGM%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23eab308'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EChào%3C/text%3E%3C/svg%3E"
  },
  {
    id: "card4",
    front: "Good night",
    back: "Chúc ngủ ngon",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%236973db'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='18' fill='white' text-anchor='middle'%3EGN%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%236366f1'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='12' fill='white' text-anchor='middle'%3EChúc%3C/text%3E%3C/svg%3E"
  },
  {
    id: "card5",
    front: "How are you?",
    back: "Bạn khỏe không?",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%2322c55e'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3E%3F%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%2316a34a'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='12' fill='white' text-anchor='middle'%3EBạn%3C/text%3E%3C/svg%3E"
  },
  {
    id: "card6",
    front: "I love you",
    back: "Anh yêu em",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23ef4444'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='20' fill='white' text-anchor='middle'%3E♥%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23dc2626'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EYêu%3C/text%3E%3C/svg%3E"
  },
  {
    id: "card7",
    front: "Water",
    back: "Nước",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23069fdb'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='18' fill='white' text-anchor='middle'%3EW%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%230891b2'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='18' fill='white' text-anchor='middle'%3ENước%3C/text%3E%3C/svg%3E"
  },
  {
    id: "card8",
    front: "Food",
    back: "Đồ ăn",
    frontImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%23797e82'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='18' fill='white' text-anchor='middle'%3EF%3C/text%3E%3C/svg%3E",
    backImage: "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100' height='100' fill='%236b7280'/%3E%3Ctext x='50' y='55' font-family='Arial' font-size='14' fill='white' text-anchor='middle'%3EĐồ%3C/text%3E%3C/svg%3E"
  }
];

interface FlashcardGameProps {
  onBack: () => void;
}

export default function FlashcardGame({ onBack }: FlashcardGameProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Header với nút quay lại */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          ← Quay lại
        </button>
        <h1 className="text-3xl font-bold text-gray-800">📚 Flashcard</h1>
        <div className="w-24"></div> {/* Spacer để cân bằng layout */}
      </div>

      {/* Game Content */}
      <Flashcard 
        cards={SAMPLE_FLASHCARDS} 
        onComplete={onBack}
      />
    </main>
  );
}
