import React from 'react';
import { Rnd } from 'react-rnd';
import '../styles/window.css';

const Window = ({ id, title, onClose, position, children, className = null }) => {
  return (
    <Rnd
      className={className ? className : "window"}
      id={id}
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
        <button onClick={() => onClose(id)} className="close-button">X</button>
      </div>
      <div className="window-content">
        {children}
      </div>
    </Rnd>
  );
};

export default Window;
