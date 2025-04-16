import React, { useState } from 'react';
import Window from '../Window';
import EmailFolders from './EmailFolders';
import TopBar from './TopBar';
import NewMessage from './NewMessage';
import EmailList from './EmailList';
import EmailViewer from './EmailViewer';

import '../../styles/email.css';

import inbox from './data/inbox';
import sent from './data/sent';
import drafts from './data/drafts';
import deleted from './data/deleted';

const EmailApp = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 600, height: 400 }); // Restore window size
  const [currentFolder, setCurrentFolder] = useState('new'); // Default to New Message view
  const [selectedEmail, setSelectedEmail] = useState(null);

  const getEmails = () => {
    switch (currentFolder) {
      case 'inbox':
        return inbox;
      case 'sent':
        return sent;
      case 'drafts':
        return drafts;
      case 'deleted':
        return deleted;
      default:
        return [];
    }
  };

  const renderContent = () => {
    if (currentFolder === 'new') {
      return <NewMessage />;
    }

    if (selectedEmail) {
      return <EmailViewer email={selectedEmail} onBack={() => setSelectedEmail(null)} />;
    }

    const emails = getEmails();
    return <EmailList emails={emails} onSelect={setSelectedEmail} />;
  };

  const handleFolderChange = (folder) => {
    setSelectedEmail(null);
    setCurrentFolder(folder);
  };

  // const renderContent = () => {
  //   switch (currentFolder) {
  //     case 'new':
  //       return <NewMessage />;
  //     case 'inbox':
  //       return <p className="email-placeholder">Inbox folder content goes here.</p>;
  //     case 'sent':
  //       return <p className="email-placeholder">Sent Items folder content goes here.</p>;
  //     case 'drafts':
  //       return <p className="email-placeholder">Drafts folder content goes here.</p>;
  //     case 'deleted':
  //       return <p className="email-placeholder">Deleted Items folder content goes here.</p>;
  //     default:
  //       return <p className="email-placeholder">Selected folder is empty.</p>;
  //   }
  // };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size} // Pass size back to Window
      setSize={setSize} // Pass the setSize method to allow resizing
      className="window email-window"
    >
      {/* Top Bar */}
      {/* <TopBar onNewMessage={() => setCurrentFolder('new')} /> */}

      {/* Main Content */}
      <div className="email-content">
        {/* Sidebar: Folders */}
        <EmailFolders onNewMessage={() => setCurrentFolder('new')} currentFolder={currentFolder} onFolderChange={setCurrentFolder} />

        {/* Main View */}
        <div className="email-view">
          {renderContent()}
        </div>
      </div>
    </Window>
  );
};

export default EmailApp;
