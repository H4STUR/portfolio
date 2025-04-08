import React, { useState } from 'react';
import Window from '../Window';
import EmailFolders from './EmailFolders';
import TopBar from './TopBar';
import NewMessage from './NewMessage';
import '../../styles/email.css';

const EmailApp = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 600, height: 400 }); // Restore window size
  const [currentFolder, setCurrentFolder] = useState('new'); // Default to New Message view

  const renderContent = () => {
    switch (currentFolder) {
      case 'new':
        return <NewMessage />;
      case 'inbox':
        return <p className="email-placeholder">Inbox folder content goes here.</p>;
      case 'sent':
        return <p className="email-placeholder">Sent Items folder content goes here.</p>;
      case 'drafts':
        return <p className="email-placeholder">Drafts folder content goes here.</p>;
      case 'deleted':
        return <p className="email-placeholder">Deleted Items folder content goes here.</p>;
      default:
        return <p className="email-placeholder">Selected folder is empty.</p>;
    }
  };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size} // Pass size back to Window
      setSize={setSize} // Pass the setSize method to allow resizing
      className="email-window"
    >
      {/* Top Bar */}
      <TopBar onNewMessage={() => setCurrentFolder('new')} />

      {/* Main Content */}
      <div className="email-content">
        {/* Sidebar: Folders */}
        <EmailFolders currentFolder={currentFolder} onFolderChange={setCurrentFolder} />

        {/* Main View */}
        <div className="email-view">
          {renderContent()}
        </div>
      </div>
    </Window>
  );
};

export default EmailApp;
