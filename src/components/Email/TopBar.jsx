import React from 'react';

const TopBar = ({ onNewMessage }) => {
  return (
    <div className="email-topbar">
      <button onClick={onNewMessage}>New Message</button>
      <button>Reply</button>
      <button>Forward</button>
      <button>Delete</button>
      <button>Send/Recv</button>
    </div>
  );
};

export default TopBar;
