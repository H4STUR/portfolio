import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/minesweeper.css';
import { createBoard, placeMines } from './CreateBoard';

// Assets
import bomb from '../../assets/images/Minesweeper/bomb.png';
import flag from '../../assets/images/Minesweeper/flag.png';
import pepehappy from '../../assets/images/Minesweeper/pepe-happy.png';
import pepesad from '../../assets/images/Minesweeper/pepe-sad.png';

const MinesweeperApp = ({ id, title, onClose, position }) => {
  const CELL_SIZE = 20;
  const rows = 10;
  const cols = 10;
  const mineCount = 10;

  // Game state variables
  const [size, setSize] = useState({ width: (cols * CELL_SIZE + cols * 2), height: (rows * CELL_SIZE + rows * 2 + 120) });
  const [cells, setCells] = useState(placeMines(createBoard(rows, cols), mineCount));
  const [flagsLeft, setFlagsLeft] = useState(mineCount);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const timerRef = useRef(null);

  // Start the timer when the game starts
  useEffect(() => {
    if (gameStarted && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameOver]);

  // Reset game
  const resetGame = () => {
    setCells(placeMines(createBoard(rows, cols), mineCount));
    setFlagsLeft(mineCount);
    setTimer(0);
    setGameOver(false);
    setGameStarted(false);
    clearInterval(timerRef.current);
  };

  // Function to handle cell left click (revealing the cell)
  const handleCellClick = (row, col) => {
    if (gameOver || cells[row][col].isFlagged) return;

    if (!gameStarted) setGameStarted(true);

    const newCells = cells.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (cell.isMine) {
            setGameOver(true);
            clearInterval(timerRef.current);
          }
          return { ...cell, isRevealed: true }; // Reveal the clicked cell
        }
        return cell;
      })
    );
    setCells(newCells);
  };

  // Function to handle cell right click (flagging the cell)
  const handleCellRightClick = (event, row, col) => {
    event.preventDefault();
    if (gameOver || cells[row][col].isRevealed) return;

    const newCells = cells.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          if (cell.isFlagged) {
            setFlagsLeft((prev) => prev + 1);
          } else {
            setFlagsLeft((prev) => prev - 1);
          }
          return { ...cell, isFlagged: !cell.isFlagged };
        }
        return cell;
      })
    );
    setCells(newCells);
  };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size}
      className="minesweeper-window"
    >
      <div className="minesweeper-header">
        <div className="minesweeper-header-item">Bombs: {flagsLeft}</div>
        <div className="minesweeper-header-item reset-btn" onClick={resetGame}>
          <img src={gameOver ? pepesad : pepehappy} alt="Reset" className="reset-button" />
        </div>
        <div className="minesweeper-header-item">Time: {timer}s</div>
      </div>
      <div className="minesweeper-grid">
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="minesweeper-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={`minesweeper-cell ${cell.isRevealed ? 'revealed' : ''}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onContextMenu={(event) => handleCellRightClick(event, rowIndex, colIndex)}
              >
                {cell.isRevealed
                  ? cell.isMine
                    ? <img src={bomb} alt="Bomb" className="cell-icon bomb" />
                    : cell.neighbors === 0
                    ? ''
                    : cell.neighbors
                  : cell.isFlagged
                  ? <img src={flag} alt="Flag" className="cell-icon" />
                  : ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Window>
  );
};

export default MinesweeperApp;
