import React, { useState } from 'react';
import '../styles/taskbar.css';
import StartMenu from './StartMenu';
import Clock from './Clock';
import Icon from './Icon';
import windowsLogo from '../assets/images/windows-logo.png'; // Replace with the actual Windows logo path
import CMD_icon from '../assets/images/CMD-icon.png'; // Replace with the actual CMD icon path

const Taskbar = ({ openWindow }) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const toggleStartMenu = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  return (
    <div>
      <div className="taskbar">
        <div className="taskbar-start">
          <button className="start-button" onClick={toggleStartMenu}>
            <img src={windowsLogo} alt="Windows Logo" className="windows-logo-taskbar" />
            <span>start</span>
          </button>
        </div>
        <div className="taskbar-icons">
          <Icon
            type="File"
            title="CMD"
            initialPosition={{ x: 0, y: 0 }}
            onClick={() => openWindow('File', 'Command Prompt', '/FileTemplate')}
            draggable={false} // Disable dragging for taskbar icons
          />
        </div>
        <div className="taskbar-clock">
          <Clock />
        </div>
      </div>
      {isStartMenuOpen && <StartMenu />}
    </div>
  );
};

export default Taskbar;
