// SnakeApp.jsx
import React, { useState } from 'react';
import Window from '../Window';
import Game from './Game';
import Scoreboard from './Scoreboard';
import '../../styles/snake.css';

const SnakeApp = ({ id, title, onClose, position }) => {
  const [view, setView] = useState('game'); // 'game' or 'scoreboard'

  const gameSize = { width: 432, height: 558 };
  const scoreboardSize = { width: 600, height: 400 };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={view === 'game' ? gameSize : scoreboardSize}
      className="window snake-window"
    >
      <div className="snake-menu-header">
        {view === 'game' ? (
          <button onClick={() => setView('scoreboard')}>Scoreboard</button>
        ) : (
          <button onClick={() => setView('game')}>Back to Game</button>
        )}
      </div>

      {view === 'game' && <Game />}
      {view === 'scoreboard' && <Scoreboard />}
    </Window>
  );
};

export default SnakeApp;
