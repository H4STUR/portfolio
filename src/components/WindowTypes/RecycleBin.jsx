import React, { Suspense, useEffect, useState } from 'react';
import Window from '../Window';
import loadTemplate from './templateLoader';

const RecycleBin = ({ id, title, onClose, position, template, icons, openWindow }) => {
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 }); // Set initial size for the Recycle Bin window

  useEffect(() => {
    const loadComponent = async () => {
      try {
        const component = await loadTemplate(template);
        setTemplateComponent(() => component);
      } catch (error) {
        console.error(`Error loading template: ${error.message}`);
      }
    };
    loadComponent();
  }, [template]);

  // Handle resizing the window
  const handleResizeStop = (e, direction, ref, delta, position) => {
    setWindowSize({ width: ref.offsetWidth, height: ref.offsetHeight });
  };

  if (!TemplateComponent) {
    return <div>Loading...</div>;
  }

  return (
    <Window 
      id={id} 
      title={title} 
      onClose={onClose} 
      position={position} 
      size={windowSize} 
      className="window recycle-bin-window" 
      onResizeStop={handleResizeStop} // Pass resize handler to Window component
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TemplateComponent icons={icons} openWindow={openWindow} />
      </Suspense>
    </Window>
  );
};

export default RecycleBin;
