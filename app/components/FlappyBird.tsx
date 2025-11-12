"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 0.1;
const JUMP_FORCE = -4;
const PIPE_SPEED = 2.5;

export default function FlappyBird() {
  const [bird, setBird] = useState({ y: GAME_HEIGHT / 2, velocity: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const pipeSpawnRef = useRef<number | null>(null);

  // Load high score từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('flappybird-highscore');
    if (saved) {
      setHighScore(parseInt(saved));
    }
  }, []);

  // Spawn pipes
  const spawnPipe = useCallback(() => {
    const gapY = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
    setPipes(prev => [...prev, {
      x: GAME_WIDTH,
      gapY,
      passed: false
    }]);
  }, []);

  // Jump function
  const jump = useCallback(() => {
    if (gameOver) {
      // Restart game
      setBird({ y: GAME_HEIGHT / 2, velocity: 0 });
      setPipes([]);
      setScore(0);
      setGameOver(false);
      setGameStarted(true);
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
      spawnPipe();
    }

    setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
  }, [gameStarted, gameOver, spawnPipe]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = () => {
      // Update bird
      setBird(prev => ({
        y: Math.max(0, Math.min(GAME_HEIGHT - BIRD_SIZE, prev.y + prev.velocity)),
        velocity: prev.velocity + GRAVITY
      }));

      // Update pipes
      setPipes(prev => {
        const newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
          .filter(pipe => pipe.x > -PIPE_WIDTH);

        // Check score
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < GAME_WIDTH / 2 - BIRD_SIZE / 2) {
            pipe.passed = true;
            setScore(s => s + 1);
          }
        });

        return newPipes;
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameStarted, gameOver]);

  // Spawn pipes periodically
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const spawnInterval = setInterval(() => {
      spawnPipe();
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, [gameStarted, gameOver, spawnPipe]);

  // Collision detection
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const birdX = GAME_WIDTH / 2 - BIRD_SIZE / 2;
    const birdY = bird.y;

    // Ground/ceiling collision
    if (birdY <= 0 || birdY >= GAME_HEIGHT - BIRD_SIZE) {
      setGameOver(true);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('flappybird-highscore', score.toString());
      }
      return;
    }

    // Pipe collision
    for (const pipe of pipes) {
      if (
        birdX < pipe.x + PIPE_WIDTH &&
        birdX + BIRD_SIZE > pipe.x &&
        (birdY < pipe.gapY || birdY + BIRD_SIZE > pipe.gapY + PIPE_GAP)
      ) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem('flappybird-highscore', score.toString());
        }
        return;
      }
    }
  }, [bird, pipes, gameStarted, gameOver, score, highScore]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Game Container */}
      <div 
        className="relative border-4 border-blue-500 rounded-lg overflow-hidden cursor-pointer"
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        onClick={jump}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-green-200">
          {/* Clouds */}
          <div className="absolute top-10 left-10 text-white text-2xl opacity-70">☁️</div>
          <div className="absolute top-20 right-20 text-white text-xl opacity-60">☁️</div>
          <div className="absolute top-32 left-32 text-white text-lg opacity-50">☁️</div>
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-600 border-2 border-green-800"
              style={{
                left: pipe.x,
                top: 0,
                width: PIPE_WIDTH,
                height: pipe.gapY,
              }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-600 border-2 border-green-800"
              style={{
                left: pipe.x,
                top: pipe.gapY + PIPE_GAP,
                width: PIPE_WIDTH,
                height: GAME_HEIGHT - pipe.gapY - PIPE_GAP,
              }}
            />
          </div>
        ))}

        {/* Bird */}
        <div
          className="absolute transition-transform duration-100"
          style={{
            left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
            top: bird.y,
            width: BIRD_SIZE,
            height: BIRD_SIZE,
            transform: `rotate(${Math.max(-30, Math.min(90, bird.velocity * 3))}deg)`,
          }}
        >
          <div className="text-2xl">🐦</div>
        </div>

        {/* Score */}
        <div className="absolute top-4 left-4 text-2xl font-bold text-white drop-shadow-lg">
          {score}
        </div>

        {/* Start Screen */}
        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white">
            <div className="text-4xl mb-4">🐦</div>
            <h2 className="text-2xl font-bold mb-4">Flappy Bird</h2>
            <p className="text-center mb-4">
              Click hoặc nhấn Space để bay
            </p>
            <p className="text-sm opacity-75">
              High Score: {highScore}
            </p>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center text-white">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-3xl font-bold mb-2">Game Over!</h2>
            <div className="text-xl mb-4">Score: {score}</div>
            {score > highScore - score && (
              <div className="text-yellow-400 mb-4">🏆 New High Score!</div>
            )}
            <div className="text-lg mb-6">High Score: {highScore}</div>
            <p className="text-center text-sm">
              Click để chơi lại
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center max-w-md">
        <h3 className="text-lg font-semibold mb-2">Hướng dẫn:</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Click chuột hoặc nhấn Space để chim bay lên</p>
          <p>• Tránh va chạm với ống xanh và mặt đất</p>
          <p>• Bay qua ống để ghi điểm</p>
          <p>• Cố gắng đạt điểm số cao nhất!</p>
        </div>
      </div>
    </div>
  );
}
