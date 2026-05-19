import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import Taskbar from './Taskbar';
import LoadingScreen from './LoadingScreen';
import { useWindows } from '../hooks/useWindows';
import { useDesktopIcons } from '../hooks/useDesktopIcons';
import '../styles/desktop.css';

import PasswordPrompt from './WindowTypes/PasswordPrompt';
import BlueScreen from './BlueScreen';
import { windowRegistry } from './WindowTypes/registry';


// Images
// import backgroundImage from '../assets/images/generated/xp-wallpaper-ai.png';
import backgroundImage from '../assets/images/generated/pepe_wallpaper169-water-edit.png';

// Import the folder structure JSON directly
import folderStructure from './folderStructure.json';

const Desktop = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCrashed, setIsCrashed] = useState(false);
  const { windows, openWindow: rawOpenWindow, closeWindow, focusWindow } = useWindows();
  const { desktopIcons, isPositionOccupied, moveIcon, error: iconsError } = useDesktopIcons();

  const openWindow = (type, ...args) => {
    if (type === 'Crush') {
      triggerCrash();
      return;
    }
    rawOpenWindow(type, ...args);
  };

  useEffect(() => {
    if (iconsError) {
      setIsLoading(false);
      return;
    }
    const loadingTimeout = setTimeout(() => setIsLoading(false), 3000);
    return () => clearTimeout(loadingTimeout);
  }, [iconsError]);

  const triggerCrash = () => {
    const errorCount = 8;
    const alertWidth = 350;
    const alertHeight = 200;

    for (let i = 0; i < errorCount; i++) {
      setTimeout(() => {
        const randomX = Math.floor(Math.random() * (window.innerWidth - alertWidth - 40));
        const randomY = Math.floor(Math.random() * (window.innerHeight - alertHeight - 40));
        openWindow('Alert', `System Error ${i + 1}`, '', [], { x: randomX, y: randomY });
      }, i * 200);
    }

    setTimeout(() => setIsCrashed(true), errorCount * 200 + 1000);
  };

  const handleIconDoubleClick = (icon) => {
    if (icon.type === 'Link') {
      window.open(icon.template, '_blank', 'noopener,noreferrer');
      return;
    }
    openWindow(icon.type, icon.title, icon.template, icon.icons, icon.initialPosition, icon.initialSize);
  };

  const handleWindowMouseDown = (e) => {
    const winEl = e.target.closest('[data-window-id]');
    if (!winEl) return;
    const id = Number(winEl.dataset.windowId);
    if (!Number.isNaN(id)) focusWindow(id);
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
    <div
      className="desktop"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
      onMouseDownCapture={handleWindowMouseDown}
    >
      {desktopIcons.map((icon) => (
        <Icon
        key={icon.id}
        {...icon}
        imageOverride={icon.imageOverride}
        onDoubleClick={() => handleIconDoubleClick(icon)}
        isPositionOccupied={(x, y) => isPositionOccupied(icon.id, x, y)}
        moveIcon={(x, y) => moveIcon(icon.id, x, y)}
      />
      ))}
      {windows.map((win) => {
        if (win.type === 'FolderLocked') {
          return (
            <PasswordPrompt
              key={win.id}
              {...win}
              onClose={closeWindow}
              onSubmit={(password) => handlePasswordSubmit(password, win)}
            />
          );
        }
        const Component = windowRegistry[win.type];
        if (!Component) return null;
        const isActive = windows[windows.length - 1]?.id === win.id;
        return <Component key={win.id} {...win} onClose={closeWindow} openWindow={openWindow} isActive={isActive} />;
      })}

      {isCrashed && <BlueScreen />}
      <Taskbar openWindow={openWindow} />
    </div>
  );
};

export default Desktop;
