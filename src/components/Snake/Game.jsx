// Game.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../../styles/snake.css';

import pepeHead from '../../assets/images/Snake/pepe-snake-head.png';
import pepeHeadDead from '../../assets/images/Snake/pepe-snake-head-dead.png';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const TICK_MS = 120;

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const ROTATION = {
  '0,-1': 0,
  '1,0': 90,
  '0,1': 180,
  '-1,0': 270,
};

const initialSnake = () => [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];

const randomFood = (snake) => {
  while (true) {
    const food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((s) => s.x === food.x && s.y === food.y)) {
      return food;
    }
  }
};

const Game = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState(() => randomFood(initialSnake()));
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  const directionRef = useRef(direction);
  const pendingDirRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const resetGame = () => {
    const s = initialSnake();
    setSnake(s);
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    pendingDirRef.current = { x: 1, y: 0 };
    setFood(randomFood(s));
    setGameOver(false);
    setScore(0);
    setStarted(false);
  };

  const handleKeyDown = useCallback((e) => {
    const next = DIRECTIONS[e.key];
    if (!next) return;
    e.preventDefault();
    const current = directionRef.current;
    // Prevent reversing into self
    if (next.x === -current.x && next.y === -current.y) return;
    pendingDirRef.current = next;
    if (!started) setStarted(true);
  }, [started]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!started || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const dir = pendingDirRef.current;
        setDirection(dir);

        const head = prev[0];
        const newHead = { x: head.x + dir.x, y: head.y + dir.y };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const ateFood = newHead.x === food.x && newHead.y === food.y;
        const newSnake = [newHead, ...prev];
        if (!ateFood) {
          newSnake.pop();
        } else {
          setScore((s) => s + 1);
          setFood(randomFood(newSnake));
        }
        return newSnake;
      });
    }, TICK_MS);

    return () => clearInterval(interval);
  }, [started, gameOver, food]);

  const rotation = ROTATION[`${direction.x},${direction.y}`] ?? 90;

  return (
    <div className="snake-game-container">
      <div className="snake-header">
        <div className="snake-header-item">Score: {score}</div>
        <div className="snake-reset-btn" onClick={resetGame}>
          New Game
        </div>
        <div className="snake-header-item">{gameOver ? 'GAME OVER' : started ? 'PLAYING' : 'READY'}</div>
      </div>

      <div
        className="snake-board"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
        tabIndex={0}
      >
        {snake.map((segment, i) => {
          const isHead = i === 0;
          const isTail = i === snake.length - 1;
          const style = {
            left: segment.x * CELL_SIZE,
            top: segment.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          };

          if (isHead) {
            const HEAD_SIZE = CELL_SIZE * 1.8;
            const offset = (HEAD_SIZE - CELL_SIZE) / 2;
            return (
              <img
                key={i}
                src={gameOver ? pepeHeadDead : pepeHead}
                alt="head"
                className="snake-head"
                style={{
                  left: segment.x * CELL_SIZE - offset,
                  top: segment.y * CELL_SIZE - offset,
                  width: HEAD_SIZE,
                  height: HEAD_SIZE,
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            );
          }

          return (
            <div
              key={i}
              className={isTail ? 'snake-tail' : 'snake-body'}
              style={style}
            />
          );
        })}

        <div
          className="snake-food"
          style={{
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE,
            height: CELL_SIZE,
          }}
        />

        {!started && !gameOver && (
          <div className="snake-overlay">Press an arrow key to start</div>
        )}
      </div>
    </div>
  );
};

export default Game;
