import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/icon.css';

import { snapToGrid } from '../utils/grid';

import defaultIcon from '../assets/images/Icons/default.ico';
import myComputerIcon from '../assets/images/Icons/HD/My Computer.png';
import recycleBinIcon from '../assets/images/Icons/bin-full.ico';
import fileIcon from '../assets/images/Icons/HD/TXT.png';
import linkIcon from '../assets/images/Icons/explorer.ico';
import folderIcon from '../assets/images/Icons/HD/Folder.png';
import folderLockedIcon from '../assets/images/Icons/HD/Folder Locked.png';
import pdfIcon from '../assets/images/Adobe_Acrobat_PDF-xp.png';
import jpgIcon from '../assets/images/Icons/HD/JPG.png';
import cmdIcon from '../assets/images/Icons/HD/Command Prompt.png';
import minesweeperIcon from '../assets/images/Icons/HD/Minesweeper.png';
import emailIcon from '../assets/images/Icons/HD/Email.png';


const GRID_SIZE = 80;
const CELL_MARGIN = 20;
const CELL_SIZE = GRID_SIZE + CELL_MARGIN;

const Icon = ({ type, title, initialPosition, onClick, onDoubleClick, moveIcon, draggable = true, imageOverride = null }) => {
  const [position, setPosition] = useState(initialPosition);

  const getImageSrc = (type) => {
    switch (type) {
      case "My Computer":
        return myComputerIcon;
      case "Recycle Bin":
        return recycleBinIcon;
      case "Folder":
        return folderIcon;
      case "FolderLocked":
        return folderLockedIcon;
      case "PDF":
        return pdfIcon;
      case "JPG":
        return jpgIcon;
      case "File":
        return fileIcon;
      case "Link":
        return linkIcon;
      case "CMD":
        return cmdIcon;
      case "Minesweeper":
        return minesweeperIcon;
      case "Email":
        return emailIcon;
      default:
        return defaultIcon; // Default icon
    }
  };

  const onDragStop = (e, d) => {
    const [snappedX, snappedY] = snapToGrid(d.x, d.y, CELL_SIZE);
    setPosition({ x: snappedX + CELL_MARGIN, y: snappedY + CELL_MARGIN });
    moveIcon && moveIcon(snappedX, snappedY);
  };

  const iconElement = (
    <div className="icon" onClick={onClick} onDoubleClick={onDoubleClick}>
      <img src={imageOverride ? imageOverride : getImageSrc(type)} alt={title} />
      <span>{title}</span>
    </div>
  );

  if (!draggable) {
    return iconElement;
  }

  return (
    <Rnd
      bounds="parent"
      size={{ width: 80, height: 100 }}
      position={position}
      onDragStop={onDragStop}
      enableResizing={false}
      disableDragging={!draggable}
    >
      {iconElement}
    </Rnd>
  );
};

export default Icon;
