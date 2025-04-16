import React from 'react';
import '../styles/loadingScreen.css';
import windowsLogo from '../assets/images/generated/xp-logo-ai.png'; //windows logo

const ShutdownModal = () => {
  return (
    <div className="loading-screen">
      <div className="left-section">
        <img src={windowsLogo} alt="Windows Logo" className="windows-logo" />
        <h1>System<span className="logo-xd">XD</span></h1>
        <p>System is shutting down...</p>
      </div>
      <div className="spinner"></div>
    </div>
  );
};

export default ShutdownModal;
