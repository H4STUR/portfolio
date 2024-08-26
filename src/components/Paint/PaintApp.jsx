import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
// import '../../styles/minesweeper.css';


const PaintApp = ({ id, title, onClose, position }) => {

  const [size, setSize] = useState({ width: 600, height: 400 });


  return (
    <Window id={id} title={title} onClose={onClose} position={position} size={size} className="paint-window">
      <h1>Paint Cumming soon</h1>
    </Window>
  );
};

export default PaintApp;