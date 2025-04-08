import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Desktop from './components/Desktop';
import Mobile from './components/Mobile/Mobile';
import './App.css';

const App = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [bypassMobile, setBypassMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const isSmallScreen = window.innerWidth <= 768;
      const isTouchDevice = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      setIsMobile(isSmallScreen || isTouchDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (isMobile && !bypassMobile) {
    return <Mobile onBypass={() => setBypassMobile(true)} />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <Desktop />
      </div>
    </DndProvider>
  );
};

export default App;
