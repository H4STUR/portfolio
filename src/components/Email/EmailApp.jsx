import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/paint.css';

const EmailApp = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 600, height: 400 });
  
  return (
    <Window id={id} title={title} onClose={onClose} position={position} size={size} className="emial-window">
      <div className="flex flex-col items-center p-4 bg-gray-100">

        
      </div>
    </Window>
  );
};

export default EmailApp;
