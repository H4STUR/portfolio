import React, { useState } from 'react';
import Window from '../Window';
import '../../styles/imagewindow.css';

const ImageWindow = ({ id, title, onClose, position, template, initialSize = { width: 500, height: 540 } }) => {
  const [size, setSize] = useState(initialSize);


  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size}
      setSize={setSize}
      className="notepad-window"
    >
      <div className="image-window-content">
        <img src={template} alt={title} className="image-view" />
      </div>
    </Window>
  );
};

export default ImageWindow;