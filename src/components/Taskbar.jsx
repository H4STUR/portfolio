import React, { useState } from 'react';
import '../styles/taskbar.css';
import StartMenu from './StartMenu';
import Clock from './Clock';
import Icon from './Icon';
import windowsLogo from '../assets/images/windows-logo.png';

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
            type="CMD"
            title="CMD"
            initialPosition={{ x: 0, y: 0 }}
            onClick={() => openWindow('CMD', 'Command Prompt', '/CMDTemplate', openWindow={openWindow})}
            draggable={false} // Disable dragging for taskbar icons
          />
          <Icon
            type="File"
            title="CMD"
            initialPosition={{ x: 0, y: 0 }}
            onClick={() => openWindow('File', 'Untitled - Notepad', '/FileTemplate')}
            draggable={false} // Disable dragging for taskbar icons
          />
        </div>
        <div className="taskbar-clock">
          <Clock />
        </div>
      </div>
      {isStartMenuOpen && <StartMenu onOpenWindow={openWindow}/>}
    </div>
  );
};

export default Taskbar;
