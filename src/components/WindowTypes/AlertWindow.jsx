// components/WindowTypes/AlertWindow.jsx
import React, { useEffect } from 'react';
import Window from '../Window';

import errorWav from '../../assets/sounds/error.wav';

import warningIcon from '../../assets/images/generated/xp-error-icon-ai.png'; // use a system icon or any icon you like

const AlertWindow = ({ id, title, onClose, position, template, initialSize = { width: 350, height: 200 } }) => {

    useEffect(() => {
        const errorSound = new Audio(errorWav);
        errorSound.volume = 0.15;
        errorSound.play();
      }, []);
      
    return (
    <Window id={id} title={title} position={position} onClose={onClose} size={initialSize}>
      <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
        <img src={warningIcon} alt="Error" style={{ width: '32px', height: '32px' }} />
        <div>
          <p>This operation has caused a system fault.</p>
          <button onClick={() => onClose(id)}>OK</button>
        </div>
      </div>
    </Window>
  );
};

export default AlertWindow;
