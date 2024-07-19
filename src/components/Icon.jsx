import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { snapToGrid } from '../utils/grid';
import '../styles/icon.css';
import myComputerIcon from '../assets/images/computer-icon-xp.png';
import recycleBinIcon from '../assets/images/recycle-bin-icon-xp.png';
import folderIcon from '../assets/images/folder-icon.png';

const GRID_SIZE = 80;
const CELL_MARGIN = 20;
const CELL_SIZE = GRID_SIZE + CELL_MARGIN;

const Icon = ({ id, type, title, onDoubleClick, initialPosition, moveIcon }) => {
  const [position, setPosition] = useState(initialPosition);

  const getImageSrc = (type) => {
    switch (type) {
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
    const [snappedX, snappedY] = snapToGrid(d.x - CELL_MARGIN, d.y - CELL_MARGIN, CELL_SIZE);
    setPosition({ x: snappedX + CELL_MARGIN, y: snappedY + CELL_MARGIN });
    moveIcon(id, { x: snappedX + CELL_MARGIN, y: snappedY + CELL_MARGIN });
  };

  return (
    <Rnd
      bounds="parent"
      size={{ width: 80, height: 100 }}
      position={position}
      onDragStop={onDragStop}
      enableResizing={false}
      dragHandleClassName="icon"
    >
      <div className="icon" onDoubleClick={onDoubleClick}>
        <img src={getImageSrc(type)} alt={title} />
        <span>{title}</span>
      </div>
    </Rnd>
  );
};

export default Icon;
