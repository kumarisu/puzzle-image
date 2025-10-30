"use client";
import { useRef } from "react";

export default function UploadImage({ onImageSelected }: { onImageSelected: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onImageSelected(url);
  };

  return (
    <div className="flex flex-col items-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Chọn ảnh
      </button>
    </div>
  );
}
