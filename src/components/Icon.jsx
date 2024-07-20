import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/icon.css';
import myComputerIcon from '../assets/images/computer-icon-xp.png';
import recycleBinIcon from '../assets/images/recycle-bin-icon-xp.png';
import folderIcon from '../assets/images/folder-xp-icon.png';
import pdfIcon from '../assets/images/Adobe_Acrobat_PDF-xp.png';

const GRID_SIZE = 80;

const Icon = ({ type, title, initialPosition, onDoubleClick, moveIcon, draggable = true }) => {
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
      default:
        return '/icons/default-icon.png'; // Default icon
    }
  };

  const onDragStop = (e, d) => {
    const [snappedX, snappedY] = [d.x, d.y];
    setPosition({ x: snappedX, y: snappedY });
    moveIcon && moveIcon(snappedX, snappedY);
  };

  return (
    <Rnd
      bounds="parent"
      size={{ width: 80, height: 100 }}
      position={position}
      onDragStop={draggable ? onDragStop : null}
      enableResizing={false}
      disableDragging={!draggable}
    >
      <div className="icon" onDoubleClick={onDoubleClick}>
        <img src={getImageSrc(type)} alt={title} />
        <span>{title}</span>
      </div>
    </Rnd>
  );
};

export default Icon;
