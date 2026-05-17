import React, { useState } from 'react';
import Window from '../Window';
import '../../styles/imagewindow.css';
import imageMap from '../../utils/imageMap';

const HEADER_H = 40;
const NAV_H = 36;

const ImageWindow = ({ id, title, onClose, position, template, icons = [], initialSize = { width: 500, height: 540 } }) => {
  const [size, setSize] = useState(initialSize);

  const siblings = icons && icons.length > 0 ? icons : [{ title, template }];
  const initialIdx = Math.max(0, siblings.findIndex(s => s.template === template));
  const [currentIdx, setCurrentIdx] = useState(initialIdx);

  const current = siblings[currentIdx] || siblings[0];
  const imageSrc = imageMap[current?.template] || null;
  const hasSiblings = siblings.length > 1;

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (!naturalWidth || !naturalHeight) return;
    const ratio = naturalWidth / naturalHeight;
    const chromeH = HEADER_H + (hasSiblings ? NAV_H : 0);
    const contentArea = size.width * (size.height - chromeH);
    let w = Math.round(Math.sqrt(contentArea * ratio));
    let h = Math.round(w / ratio) + chromeH;
    setSize({ width: Math.max(w, 300), height: Math.max(h, 200) });
  };

  return (
    <Window
      id={id}
      title={title}
      onClose={onClose}
      position={position}
      size={size}
      setSize={setSize}
      className="window notepad-window"
    >
      <div className="image-window-wrapper">
        <div className="image-window-content">
          {imageSrc ? (
            <img src={imageSrc} alt={current?.title || title} className="image-view" onLoad={handleImageLoad} />
          ) : (
            <p className="image-error">Image not found: {current?.template}</p>
          )}
        </div>
        {hasSiblings && (
          <div className="image-window-nav">
            <button
              onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
              disabled={currentIdx === 0}
            >
              ◄ Prev
            </button>
            <span>{currentIdx + 1} / {siblings.length}</span>
            <button
              onClick={() => setCurrentIdx(i => Math.min(siblings.length - 1, i + 1))}
              disabled={currentIdx === siblings.length - 1}
            >
              Next ►
            </button>
          </div>
        )}
      </div>
    </Window>
  );
};

export default ImageWindow;
