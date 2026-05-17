import React, { useState } from 'react';
import hardDriveIcon from '../../assets/images/Icons/HD/Local Disk.png';
import floppyIcon from '../../assets/images/Icons/HD/Floppy Disk.png';
import myComputerIcon from '../../assets/images/Icons/HD/My Computer.png';
import myDocumentsIcon from '../../assets/images/Icons/HD/My Documents.png';
import myPicturesIcon from '../../assets/images/Icons/HD/My Pictures.png';

import folderStructure from '../folderStructure.json';
import FolderTemplate from './FolderTemplate';
import '../../styles/myComputer.css';

const MyComputerTemplate = ({ onOpenWindow }) => {
  const [view, setView] = useState('home');
  const [currentIcons, setCurrentIcons] = useState([]);

  const parseFolderStructure = (items) => {
    return Object.entries(items).map(([key, value]) => ({
      id: `${key}-${Math.random()}`,
      type: value.type,
      title: value.title || key,
      initialPosition: value.initialPosition || { x: 0, y: 0 },
      initialSize: value.initialSize || null,
      template: value.template || '',
      imageOverride: value.image || null,
      icons: value.icons ? parseFolderStructure(value.icons) : []
    }));
  };

  const navigateTo = (viewName, rawIcons) => {
    setCurrentIcons(parseFolderStructure(rawIcons));
    setView(viewName);
  };

  const openMyDocuments = () => {
    const myDocs = folderStructure?.C?.Users?.Danio?.['My Documents'];
    if (myDocs?.icons) navigateTo('mydocuments', myDocs.icons);
  };

  const openMyPictures = () => {
    const pics = folderStructure?.C?.Users?.Danio?.['Pictures'];
    if (pics?.icons) navigateTo('mypictures', pics.icons);
  };

  const openFloppy = () => {
    const floppy = folderStructure?.C?.Users?.Danio?.Desktop?.['My Computer']?.['Floppy'];
    if (floppy?.icons) {
      const parsedIcons = parseFolderStructure(floppy.icons);
      onOpenWindow('Folder', '3½ Floppy (A:)', 'FolderTemplate', parsedIcons);
    }
  };

  return (
    <div className="my-computer-contener">
      <div className="my-computer-left-panel">
        <div className={`my-computer-nav${view === 'home' ? ' active' : ''}`} onClick={() => setView('home')}>
          <img src={myComputerIcon} alt="My Computer" className="start-menu-icon" />
          <p>My Computer</p>
        </div>
        <div className={`my-computer-nav${view === 'mydocuments' ? ' active' : ''}`} onClick={openMyDocuments}>
          <img src={myDocumentsIcon} alt="My Documents" className="start-menu-icon" />
          <p>My Documents</p>
        </div>
        <div className={`my-computer-nav${view === 'mypictures' ? ' active' : ''}`} onClick={openMyPictures}>
          <img src={myPicturesIcon} alt="My Pictures" className="start-menu-icon" />
          <p>My Pictures</p>
        </div>
      </div>
      <div className="my-computer-right-panel">
        {view === 'home' ? (
          <>
            <div>
              <p className='my-computer-title'>Hard Drives:</p>
              <div className='my-computer-drive not-active-click'>
                <img src={hardDriveIcon} alt="Hard Drive" className="my-computer-icon" />
                <p>Local Disk (C:)</p>
              </div>
            </div>
            <div>
              <p className='my-computer-title'>Devices with Removable Storage:</p>
              <div className='my-computer-drive' onClick={openFloppy}>
                <img src={floppyIcon} alt="Floppy" className="my-computer-icon" />
                <p>3½ Floppy (A:)</p>
              </div>
            </div>
          </>
        ) : (
          <FolderTemplate icons={currentIcons} openWindow={onOpenWindow} />
        )}
      </div>
    </div>
  );
};

export default MyComputerTemplate;
