import React from 'react';
import '../styles/loadingScreen.css';
import windowsLogo from '../assets/images/windows-logo.png'; // Replace with the actual Windows logo path
import profileImage from '../assets/images/pepenolif.jpg'; // Replace with the actual profile picture path

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="left-section">
        <img src={windowsLogo} alt="Windows Logo" className="windows-logo" />
        <h1>Windows<span className="logo-xd">XD</span></h1>
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
