import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const formattedDate = time.toLocaleDateString('en-GB');

  return (
    <div style={{ textAlign: 'center' }}>
      <span>{formattedTime}</span>
      <br />
      <span>{formattedDate}</span>
    </div>
  );
};

export default Clock;
