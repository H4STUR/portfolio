import React, { useEffect, useState } from 'react';
import Window from '../Window';
import loadTemplate from './templateLoader';

const FileWindow = ({ id, title, onClose, position, template, initialSize = { width: 600, height: 400 } }) => {
  const [content, setContent] = useState('');
  const [size, setSize] = useState(initialSize); // State for window size

  useEffect(() => {
    const loadContent = async () => {
      try {
        const loadedContent = await loadTemplate(template); // Assuming this fetches text or similar content
        setContent(loadedContent);
      } catch (error) {
        console.error(`Error loading template: ${error.message}`);
      }
    };
    loadContent();
  }, [template]);

  // Function to adjust window size if needed
  const adjustWindowSize = (newSize) => {
    setSize(newSize);
  };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size}
      className="notepad-window"
    >
      <div className="window-content">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="file-content-area"
          style={{ width: '100%', height: '100%', resize: 'none' }} // Full size and no manual resize to fit window
        />
      </div>
    </Window>
  );
};

export default FileWindow;
