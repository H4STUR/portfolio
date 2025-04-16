// components/BlueScreen.jsx
import React from 'react';
import '../styles/bluescreen.css';

const BlueScreen = ({ message = 'A problem has been detected and Windows has been shut down to prevent damage to your computer.', show = true }) => {
  if (!show) return null;

  return (
    <div className="bluescreen">
      <div className="bsod-text">
        <p>{message}</p>
        <p>If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps:</p>
        <ul>
          <li>Check to make sure any new hardware or software is properly installed.</li>
          <li>If this is a new installation, ask your hardware or software manufacturer for any Windows updates you might need.</li>
        </ul>
        <p>If problems continue, disable or remove any newly installed hardware or software. Disable BIOS memory options such as caching or shadowing.</p>
        <p>If you need to use Safe Mode to remove or disable components, restart your computer, press F8 to select Advanced Startup Options, and then select Safe Mode.</p>
        <p className="error-code">*** STOP: 0x000000D1 (0x00000000, 0x00000002, 0x00000000, 0x00000000)</p>
      </div>
    </div>
  );
};

export default BlueScreen;
