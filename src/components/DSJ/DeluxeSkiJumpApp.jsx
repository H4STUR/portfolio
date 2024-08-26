import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/window.css';
// import '../../styles/minesweeper.css';


const DSJ = ({ id, title, onClose, position }) => {

  const [size, setSize] = useState({ width: 600, height: 400 });


  return (
    <Window id={id} title={title} onClose={onClose} position={position} size={size} className="dsj-window">
      <h1>DSJ Cumming soon</h1>
    </Window>
  );
};

export default DSJ;
