import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/minesweeper.css';
import { createBoard, placeMines, revealCells } from './CreateBoard';

// Assets
import bomb from '../../assets/images/Minesweeper/bomb.png';
import flag from '../../assets/images/Minesweeper/flag.png';
import pepeflag from '../../assets/images/Minesweeper/pepe-uk.png';
import pepeclown from '../../assets/images/Minesweeper/pepoclown.png';
import pepehappy from '../../assets/images/Minesweeper/pepe-happy.png';
import pepeclap from '../../assets/images/Minesweeper/pepe-clap.gif';
import pepesad from '../../assets/images/Minesweeper/pepe-sad.png';

const difficultyLevels = {
  Easy: { rows: 8, cols: 8, mines: 10 },
  Medium: { rows: 16, cols: 16, mines: 40 },
  Hard: { rows: 16, cols: 30, mines: 99 },
};

const MinesweeperApp = ({ id, title, onClose, position }) => {
  const CELL_SIZE = 25;
  const [difficulty, setDifficulty] = useState('Easy');
  const { rows, cols, mines: mineCount } = difficultyLevels[difficulty];

  // Game state variables
  const [size, setSize] = useState({ width: cols * CELL_SIZE + 20, height: rows * CELL_SIZE + 160 });
  const [cells, setCells] = useState(createBoard(rows, cols));
  const [flagsLeft, setFlagsLeft] = useState(mineCount);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const timerRef = useRef(null);

  // Start the timer when the game starts
  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [gameStarted, gameOver, gameWon]);

  // Reset game
  const resetGame = () => {
    setCells(createBoard(rows, cols));
    setFlagsLeft(mineCount);
    setTimer(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(false);
    clearInterval(timerRef.current);
  };

  // Function to handle cell left click (revealing the cell)
  const handleCellClick = (row, col) => {
    if (gameOver || cells[row][col].isFlagged) return;

    if (!gameStarted) {
      setGameStarted(true);
      // Place mines after the first click, ensuring the first click is safe
      const newBoard = placeMines(createBoard(rows, cols), mineCount, row, col);
      const updatedCells = revealCells(newBoard, row, col);
      setCells(updatedCells);
    } else {
      const newCells = revealCells(cells, row, col);
      setCells(newCells);

      if (newCells[row][col].isMine) {
        setGameOver(true);
        clearInterval(timerRef.current);
      } else if (checkWin(newCells)) {
        handleWin(newCells);
        setGameWon(true);
        clearInterval(timerRef.current);
      }
    }
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

  // Function to check if the player has won the game
  const checkWin = (board) => {
    for (let row of board) {
      for (let cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  // Function to handle winning the game by flagging all remaining covered cells
  const handleWin = (board) => {
    const newCells = board.map((row) =>
      row.map((cell) => {
        if (!cell.isRevealed && !cell.isFlagged) {
          return { ...cell, isFlagged: true };
        }
        return cell;
      })
    );
    setCells(newCells);
    setFlagsLeft(0); // All flags are now correctly placed
  };

  // Handle difficulty change
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  // Update board size and reset the game when difficulty changes
  useEffect(() => {
    const newSize = { width: cols * CELL_SIZE + 20, height: rows * CELL_SIZE + 160 };
    setSize(newSize);
    resetGame();
  }, [difficulty]);

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size} // Ensure this size state is passed correctly
      className="minesweeper-window"
    >
      {/* New Game Header */}
      <div className="minesweeper-difficulty-header">
        <span>New Game:</span>
        <select value={difficulty} onChange={handleDifficultyChange}>
          {Object.keys(difficultyLevels).map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Main Game Header */}
      <div className="minesweeper-header">
        <div className="minesweeper-header-item">{flagsLeft}</div>
        <div className="reset-btn" onClick={resetGame}>
          <img src={gameOver ? pepesad : gameWon ? pepeclap : pepehappy} alt="Reset" className="reset-button" />
        </div>
        <div className="minesweeper-header-item">{timer}s</div>
      </div>

      {/* Game Grid */}
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
                    ? <img src={pepeclown} alt="Bomb" className="cell-icon bomb" />
                    : cell.neighbors === 0
                    ? ''
                    : cell.neighbors
                  : cell.isFlagged
                  ? <img src={pepeflag} alt="Flag" className="cell-icon" />
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
