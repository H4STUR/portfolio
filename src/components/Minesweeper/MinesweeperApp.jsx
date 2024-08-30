// MinesweeperApp.jsx
import React, { useState, useEffect } from 'react';
import Window from '../Window';
import Game from './Game';
import Scoreboard from './Scoreboard';
import Help from './Help'; // Import the Help component
import '../../styles/minesweeper.css';
import axios from 'axios'; // Import axios for API requests

const difficultyLevels = {
  Easy: { rows: 8, cols: 8, mines: 10 },
  Medium: { rows: 16, cols: 16, mines: 40 },
  Hard: { rows: 16, cols: 30, mines: 99 },
};

const MinesweeperApp = ({ id, title, onClose, position }) => {
  const CELL_SIZE = 25;
  const [difficulty, setDifficulty] = useState('Easy');
  const [view, setView] = useState('game'); // 'game', 'scoreboard', or 'help'

  // State for game size, nickname input overlay, and score submission
  const [gameSize, setGameSize] = useState({
    width: difficultyLevels[difficulty].cols * CELL_SIZE + 20,
    height: difficultyLevels[difficulty].rows * CELL_SIZE + 160,
  });
  const scoreboardSize = { width: 600, height: 400 };
  const helpSize = { width: 600, height: 400 };

  const [showOverlay, setShowOverlay] = useState(false); // State for showing the overlay
  const [nickname, setNickname] = useState(''); // State for nickname input
  const [winTime, setWinTime] = useState(0); // State to store the time when the game is won

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

  const handleWin = (time) => {
    console.log("Win event received, showing overlay..."); // Debugging log
    setWinTime(time); // Store the time when the game is won
    setShowOverlay(true); // Show the overlay on win
  };

  const submitScore = async () => {
    try {
      await axios.post('http://localhost:8005/api/scores', {
        player_name: nickname,
        score: 0, // Example score value, you can update this with actual game logic
        difficulty: difficulty,
        time: winTime, // Use the actual time from the game
      });
      setShowOverlay(false); // Hide the overlay after submitting
      setView('scoreboard'); // Switch to the scoreboard view
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const cancelOverlay = () => {
    setShowOverlay(false);
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
      }
    className={`minesweeper-window difficulty-${difficulty}`}
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
          onWin={handleWin} // Pass the handleWin function to the Game component
        />
      )}
      {view === 'scoreboard' && <Scoreboard />}
      {view === 'help' && <Help />}

      {showOverlay && (
        <div className="overlay">
          <div className="overlay-content">
            <h2>Congratulations! You won!</h2>
            <label>
              Enter your nickname:
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </label>
            <button onClick={submitScore}>OK</button>
            <button onClick={cancelOverlay}>Cancel</button> {/* New Cancel button */}

          </div>
        </div>
      )}
    </Window>
  );
};

export default MinesweeperApp;
