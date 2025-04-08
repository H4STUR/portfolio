import React from 'react';

const EmailFolders = ({ currentFolder, onFolderChange }) => {
  const folders = ['inbox [69]', 'sent [5]', 'drafts [3]', 'deleted [1]'];

  return (
    <div className="email-folders">
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
            key={folder}
            className={currentFolder === folder ? 'active-folder' : ''}
            onClick={() => onFolderChange(folder)}
          >
            {folder.charAt(0).toUpperCase() + folder.slice(1)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmailFolders;
