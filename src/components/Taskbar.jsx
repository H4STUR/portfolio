// Taskbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import '../styles/taskbar.css';
import StartMenu from './StartMenu';
import Clock from './Clock';
import Icon from './Icon';
import windowsLogo from '../assets/images/generated/xp-logo-ai.png';

const Taskbar = ({ openWindow }) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startMenuRef = useRef(null);
  const startButtonRef = useRef(null);

  const toggleStartMenu = () => {
    setIsStartMenuOpen((prev) => !prev);
  };

  const closeStartMenu = () => {
    setIsStartMenuOpen(false);
  };

  const handleClickOutside = (event) => {
    // Check if the click was outside both the start menu and the button
    if (
      startMenuRef.current &&
      !startMenuRef.current.contains(event.target) &&
      startButtonRef.current &&
      !startButtonRef.current.contains(event.target)
    ) {
      closeStartMenu(); // Close the start menu if click is outside both
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="taskbar">
        <div className="taskbar-start">
          <button className="start-button" onClick={toggleStartMenu} ref={startButtonRef}>
            <img src={windowsLogo} alt="Windows Logo" className="windows-logo-taskbar" />
            <span>start</span>
          </button>
        </div>
        <div className="taskbar-icons">
          <Icon
            type="CMD"
            title="CMD"
            initialPosition={{ x: 0, y: 0 }}
            onClick={() => openWindow('CMD', 'Command Prompt', '/CMDTemplate')}
            draggable={false} // Disable dragging for taskbar icons
          />
          <Icon
            type="File"
            title="Notepad"
            initialPosition={{ x: 0, y: 0 }}
            onClick={() => openWindow('File', 'Untitled - Notepad', '/FileTemplate')}
            draggable={false} // Disable dragging for taskbar icons
          />
        </div>
        <div className="taskbar-clock">
          <Clock />
        </div>
      </div>
      {isStartMenuOpen && <StartMenu onOpenWindow={openWindow} ref={startMenuRef} />}
    </div>
  );
};

export default Taskbar;
