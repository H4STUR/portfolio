import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Taskbar from './Taskbar';
import LoadingScreen from './LoadingScreen';
import '../styles/desktop.css';

// Window types
import FolderWindow from './WindowTypes/FolderWindow';
import PDFWindow from './WindowTypes/PDFWindow';
import FileWindow from './WindowTypes/FileWindow';
import RecycleBin from './WindowTypes/RecycleBin';
import MyComputer from './WindowTypes/MyComputer';

// Images
import backgroundImage from '../assets/images/windows-xp-wallpaper.jpg';

const GRID_SIZE = 80; // Base size of the grid cell
const CELL_MARGIN = 20; // Additional margin between cells
const CELL_SIZE = GRID_SIZE + CELL_MARGIN; // Effective size of each cell including margin
const PADDING = 20; // Padding from the edge of the desktop

const Desktop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [windows, setWindows] = useState([]);
  const [icons, setIcons] = useState([
    { id: 1, type: 'Recycle Bin', title: 'Recycle Bin', initialPosition: { x: PADDING, y: PADDING }, template: '/RecycleBinTemplate' },
    { id: 2, type: 'My Computer', title: 'My Computer', initialPosition: { x: PADDING, y: CELL_SIZE + PADDING }, template: '/MyComputerTemplate' },
    { id: 3, type: 'Folder', title: 'Folder', initialPosition: { x: CELL_SIZE * 2 + PADDING, y: PADDING }, template: '/FolderTemplate' },
    { id: 4, type: 'Folder', title: 'Homework', initialPosition: { x: CELL_SIZE + PADDING, y: PADDING }, template: '/FolderTemplate' },
    { id: 5, type: 'PDF', title: 'CV', initialPosition: { x: CELL_SIZE * 5 + PADDING, y: CELL_SIZE * 2 + PADDING }, template: '/PDFTemplate' },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const openWindow = (type, title, template) => {
    setWindows([...windows, { id: windows.length, type, title, position: { x: 100, y: 100 }, template }]);
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
        <Icon key={icon.id} {...icon} onDoubleClick={() => openWindow(icon.type, icon.title, icon.template)} moveIcon={moveIcon} />
      ))}
      {windows.map(win => {
        switch (win.type) {
          case 'Recycle Bin':
            return <RecycleBin key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          case 'My Computer':
            return <MyComputer key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          case 'Folder':
            return <FolderWindow key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          case 'file':
            return <FileWindow key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          case 'PDF':
            return <PDFWindow key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          // handle other icon types
          default:
            return null;
        }
      })}
      <Taskbar />
    </div>
  );
};

export default Desktop;
