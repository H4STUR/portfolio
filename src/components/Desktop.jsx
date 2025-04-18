import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Taskbar from './Taskbar';
import LoadingScreen from './LoadingScreen';
import '../styles/desktop.css';

// Window types
import FolderWindow from './WindowTypes/FolderWindow';
import PDFWindow from './WindowTypes/PDFWindow';
import FileWindow from './WindowTypes/FileWindow';
import ImageWindow from './WindowTypes/ImageWindow';
import RecycleBin from './WindowTypes/RecycleBin';
import MyComputer from './WindowTypes/MyComputer';
import AlertWindow from './WindowTypes/AlertWindow';
import CMDWindow from './CMD/CMDWindow';
import PasswordPrompt from './WindowTypes/PasswordPrompt';
import Paint from './Paint/PaintApp';
import Minesweeper from './Minesweeper/MinesweeperApp';
import DSJ from './DSJ/DeluxeSkiJumpApp';
import Email from './Email/EmailApp';
import BlueScreen from './BlueScreen';


// Images
// import backgroundImage from '../assets/images/windows-xp-wallpaper.jpg';
import backgroundImage from '../assets/images/generated/xp-wallpaper-ai.png';

// Import the folder structure JSON directly
import folderStructure from './folderStructure.json';

const Desktop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [windows, setWindows] = useState([]);
  const [desktopIcons, setDesktopIcons] = useState([]);
  const [isCrashed, setIsCrashed] = useState(false);

  useEffect(() => {
    try {
      // Fetch desktop items from the imported JSON data
      const desktopItems = folderStructure.C.Users.Danio.Desktop;
      const parsedIcons = parseFolderStructure(desktopItems);
      setDesktopIcons(parsedIcons);
  
      // Set a timeout for 3 seconds before setting isLoading to false
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
      }, 3000); // 3000 milliseconds = 3 seconds
  
      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(loadingTimeout);
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
          imageOverride: value.image || null,
          icons: value.icons ? parseFolderStructure(value.icons) : [] // Recursively parse nested icons
        });
      }
    });

    return icons;
  };

  const openWindow = (type, title, template, icons = [], position = { x: 100, y: 100 }) => {
    setWindows((prev) => {
      const alreadyOpen = prev.some(
        (w) => w.type === type && w.title === title
      );
      if (alreadyOpen) {
        console.log(`[openWindow BLOCKED] ${type} - ${title}`);
        return prev;
      }
  
      console.log(`[openWindow ALLOWED] ${type} - ${title}`);
      return [
        ...prev,
        {
          id: prev.length,
          type,
          title,
          // position: icons.position || { x: 100, y: 100 },
          position,
          template,
          icons,
        },
      ];
    });
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
    const desktopItems = folderStructure.C.Users.Danio.Desktop;
    const folderMeta = desktopItems[win.title];
  
    const correctPassword = folderMeta?.password;
  
    if (password === correctPassword) {
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
        <Icon
        key={icon.id}
        {...icon}
        imageOverride={icon.imageOverride}
        onDoubleClick={() =>
          icon.type === 'Link'
            ? window.open(icon.template, '_blank', 'noopener,noreferrer')
            : openWindow(icon.type, icon.title, icon.template, icon.icons)
        }
        moveIcon={moveIcon}
      />
      ))}
      {windows.map((win) => {
        switch (win.type) {
          case 'Recycle Bin':
            return <RecycleBin key={win.id} {...win} onClose={closeWindow} icons={win.icons} openWindow={openWindow} />;
          case 'My Computer':
            return <MyComputer key={win.id} {...win} onClose={closeWindow} icons={win.icons} openWindow={openWindow}/>;
          case 'Folder':
            return <FolderWindow key={win.id} {...win} onClose={closeWindow} icons={win.icons} openWindow={openWindow} />;
          case 'FolderLocked':
            return <PasswordPrompt key={win.id} {...win} onClose={closeWindow} onSubmit={(password) => handlePasswordSubmit(password, win)} />;
          case 'CMD':
            return <CMDWindow key={win.id} {...win} onClose={closeWindow} openWindow={openWindow}/>;
          case 'File':
            return <FileWindow key={win.id} {...win} onClose={closeWindow} template={win.template} />;
          case 'Image':
            return <ImageWindow key={win.id} {...win} onClose={closeWindow} template={win.template} />;
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
          case 'Alert':
            return <AlertWindow key={win.id} {...win} onClose={closeWindow} />;

          case 'Crush':
            const errorCount = 8;

            for (let i = 0; i < errorCount; i++) {
              setTimeout(() => {
                const alertWidth = 350;
                const alertHeight = 200;

                const randomX = Math.floor(Math.random() * (window.innerWidth - alertWidth - 40));
                const randomY = Math.floor(Math.random() * (window.innerHeight - alertHeight - 40));

                openWindow('Alert', `System Error ${i + 1}`, '', [], { x: randomX, y: randomY });
              }, i * 200);
            }

            // Trigger bluescreen after all errors popped
            setTimeout(() => {
              setIsCrashed(true);
            }, errorCount * 200 + 1000);

            return null;

            
          default:
            return null;
        }
      })}

      {isCrashed && <BlueScreen />}
      <Taskbar openWindow={openWindow} />
    </div>
  );
};

export default Desktop;
