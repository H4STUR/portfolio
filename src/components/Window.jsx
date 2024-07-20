import React from 'react';
import { Rnd } from 'react-rnd';
import '../styles/window.css';

const Window = ({ id, title, onClose, position, children }) => {
  return (
    <Rnd
      className="window"
      default={{
        x: position.x,
        y: position.y,
        width: 600,
        height: 400,
      }}
      bounds="parent"
      dragHandleClassName="window-header"
    >
      <div className="window-header">
        <span>{title}</span>
        <button onClick={() => onClose(id)}>X</button>
      </div>
      <div className="window-content">
        {children}
      </div>
    </Rnd>
  );
};

export default Window;
