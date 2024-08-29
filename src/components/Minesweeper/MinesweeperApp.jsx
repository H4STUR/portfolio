// MinesweeperApp.jsx
import React, { useState } from 'react';
import Window from '../Window';
import '../../styles/minesweeper.css';
import { createBoard, placeMines } from './CreateBoard'; // Import createBoard and placeMines


//assets
import bomb from '../../assets/images/Minesweeper/bomb.png';
import flag from '../../assets/images/Minesweeper/flag.png';
import pepehappy from '../../assets/images/Minesweeper/pepe-happy.png';
import pepesad from '../../assets/images/Minesweeper/pepe-sad.png';

const MinesweeperApp = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 600, height: 400 });

  // Initialize the board with cells and place mines (e.g., 10 mines on a 10x10 board)
  const initialBoard = placeMines(createBoard(10, 10), 10);
  const [cells, setCells] = useState(initialBoard);

  // Function to handle cell left click (revealing the cell)
  const handleCellClick = (row, col) => {
    // If the cell is flagged, don't reveal it
    if (cells[row][col].isFlagged) return;

    const newCells = cells.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, isRevealed: !cell.isRevealed }; // Toggle reveal state for the clicked cell
        }
        return cell;
      })
    );
    setCells(newCells);
  };

  // Function to handle cell right click (flagging the cell)
  const handleCellRightClick = (event, row, col) => {
    event.preventDefault(); // Prevent the context menu from opening

    const newCells = cells.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === row && colIndex === col) {
          return { ...cell, isFlagged: !cell.isFlagged }; // Toggle flagged state for the clicked cell
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
          <div className="minesweeper-header-item"></div>
          <div className="minesweeper-header-item"><img src={pepehappy} alt="Bomb" className="reset-button" /></div>
          <div className="minesweeper-header-item"></div>
      </div>
      <div className="minesweeper-grid">
          {cells.map((row, rowIndex) => (
            <div key={rowIndex} className="minesweeper-row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`minesweeper-cell ${cell.isRevealed ? 'revealed' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onContextMenu={(event) => handleCellRightClick(event, rowIndex, colIndex)} // Right-click handler
                >
                  {cell.isRevealed
                    ? cell.isMine
                      ? <img src={bomb} alt="Bomb" className="cell-icon bomb" /> // Update the path to your bomb image
                      : (cell.neighbors === 0 ? '' : cell.neighbors)
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
