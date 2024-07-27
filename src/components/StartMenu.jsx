import React, { useState } from 'react';
import '../styles/startMenu.css';
import profileImage from '../assets/images/pepenolif.jpg'; //profile img
import shutdown_btn from '../assets/images/shutdown-button-xp.png'; //profile img
import restart_btn from '../assets/images/restart-button-xp.png'; //profile img
import cmdIcon from '../assets/images/Icons/cmd.ico';
import runIcon from '../assets/images/Icons/run.ico';
import ShutdownModal from './ShutdownModal';

const StartMenu = ({ onOpenWindow }) => {
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

  return (
    <div>
      {!showShutdownModal && !showBlackScreen && (
        <div className="start-menu">
          <div className='start-menu-top'>
            <img src={profileImage} alt="Profile" className="start-menu-profile-picture" />
            <p className="profile-name">Danio</p>
          </div>
          <div className='start-menu-middle'>
            <div className="start-menu-middle-left">
              <ul className="start-menu-elements">
                <li>Programs</li>
                <li><img src={cmdIcon} alt="CMD" className="start-menu-icon" /> Command Prompt</li>
                <li>Settings</li>
                <li>Search</li>
                <li>Help</li>
              </ul>
            </div>
            <div className="start-menu-middle-right">
              <ul className="start-menu-elements">
                <li>My Documents</li>
                <li>My Computer</li>
                <hr />
                <li><img src={runIcon} alt="Run" className="start-menu-icon" />Run...</li>
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
