import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Window from './Window';
import Taskbar from './Taskbar';
import LoadingScreen from './LoadingScreen';
import '../styles/desktop.css';
import backgroundImage from '../assets/images/windows-xp-wallpaper.jpg';
import windowsLogo from '../assets/images/windows-logo.png'; // Replace with the actual Windows logo path

const GRID_SIZE = 80; // Base size of the grid cell
const CELL_MARGIN = 20; // Additional margin between cells
const CELL_SIZE = GRID_SIZE + CELL_MARGIN; // Effective size of each cell including margin
const PADDING = 20; // Padding from the edge of the desktop

const Desktop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [windows, setWindows] = useState([]);
  const [icons, setIcons] = useState([
    { id: 1, type: 'Recycle Bin', title: 'Recycle Bin', initialPosition:{ x: PADDING, y: PADDING } } ,
    { id: 2, type: 'My Computer', title: 'My Computer', initialPosition: { x: PADDING, y: CELL_SIZE + PADDING } },
    { id: 3, type: 'Folder', title: 'Folder', initialPosition: { x: CELL_SIZE * 2 + PADDING, y: PADDING } },
    { id: 4, type: 'Folder', title: 'Homework', initialPosition: { x: CELL_SIZE + PADDING, y: PADDING } },
    { id: 4, type: 'PDF', title: 'CV', initialPosition: { x: CELL_SIZE * 5 + PADDING, y: CELL_SIZE * 2 + PADDING } },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    /*
    2000 for app
    2 for dev
    */

    return () => clearTimeout(timer);
  }, []);

  const openWindow = (title) => {
    setWindows([...windows, { id: windows.length, title, position: { x: 100, y: 100 } }]);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter(window => window.id !== id));
  };

  const moveIcon = (id, offset) => {
    setIcons((prevIcons) =>
      prevIcons.map((icon) =>
        icon.id === id ? { ...icon, initialPosition: { x: offset.x, y: offset.y } } : icon
      )
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="desktop" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      {icons.map(icon => (
        <Icon key={icon.id} {...icon} onDoubleClick={() => openWindow(icon.title)} moveIcon={moveIcon} />
      ))}
      {windows.map(win => (
        <Window key={win.id} id={win.id} title={win.title} onClose={closeWindow} position={win.position} />
      ))}
      <Taskbar />
    </div>
  );
};

export default Desktop;
