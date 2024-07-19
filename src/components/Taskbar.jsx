import React, { useState } from 'react';
import '../styles/taskbar.css';
import StartMenu from './StartMenu';
import Clock from './Clock';
import windowsLogo from '../assets/images/windows-logo.png'; // Replace with the actual Windows logo path
import CMD_icon from '../assets/images/CMD-icon.png'; // Replace with the actual Windows logo path


const Taskbar = () => {
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
          {/* Add taskbar icons here */}
          <img src={CMD_icon} alt="Profile" className="taskbar-icon" />
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
