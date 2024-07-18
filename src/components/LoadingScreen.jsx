import React from 'react';
import '../styles/loadingScreen.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
      <h1>Welcome</h1>
    </div>
  );
};

export default LoadingScreen;
