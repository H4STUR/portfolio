// MinesweeperApp.jsx
import React, { useState, useEffect } from 'react';
import Window from '../Window';
import Game from './Game';
import Scoreboard from './Scoreboard';
import Help from './Help'; // Import the Help component
import '../../styles/minesweeper.css';

const difficultyLevels = {
  Easy: { rows: 8, cols: 8, mines: 10 },
  Medium: { rows: 16, cols: 16, mines: 40 },
  Hard: { rows: 16, cols: 30, mines: 99 },
};

const MinesweeperApp = ({ id, title, onClose, position }) => {
  const CELL_SIZE = 25;
  const [difficulty, setDifficulty] = useState('Easy');
  const [view, setView] = useState('game'); // 'game', 'scoreboard', or 'help'

  // Separate size states for game, scoreboard, and help
  const [gameSize, setGameSize] = useState({
    width: difficultyLevels[difficulty].cols * CELL_SIZE + 20,
    height: difficultyLevels[difficulty].rows * CELL_SIZE + 160,
  });
  const scoreboardSize = { width: 600, height: 400 }; // Fixed size for the scoreboard
  const helpSize = { width: 600, height: 400 }; // Fixed size for the help view

  // Update game size when difficulty changes
  useEffect(() => {
    if (view === 'game') {
      setGameSize({
        width:
          difficultyLevels[difficulty].cols * CELL_SIZE +
          difficultyLevels[difficulty].cols * 2,
        height:
          difficultyLevels[difficulty].rows * CELL_SIZE +
          difficultyLevels[difficulty].rows +
          210,
      });
    }
  }, [difficulty, view]);

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };

  const resetGame = () => {
    // Reset logic if needed
  };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={
        view === 'game'
          ? gameSize
          : view === 'scoreboard'
          ? scoreboardSize
          : helpSize
      } // Switch size based on view
      className="minesweeper-window"
    >
      <div className="minesweeper-difficulty-header">
        <select value={difficulty} onChange={handleDifficultyChange}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        {view === 'game' ? (
          <>
            <button onClick={() => setView('scoreboard')}>Scoreboard</button>
            <button onClick={() => setView('help')}>Help</button>
          </>
        ) : (
          <button onClick={() => setView('game')}>Back to Game</button>
        )}
      </div>

      {view === 'game' && (
        <Game
          difficulty={difficulty}
          onDifficultyChange={handleDifficultyChange}
          onResetGame={resetGame}
        />
      )}
      {view === 'scoreboard' && <Scoreboard />}
      {view === 'help' && <Help />}
    </Window>
  );
};

export default MinesweeperApp;
