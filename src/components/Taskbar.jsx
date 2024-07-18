import React, { useState } from 'react';
import '../styles/taskbar.css';
import StartMenu from './StartMenu';
import Clock from './Clock';

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
            Start
          </button>
        </div>
        <div className="taskbar-icons">
          {/* Add taskbar icons here */}
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
