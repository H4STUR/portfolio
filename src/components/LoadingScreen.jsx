import React from 'react';
import '../styles/loadingScreen.css';
import windowsLogo from '../assets/images/windows-logo.png'; //windows logo
import profileImage from '../assets/images/pepenolif.jpg'; //profile img

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="left-section">
        <img src={windowsLogo} alt="Windows Logo" className="windows-logo" />
        <h1>System<span className="logo-xd">XD</span></h1>
        <p>To begin, click your user name</p>
      </div>
      <div className="right-section">
        <div className="profile">
          <img src={profileImage} alt="Profile" className="profile-picture" />
          <div className="profile-info">
            <p>Danio</p>
            <p>3 programs running.</p>
          </div>
        </div>
      </div>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingScreen;
