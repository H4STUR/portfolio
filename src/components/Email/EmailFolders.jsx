import React from 'react';

const EmailFolders = ({ onNewMessage, currentFolder, onFolderChange }) => {

  const folders = [
    { label: 'Inbox [69]', key: 'inbox' },
    { label: 'Sent [5]', key: 'sent' },
    { label: 'Drafts [3]', key: 'drafts' },
    { label: 'Deleted [1]', key: 'deleted' },
  ];
  

  return (
    <div className="email-folders">
      <div className="email-topbar">
        <button onClick={onNewMessage}>New Message</button>
      </div>
      <h3>Folders</h3>
      <ul>
        {/* <li
          className={currentFolder === 'new' ? 'active-folder' : ''}
          onClick={() => onFolderChange('new')}
        >
          New Message
        </li> */}
        {folders.map((folder) => (
            <li
              key={folder.key}
              className={currentFolder === folder.key ? 'active-folder' : ''}
              onClick={() => onFolderChange(folder.key)}
            >
              {folder.label}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EmailFolders;
