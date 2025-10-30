"use client";
import React from "react";

interface TileProps {
  imageUrl: string;
  index: number;
  position: number;
  rows: number;
  cols: number;
  onDropTile: (from: number, to: number) => void;
}

export default function Tile({
  imageUrl,
  index,
  position,
  rows,
  cols,
  onDropTile,
}: TileProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("tileIndex", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const fromIndex = parseInt(e.dataTransfer.getData("tileIndex"));
    onDropTile(fromIndex, index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const row = position ? Math.floor(position / cols) : 0;
  const col = position ? position % cols : 0;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: `${cols * 100}% ${rows * 100}%`,
        backgroundPosition: `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`,
        border: "1px solid #fff",
        cursor: "grab",
        width: "100%",
        height: "100%",
      }}
    />
  );
}
