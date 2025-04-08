import React, { useEffect, useState } from 'react';
import '../../App.css';
import './Mobile.css';
import wallpaper from '../../assets/images/Mobile/mobile-wallpaper.png';

const Mobile = ({ onBypass }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);

      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      setDate(now.toLocaleDateString(undefined, options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="android-ui" style={{ backgroundImage: `url(${wallpaper})` }}>
        <div className="lockscreen-time">
            <div className="time">{time}</div>
            <div className="date">{date}</div>
        </div>

        <div className="android-notifications">
            <div className="android-notification">
            <div className="notification-header">
                <span className="notification-title">System</span>
                <span className="notification-time">{time}</span>
            </div>
            <div className="notification-body">Welcome to my portfolio!</div>
            </div>

            <div className="android-notification">
            <div className="notification-header">
                <span className="notification-title">System</span>
                <span className="notification-time">{time}</span>
            </div>
            <div className="notification-body">This app is only available on Desktop. Please turn on your computer!</div>
            </div>
        </div>

        <button className="go-anyway-btn" onClick={onBypass}>
            Unlock anyway
        </button>
        </div>

  );
};

export default Mobile;
