// StartMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import '../styles/startMenu.css';
import profileImage from '../assets/images/pepenolif.jpg'; // Profile image
import shutdown_btn from '../assets/images/shutdown-button-xp.png'; // Shutdown button
import restart_btn from '../assets/images/restart-button-xp.png'; // Restart button
import cmdIcon from '../assets/images/Icons/HD/Command Prompt.png';
import myComputerIcon from '../assets/images/Icons/HD/My Computer.png';
import myDocumentsIcon from '../assets/images/Icons/HD/My Documents.png';
import runIcon from '../assets/images/Icons/run.ico';
import minesweeperIcon from '../assets/images/Icons/HD/Minesweeper.png';
import ShutdownModal from './ShutdownModal';

const StartMenu = ({ onOpenWindow, closeStartMenu }) => {
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const [showBlackScreen, setShowBlackScreen] = useState(false);
  const startMenuRef = useRef(null);

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

  // Close the start menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (startMenuRef.current && !startMenuRef.current.contains(event.target)) {
        closeStartMenu(); // Close the start menu if click is outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeStartMenu]);

  return (
    <div>
      {!showShutdownModal && !showBlackScreen && (
        <div className="start-menu" ref={startMenuRef}>
          <div className='start-menu-top'>
            <img src={profileImage} alt="Profile" className="start-menu-profile-picture" />
            <p className="profile-name">Danio</p>
          </div>
          <div className='start-menu-middle'>
            <div className="start-menu-middle-left">
              <ul className="start-menu-elements">
                <li onClick={() => onOpenWindow('Minesweeper', 'Minesweeper', 'MinesweeperApp')}>
                  <img src={minesweeperIcon} alt="CMD" className="start-menu-icon" /> Minesweeper
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
                <li onClick={() => onOpenWindow('My Documents', 'My Documents', 'MyComputerTemplate')}>
                  <img src={myDocumentsIcon} alt="CMD" className="start-menu-icon" /> My Documents
                </li>
                <li onClick={() => onOpenWindow('My Computer', 'My Computer', 'MyComputerTemplate')}>
                  <img src={myComputerIcon} alt="CMD" className="start-menu-icon" /> My Computer
                </li>
                <hr />
                <li onClick={() => onOpenWindow('Run', 'Run...', 'RunTemplate')}>
                  <img src={runIcon} alt="Run" className="start-menu-icon" />Run...
                </li>
              </ul>
            </div>
          </div>
          <div className='start-menu-bottom'>
            <ul>
              <li onClick={handleRestart}><img src={restart_btn} alt="restart" className="restart-icon" />Restart</li>
              <li onClick={handleShutDown}><img src={shutdown_btn} alt="shutdown" className="shutdown-icon" />Shut down</li>
            </ul>
          </div>
        </div>
      )}
      {showShutdownModal && <ShutdownModal />}
      {showBlackScreen && <div className="black-screen"></div>}
    </div>
  );
};

export default StartMenu;
