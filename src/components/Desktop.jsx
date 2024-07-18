import React, { useState } from 'react';
import Icon from './Icon';
import Window from './Window';
import '../styles/desktop.css';
import backgroundImage from '../assets/images/windows-xp-wallpaper.jpg';

const GRID_SIZE = 80;
const PADDING = 20; // The same padding value as in CSS

const Desktop = () => {
  const [windows, setWindows] = useState([]);
  const [icons, setIcons] = useState([
    { id: 1, title: 'My Computer', initialPosition: { x: PADDING, y: PADDING } },
    { id: 2, title: 'Recycle Bin', initialPosition: { x: GRID_SIZE + PADDING, y: PADDING } },
    { id: 3, title: 'Folder', initialPosition: { x: GRID_SIZE * 2 + PADDING, y: PADDING } },
  ]);

  const openWindow = (title) => {
    setWindows([...windows, { id: windows.length, title, position: { x: 100, y: 100 } }]);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(window => window.id !== id));
  };

  return (
    <div
      className="desktop"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      {icons.map(icon => (
        <Icon
          key={icon.id}
          title={icon.title}
          initialPosition={icon.initialPosition}
          onDoubleClick={() => openWindow(icon.title)}
        />
      ))}
      {windows.map(win => (
        <Window
          key={win.id}
          id={win.id}
          title={win.title}
          onClose={closeWindow}
          position={win.position}
        />
      ))}
    </div>
  );
};

export default Desktop;
