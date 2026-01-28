import React, { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';
import '../styles/window.css';

const Window = ({ id, title, onClose, position, size = { width: 600, height: 400 }, children, className = null, onContentClick = null }) => {
  const rndRef = useRef(null);
  const [windowSize, setWindowSize] = useState(size);
  const [windowPosition, setWindowPosition] = useState(position);

  useEffect(() => {
    // Update the Rnd size when the size prop changes
    setWindowSize(size);
  }, [size]);

  useEffect(() => {
    // Update the Rnd position when the position prop changes
    setWindowPosition(position);
  }, [position]);

  const handleDragStop = (e, data) => {
    setWindowPosition({ x: data.x, y: data.y });
  };

  const handleResizeStop = (e, direction, ref, delta, position) => {
    setWindowSize({ width: ref.offsetWidth, height: ref.offsetHeight });
    setWindowPosition(position);
  };

  return (
    <Rnd
      className={className ? className : "window"}
      id={id}
      position={windowPosition}
      size={windowSize}
      bounds="parent"
      dragHandleClassName="window-header"
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      ref={rndRef}
      enableResizing={true}
    >
      <div className="window-header">
        <span>{title}</span>
        <button onClick={() => onClose(id)} className="close-button">X</button>
      </div>
      <div className="window-content" onClick={onContentClick}>
        {children}
      </div>
    </Rnd>
  );
};

export default Window;
