import React, { Suspense, useEffect, useState } from 'react';
import Window from '../Window';
import loadTemplate from './templateLoader';

const FileWindow = ({ id, title, onClose, position, template }) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const component = await loadTemplate(template);
        setContent(() => component);
      } catch (error) {
        console.error(`Error loading template: ${error.message}`);
      }
    };
    loadComponent();
  }, [template]);

  return (
    <Window id={id} title={title} onClose={onClose} position={position} className="notepad-window">
      <Suspense fallback={<div>Loading...</div>}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
      </Suspense>
    </Window>
  );
};

export default FileWindow;
