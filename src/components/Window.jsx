import React from 'react';
import { Rnd } from 'react-rnd';
import '../styles/window.css';

const Window = ({ id, title, onClose, position }) => {
  return (
    <Rnd
      className="window"
      default={{
        x: position.x,
        y: position.y,
        width: 300,
        height: 200,
      }}
      bounds="parent"
      dragHandleClassName="window-header"
    >
      <div className="window-header">
        <span>{title}</span>
        <button onClick={() => onClose(id)}>X</button>
      </div>
      <div className="window-content">
        {title === 'Folder' ? (
          <div>
            <p>This is a folder XD</p>
          </div>
        ) : (
          <div>
            <p>This is the content of {title}.</p>
          </div>
        )}
      </div>
    </Rnd>
  );
};

export default Window;
