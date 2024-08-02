import React from 'react';
import Icon from '../Icon';

const FolderTemplate = ({ icons, openWindow }) => {
  return (
    <div className="folder-content">
      {icons.map(icon => (
        
        <Icon
          key={icon.id}
          {...icon}
          onDoubleClick={() => icon.type === 'Link' ? window.open(icon.template, '_blank', 'noopener,noreferrer') : openWindow(icon.type, icon.title, icon.template, icon.icons)}
          moveIcon={() => {}}
          draggable={false} 
        />
      ))}
    </div>
  );
};

export default FolderTemplate;
