import React, { Suspense, lazy } from 'react';
import Window from '../Window';

const FolderWindow = ({ id, title, onClose, position, template, icons, openWindow }) => {
  const TemplateComponent = lazy(() => import(`../Templates${template}`));

  return (
    <Window id={id} title={title} onClose={onClose} position={position}>
      <Suspense>
        <TemplateComponent icons={icons} openWindow={openWindow} />
      </Suspense>
    </Window>
  );
};

export default FolderWindow;
