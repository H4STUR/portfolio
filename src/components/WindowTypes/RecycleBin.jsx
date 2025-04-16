import React, { Suspense, useEffect, useState } from 'react';
import Window from '../Window';
import loadTemplate from './templateLoader';

const RecycleBin = ({ id, title, onClose, position, template, icons, openWindow, initialSize = { width: 650, height: 450 } }) => {
  const [TemplateComponent, setTemplateComponent] = useState(null);
  const [size, setSize] = useState(initialSize); // State for window size

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

  if (!TemplateComponent) {
    return <div>Loading...</div>;
  }

  // Function to adjust window size based on the content
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
      className="window" // Add any additional classes if needed
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TemplateComponent
          icons={icons}
          openWindow={openWindow}
          adjustWindowSize={adjustWindowSize} // Pass function to adjust window size
        />
      </Suspense>
    </Window>
  );
};

export default RecycleBin;