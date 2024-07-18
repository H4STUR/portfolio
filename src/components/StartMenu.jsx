import React from 'react';
import '../styles/startMenu.css';

const StartMenu = () => {

  const handleShutDown = () => {
    window.close();
  };

  return (
    <div className="start-menu">
      <ul>
        <li>Programs</li>
        <li>Documents</li>
        <li>Settings</li>
        <li>Search</li>
        <li>Help</li>
        {/* <li>Run</li> */}
        <li onClick={handleShutDown}>Shut Down</li>
      </ul>
    </div>
  );
};

export default StartMenu;
