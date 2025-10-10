// StartMenu.jsx
import React, { useState, forwardRef } from 'react';
import folderStructure from './folderStructure.json';

import '../styles/startMenu.css';
import profileImage from '../assets/images/pepenolif.jpg';
import shutdown_btn from '../assets/images/shutdown-button-xp.png';
import restart_btn from '../assets/images/restart-button-xp.png';
import cmdIcon from '../assets/images/Icons/HD/Command Prompt.png';
import myComputerIcon from '../assets/images/Icons/HD/My Computer.png';
import myDocumentsIcon from '../assets/images/Icons/HD/My Documents.png';
import runIcon from '../assets/images/Icons/run.ico';
import minesweeperIcon from '../assets/images/Icons/HD/Minesweeper.png';
import ShutdownModal from './ShutdownModal';

const StartMenu = forwardRef(({ onOpenWindow }, ref) => {
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const [showBlackScreen, setShowBlackScreen] = useState(false);

  const handleShutDown = () => {
    setShowShutdownModal(true);
    setTimeout(() => {
      setShowShutdownModal(false);
      setShowBlackScreen(true);
    }, 3000); // Simulate some delay before showing the black screen
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const parseFolderStructure = (items) => {
    return Object.entries(items).map(([key, value]) => ({
      id: value.id || Math.random(),
      type: value.type,
      title: value.title || key,
      initialPosition: value.initialPosition || { x: 0, y: 0 },
      template: value.template || '',
      imageOverride: value.image || null,
      icons: value.icons ? parseFolderStructure(value.icons) : []
    }));
  };
  
  return (
    <div ref={ref}>
      {!showShutdownModal && !showBlackScreen && (
        <div className="start-menu">
          <div className="start-menu-top">
            <img src={profileImage} alt="Profile" className="start-menu-profile-picture" />
            <p className="profile-name">Root</p>
          </div>
          <div className="start-menu-middle">
            <div className="start-menu-middle-left">
              <ul className="start-menu-elements">
                <li onClick={() => onOpenWindow('Minesweeper', 'Minesweeper', 'MinesweeperApp')}>
                  <img src={minesweeperIcon} alt="Minesweeper" className="start-menu-icon" /> Minesweeper
                </li>
                <li onClick={() => onOpenWindow('CMD', 'Command Prompt', 'CMDTemplate')}>
                  <img src={cmdIcon} alt="CMD" className="start-menu-icon" /> Command Prompt
                </li>
                <li>Settings</li>
                <li>Search</li>
                <li>Help</li>
              </ul>
            </div>
            <div className="start-menu-middle-right">
              <ul className="start-menu-elements">

              <li
                onClick={() => {
                  const myDocs = folderStructure?.C?.Users?.Danio?.['My Documents'];
                  if (myDocs && myDocs.icons) {
                    const parsedIcons = parseFolderStructure(myDocs.icons);
                    onOpenWindow('Folder', 'My Documents', 'FolderTemplate', parsedIcons);
                  } else {
                    console.warn('My Documents not found or has no icons');
                  }
                }}
              >
                <img src={myDocumentsIcon} alt="My Documents" className="start-menu-icon" /> My Documents
              </li>



                <li onClick={() => onOpenWindow('My Computer', 'My Computer', 'MyComputerTemplate')}>
                  <img src={myComputerIcon} alt="My Computer" className="start-menu-icon" /> My Computer
                </li>
                <hr />
                <li onClick={() => onOpenWindow('Run', 'Run...', 'RunTemplate')}>
                  <img src={runIcon} alt="Run" className="start-menu-icon" /> Run...
                </li>
              </ul>
            </div>
          </div>
          <div className="start-menu-bottom">
            <ul>
              <li onClick={handleRestart}>
                <img src={restart_btn} alt="Restart" className="restart-icon" /> Restart
              </li>
              <li onClick={handleShutDown}>
                <img src={shutdown_btn} alt="Shut down" className="shutdown-icon" /> Shut down
              </li>
            </ul>
          </div>
        </div>
      )}
      {showShutdownModal && <ShutdownModal />}
      {showBlackScreen && <div className="black-screen"></div>}
    </div>
  );
});

export default StartMenu;
