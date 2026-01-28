import React from 'react';
import Icon from '../Icon';

const FolderTemplate = ({ icons, openWindow }) => {
  console.log('[FolderTemplate] icons received:', icons);
  return (
    <div className="folder-content">
      {icons.map(icon => (

        <Icon
          key={icon.id}
          {...icon}
          onDoubleClick={() => {
            console.log('[FolderTemplate] opening:', icon.title, 'initialSize:', icon.initialSize);
            return icon.type === 'Link' ? window.open(icon.template, '_blank', 'noopener,noreferrer') : openWindow(icon.type, icon.title, icon.template, icon.icons, icon.initialPosition, icon.initialSize);
          }}
          moveIcon={() => {}}
          draggable={false} 
        />
      ))}
    </div>
  );
};

export default FolderTemplate;
