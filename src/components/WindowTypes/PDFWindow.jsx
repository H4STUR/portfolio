import React, { Suspense, useEffect, useState } from 'react';
import Window from '../Window';
import loadTemplate from './templateLoader';

const PDFWindow = ({ id, title, onClose, position, template }) => {
  const [TemplateComponent, setTemplateComponent] = useState(null);

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

  return (
    <Window id={id} title={title} onClose={onClose} position={position}>
      <Suspense fallback={<div>Loading...</div>}>
        <TemplateComponent />
      </Suspense>
    </Window>
  );
};

export default PDFWindow;
