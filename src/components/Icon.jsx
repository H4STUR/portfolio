import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/icon.css';
import myComputerIcon from '../assets/images/computer-icon-xp.png';
import recycleBinIcon from '../assets/images/Icons/bin.ico';
import fileIcon from '../assets/images/Icons/txt.ico';
import linkIcon from '../assets/images/Icons/explorer.ico';
import folderIcon from '../assets/images/folder-xp-icon.png';
import pdfIcon from '../assets/images/Adobe_Acrobat_PDF-xp.png';

const GRID_SIZE = 80;

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
      case "PDF":
        return pdfIcon;
      case "File":
        return fileIcon;
      case "Link":
        return linkIcon;
      default:
        return '/icons/default-icon.png'; // Default icon
    }
  };

  const onDragStop = (e, d) => {
    const [snappedX, snappedY] = [d.x, d.y];
    setPosition({ x: snappedX, y: snappedY });
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
