import React from 'react';
import '../styles/taskbar.css';

const Taskbar = () => {
  return (
    <div className="taskbar">
      <div className="taskbar-start">
        <button className="start-button">Start</button>
      </div>
      <div className="taskbar-icons">
        {/* Add taskbar icons here */}
      </div>
      <div className="taskbar-clock">
        <span>{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default Taskbar;
