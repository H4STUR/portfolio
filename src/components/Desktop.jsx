import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Window from './Window';
import Taskbar from './Taskbar';
import LoadingScreen from './LoadingScreen';
import '../styles/desktop.css';
import backgroundImage from '../assets/images/windows-xp-wallpaper.jpg';
import windowsLogo from '../assets/images/windows-logo.png'; // Replace with the actual Windows logo path

const GRID_SIZE = 80;
const PADDING = 20; // The same padding value as in CSS

const Desktop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [windows, setWindows] = useState([]);
  const [icons, setIcons] = useState([
    { id: 1, type: 'My Computer', title: 'My Computer', initialPosition: { x: PADDING, y: PADDING } },
    { id: 2, type: 'Recycle Bin', title: 'Recycle Bin', initialPosition: { x: GRID_SIZE + PADDING, y: PADDING } },
    { id: 3, type: 'Folder', title: 'Folder', initialPosition: { x: GRID_SIZE * 2 + PADDING, y: PADDING } },
    { id: 4, type: 'Folder', title: 'Homework', initialPosition: { x: PADDING, y: GRID_SIZE * 2 + PADDING } },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const openWindow = (title) => {
    setWindows([...windows, { id: windows.length, title, position: { x: 100, y: 100 } }]);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(window => window.id !== id));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="desktop" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      {icons.map(icon => (
        <Icon key={icon.id} type={icon.type} title={icon.title} initialPosition={icon.initialPosition} onDoubleClick={() => openWindow(icon.title)} />
      ))}
      {windows.map(win => (
        <Window key={win.id} id={win.id} title={win.title} onClose={closeWindow} position={win.position} />
      ))}
      <Taskbar />
    </div>
  );
};

export default Desktop;
