import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { snapToGrid } from '../utils/grid';
import '../styles/icon.css';
import myComputerIcon from '../assets/images/computer-icon-xp.png';
import recycleBinIcon from '../assets/images/recycle-bin-icon-xp.png';
import folderIcon from '../assets/images/folder-icon.png';

const GRID_SIZE = 80;

const Icon = ({ title, onDoubleClick, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);

  const getImageSrc = (title) => {
    switch (title) {
      case "My Computer":
        return myComputerIcon;
      case "Recycle Bin":
        return recycleBinIcon;
      case "Folder":
        return folderIcon;
      default:
        return '/icons/default-icon.png'; // Default icon
    }
  };

  const onDragStop = (e, d) => {
    const [snappedX, snappedY] = snapToGrid(d.x, d.y, GRID_SIZE);
    setPosition({ x: snappedX, y: snappedY });
  };

  return (
    <Rnd
      bounds="parent"
      size={{ width: 80, height: 100 }}
      position={position}
      onDragStop={onDragStop}
      dragGrid={[GRID_SIZE, GRID_SIZE]}
      enableResizing={false}
    >
      <div className="icon" onDoubleClick={onDoubleClick}>
        <img src={getImageSrc(title)} alt={title} />
        <span>{title}</span>
      </div>
    </Rnd>
  );
};

export default Icon;
