import React from 'react';
import hardDriveIcon from '../../assets/images/Icons/HD/Local Disk.png';
import floppyIcon from '../../assets/images/Icons/HD/Floppy Disk.png';
import myDocumentsIcon from '../../assets/images/Icons/HD/My Documents.png';

import folderStructure from '../folderStructure.json'; // adjust path as needed
import '../../styles/myComputer.css';

const MyComputerTemplate = ({ onOpenWindow }) => {

  const parseFolderStructure = (items) => {
    return Object.entries(items).map(([key, value]) => ({
      id: value.id || Math.random(),
      type: value.type,
      title: value.title || key,
      initialPosition: value.initialPosition || { x: 0, y: 0 },
      template: value.template || '',
      imageOverride: value.image || null,
      icons: value.icons ? parseFolderStructure(value.icons) : []
    }));
  };

  
  const openMyDocuments = () => {
    const myDocs = folderStructure?.C?.Users?.Danio?.['My Documents'];
    if (myDocs && myDocs.icons) {
      const parsedIcons = parseFolderStructure(myDocs.icons);
      onOpenWindow('Folder', 'My Documents', 'FolderTemplate', parsedIcons);
    } else {
      console.warn('My Documents not found or has no icons');
    }
  };
  

  return (
    <div className="my-computer-contener">
      <div className="my-computer-left-panel">
        <div className='my-computer-nav'>
          <p>(SECTION UNDER CONSTRUCTION)</p>
        </div>
        <div className='my-computer-nav' onClick={openMyDocuments}>
          <img src={myDocumentsIcon} alt="My Documents" className="start-menu-icon" />
          <p>My Documents</p>
        </div>
      </div>
      <div className="my-computer-right-panel">
        <div>
          <p className='my-computer-title'>Hard Drives: (SECTION UNDER CONSTRUCTION)</p>
          <div className='my-computer-drive'>
            <img src={hardDriveIcon} alt="Hard Drive" className="my-computer-icon" />
            <p>Local Disk (C:) (SECTION UNDER CONSTRUCTION)</p>
          </div>
        </div>
        <div>
          <p className='my-computer-title'>Devices with Removable Storage: (SECTION UNDER CONSTRUCTION)</p>
          <div className='my-computer-drive'>
            <img src={floppyIcon} alt="Floppy" className="my-computer-icon" />
            <p>3½ Floppy (A:) (SECTION UNDER CONSTRUCTION)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComputerTemplate;
