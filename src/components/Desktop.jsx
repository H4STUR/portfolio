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
import CMDWindow from './CMD/CMDWindow';
import PasswordPrompt from './WindowTypes/PasswordPrompt';
import Paint from './Paint/PaintApp';
import Minesweeper from './Minesweeper/MinesweeperApp';
import DSJ from './DSJ/DeluxeSkiJumpApp';
import Email from './Email/EmailApp';

// Images
import backgroundImage from '../assets/images/windows-xp-wallpaper.jpg';

// Import the folder structure JSON directly
import folderStructure from './folderStructure.json';

const Desktop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [windows, setWindows] = useState([]);
  const [desktopIcons, setDesktopIcons] = useState([]);

  useEffect(() => {
    try {
      // Fetch desktop items from the imported JSON data
      const desktopItems = folderStructure.C.Users.Danio.Desktop;
      const parsedIcons = parseFolderStructure(desktopItems);
      setDesktopIcons(parsedIcons);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading folder structure:', error);
      setIsLoading(false);
    }
  }, []);

  // Recursive function to parse the folder structure and create icons
  const parseFolderStructure = (items) => {
    let icons = [];

    // Iterate through each key in the items object
    Object.entries(items).forEach(([key, value]) => {
      if (value.type) {
        // If the object has a 'type', it's an icon; add it to the icons array
        icons.push({
          id: value.id || Math.random(), // Use id if available, otherwise generate a random one
          type: value.type,
          title: value.title || key,
          initialPosition: value.initialPosition || { x: 0, y: 0 },
          template: value.template || '',
          icons: value.icons ? parseFolderStructure(value.icons) : [] // Recursively parse nested icons
        });
      }
    });

    return icons;
  };

  const openWindow = (type, title, template, icons = []) => {
    setWindows([...windows, { id: windows.length, type, title, position: { x: 100, y: 100 }, template, icons }]);
  };

  const closeWindow = (id) => {
    setWindows(windows.filter((window) => window.id !== id));
  };

  const moveIcon = (id, offset) => {
    setDesktopIcons((prevIcons) =>
      prevIcons.map((icon) =>
        icon.id === id ? { ...icon, initialPosition: { x: offset.x, y: offset.y } } : icon
      )
    );
  };

  const handlePasswordSubmit = (password, win) => {
    if (password === 'jp2gmd') {
      closeWindow(win.id);
      setTimeout(() => {
        openWindow('Folder', win.title, win.template, win.icons);
      }, 100);
    } else {
      alert('Incorrect password!');
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="desktop" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      {desktopIcons.map((icon) => (
        icon.type === 'Link'
          ? <Icon key={icon.id} {...icon} onDoubleClick={() => window.open(icon.template, '_blank', 'noopener,noreferrer')} moveIcon={moveIcon} />
          : <Icon key={icon.id} {...icon} onDoubleClick={() => openWindow(icon.type, icon.title, icon.template, icon.icons)} moveIcon={moveIcon} />
      ))}
      {windows.map((win) => {
        switch (win.type) {
          case 'Recycle Bin':
            return <RecycleBin key={win.id} {...win} onClose={closeWindow} />;
          case 'My Computer':
            return <MyComputer key={win.id} {...win} onClose={closeWindow} />;
          case 'Folder':
            return <FolderWindow key={win.id} {...win} onClose={closeWindow} icons={win.icons} openWindow={openWindow} />;
          case 'FolderLocked':
            return <PasswordPrompt key={win.id} {...win} onClose={closeWindow} onSubmit={(password) => handlePasswordSubmit(password, win)} />;
          case 'CMD':
            return <CMDWindow key={win.id} {...win} onClose={closeWindow} openWindow={openWindow}/>;
          case 'File':
            return <FileWindow key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          case 'PDF':
            return <PDFWindow key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          case 'Paint':
            return <Paint key={win.id} {...win} onClose={closeWindow} />;
          case 'Minesweeper':
            return <Minesweeper key={win.id} {...win} onClose={closeWindow} />;
          case 'DSJ':
            return <DSJ key={win.id} {...win} onClose={closeWindow} />;
          case 'Email':
            return <Email key={win.id} {...win} onClose={closeWindow} />;
          default:
            return null;
        }
      })}
      <Taskbar openWindow={openWindow} />
    </div>
  );
};

export default Desktop;
