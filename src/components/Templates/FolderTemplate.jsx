import React from 'react';
import Icon from '../Icon';

const FolderTemplate = ({ icons, openWindow }) => {
  const imageIcons = icons.filter(i => i.type === 'Image');

  return (
    <div className="folder-content">
      {icons.map(icon => (
        <Icon
          key={icon.id}
          {...icon}
          onDoubleClick={() => {
            if (icon.type === 'Link') {
              window.open(icon.template, '_blank', 'noopener,noreferrer');
              return;
            }
            const siblings = icon.type === 'Image' ? imageIcons : icon.icons;
            openWindow(icon.type, icon.title, icon.template, siblings, icon.initialPosition, icon.initialSize);
          }}
          moveIcon={() => {}}
          draggable={false}
        />
      ))}
    </div>
  );
};

export default FolderTemplate;
