import React, { Suspense, useEffect, useState } from 'react';
import Window from '../Window';
import loadTemplate from './templateLoader';

const MyComputer = ({ id, title, onClose, position, template, icons, openWindow, initialSize = { width: 600, height: 400 } }) => {
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

  const adjustWindowSize = (newSize) => {
    setSize(newSize);
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
      size={size}
      className="window my-computer-window"
    >
      <Suspense fallback={<div>Loading...</div>}>
        <TemplateComponent icons={icons} openWindow={openWindow} />
      </Suspense>
    </Window>
  );
};

export default MyComputer;
