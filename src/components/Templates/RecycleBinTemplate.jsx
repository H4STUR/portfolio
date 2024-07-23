import React from 'react';
import Icon from '../Icon';

const RecycleBinTemplate = ({ icons, openWindow }) => {
  return (
    <div className="folder-content">
      {icons.map(icon => (
        <Icon
          key={icon.id}
          {...icon}
          onDoubleClick={() => openWindow(icon.type, icon.title, icon.template, icon.icons)}
          moveIcon={() => {}}
          draggable={false} // Disable dragging inside folder
        />
      ))}
    </div>
  );
};

export default RecycleBinTemplate;
