import React, { useState } from 'react';
import Window from '../Window';
import '../../styles/imagewindow.css';
import imageMap from '../../utils/imageMap';

const ImageWindow = ({ id, title, onClose, position, template, initialSize = { width: 500, height: 540 } }) => {
  const [size, setSize] = useState(initialSize);

  // Get the actual image based on the template (which is now just a filename)
  const imageSrc = imageMap[template] || null;

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size}
      setSize={setSize}
      className="window notepad-window"
    >
      <div className="image-window-content">
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="image-view" />
        ) : (
          <p className="image-error">Image not found: {template}</p>
        )}
      </div>
    </Window>
  );
};

export default ImageWindow;
