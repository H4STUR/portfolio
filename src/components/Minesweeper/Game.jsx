// Game.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createBoard, placeMines, revealCells } from './CreateBoard';
import '../../styles/minesweeper.css';

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
  Hard: { rows: 30, cols: 16, mines: 99 },
};

const Game = ({ difficulty, onDifficultyChange, onResetGame, onWin }) => {  // Ensure onWin is destructured here
  const CELL_SIZE = 25;
  const { rows, cols, mines: mineCount } = difficultyLevels[difficulty];

  // Game state variables
  const [size, setSize] = useState({ width: rows * CELL_SIZE + 20, height: cols * CELL_SIZE + 160 });
  const [cells, setCells] = useState(createBoard(rows, cols));
  const [flagsLeft, setFlagsLeft] = useState(mineCount);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [highlightedCells, setHighlightedCells] = useState([]); // New state for highlighted cells

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
    setHighlightedCells([]); // Clear highlights on reset
    clearInterval(timerRef.current);
    onResetGame(); // Call parent reset function if needed
  };

  // Function to handle cell left click (revealing the cell)
  const handleCellClick = (row, col) => {
    if (gameOver || cells[row][col].isFlagged) return;
  
    if (!gameStarted) {
      setGameStarted(true);
      const newBoard = placeMines(createBoard(rows, cols), mineCount, row, col);
      const updatedCells = revealCells(newBoard, row, col);
      setCells(updatedCells);
    } else {
      if (cells[row][col].isMine) {
        // Reveal all mines and trigger game over
        const newCells = cells.map((r) =>
          r.map((cell) => ({
            ...cell,
            isRevealed: cell.isMine ? true : cell.isRevealed,
          }))
        );
        setCells(newCells);
        setGameOver(true);
        clearInterval(timerRef.current);
        return;
      }
  
      const newCells = revealCells(cells, row, col);
      setCells(newCells);
  
      if (checkWin(newCells)) {
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

  // Function to handle double-click or both button click on a revealed cell
  const handleDoubleClick = (row, col) => {
    const cell = cells[row][col];
  
    // Only proceed if the cell is revealed and is not a mine
    if (!cell.isRevealed || cell.isMine) return;
  
    // Count the number of flagged neighbors
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],         [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
  
    let flaggedNeighbors = 0;
    let neighborCells = [];
  
    directions.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = col + dCol;
  
      if (
        newRow >= 0 &&
        newRow < cells.length &&
        newCol >= 0 &&
        newCol < cells[0].length
      ) {
        neighborCells.push({ row: newRow, col: newCol });
        if (cells[newRow][newCol].isFlagged) {
          flaggedNeighbors++;
        }
      }
    });
  
    // Check if the number of flagged neighbors matches the cell's neighbors count
    if (flaggedNeighbors === cell.neighbors) {
      // Reveal all non-flagged, non-revealed neighbors
      let newCells = cells.map((r, rowIndex) =>
        r.map((cell, colIndex) => ({ ...cell }))
      );
  
      neighborCells.forEach(({ row: newRow, col: newCol }) => {
        const neighborCell = newCells[newRow][newCol];
  
        if (!neighborCell.isFlagged && !neighborCell.isRevealed) {
          // Reveal the cell and check if it's a mine
          if (neighborCell.isMine) {
            // Game over if a mine is revealed
            newCells = newCells.map((r) =>
              r.map((c) => ({ ...c, isRevealed: c.isMine ? true : c.isRevealed }))
            );
            setCells(newCells);
            setGameOver(true);
            clearInterval(timerRef.current);
            return; // Early exit
          }
          newCells = revealCells(newCells, newRow, newCol);
        }
      });
  
      setCells(newCells);
      setHighlightedCells([]); // Clear highlights after revealing
  
      // Check if this action led to a win
      if (checkWin(newCells)) {
        handleWin(newCells);
        setGameWon(true);
        clearInterval(timerRef.current);
      }
    } else {
      // Highlight cells if flags are fewer than the number of neighboring bombs
      setHighlightedCells(neighborCells);
    }
  };

  // Clear highlighted cells when mouse buttons are released
  const handleMouseUp = () => {
    setHighlightedCells([]);
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
    setGameWon(true);
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
    clearInterval(timerRef.current); // Stop the timer
    onWin(timer); // Ensure this is called with the timer value
  };

  // Update board size and reset the game when difficulty changes
  useEffect(() => {
    const newSize = { width: rows * CELL_SIZE + rows * 2, height: cols * CELL_SIZE + cols + 220 };
    setSize(newSize);
    resetGame();
  }, [difficulty]);

  return (
    <div className="game-container" onMouseUp={handleMouseUp}>
      <div className="minesweeper-header">
        <div className="minesweeper-header-item">{flagsLeft}</div>
        <div className="reset-btn" onClick={resetGame}>
          <img src={gameOver ? pepesad : gameWon ? pepeclap : pepehappy} alt="Reset" className="reset-button" />
        </div>
        <div className="minesweeper-header-item">{timer}s</div>
      </div>

      <div className="minesweeper-grid">
        {cells.map((row, rowIndex) => (
          <div key={rowIndex} className="minesweeper-row">
            {row.map((cell, colIndex) => {
              const isHighlighted = highlightedCells.some(
                (highlight) => highlight.row === rowIndex && highlight.col === colIndex
              );
              return (
                <div
                  key={colIndex}
                  className={`minesweeper-cell ${cell.isRevealed ? 'revealed' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(event) => handleCellRightClick(event, rowIndex, colIndex)}
                  onMouseDown={(event) => {
                    // Check if both left and right buttons are pressed
                    if (event.buttons === 3) {
                      handleDoubleClick(rowIndex, colIndex);
                    }
                  }}
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
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Game;
