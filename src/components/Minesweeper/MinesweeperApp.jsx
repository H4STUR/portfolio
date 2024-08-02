import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/minesweeper.css';


const MinesweeperApp = ({ id, title, onClose, position }) => {

  return (
    <Window id={id} title={title} onClose={onClose} position={position} className="minesweeper-window">
      <h1>Cumming soon</h1>
    </Window>
  );
};

export default MinesweeperApp;
