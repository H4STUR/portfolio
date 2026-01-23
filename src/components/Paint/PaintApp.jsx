import React, { useState, useEffect, useRef, useCallback } from 'react';
import Window from '../Window';
import '../../styles/paint.css';

// Windows XP Paint color palette
const XP_COLORS = [
  ['#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
   '#808040', '#004040', '#0080FF', '#004080', '#8000FF', '#804000'],
  ['#FFFFFF', '#C0C0C0', '#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#FF00FF',
   '#FFFF80', '#00FF80', '#80FFFF', '#8080FF', '#FF0080', '#FF8040']
];

const TOOLS = {
  PENCIL: 'pencil',
  BRUSH: 'brush',
  ERASER: 'eraser',
  FILL: 'fill',
  PICKER: 'picker',
  LINE: 'line',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse'
};

const TOOL_ICONS = {
  [TOOLS.PENCIL]: '✏',
  [TOOLS.BRUSH]: '🖌',
  [TOOLS.ERASER]: '▭',
  [TOOLS.FILL]: '🪣',
  [TOOLS.PICKER]: '💉',
  [TOOLS.LINE]: '╲',
  [TOOLS.RECTANGLE]: '▢',
  [TOOLS.ELLIPSE]: '○'
};

const BRUSH_SIZES = [1, 3, 5, 8, 12];

const PaintApp = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 750, height: 550 });
  const canvasRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#000000');
  const [secondaryColor, setSecondaryColor] = useState('#FFFFFF');
  const [brushSize, setBrushSize] = useState(3);
  const [tool, setTool] = useState(TOOLS.PENCIL);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [canvasHistory, setCanvasHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    saveToHistory();
  }, []);

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    const imageData = canvas.toDataURL();
    setCanvasHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(imageData);
      return newHistory.slice(-20);
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = canvasHistory[newIndex];
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < canvasHistory.length - 1) {
      const newIndex = historyIndex + 1;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0);
      };
      img.src = canvasHistory[newIndex];
      setHistoryIndex(newIndex);
    }
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const floodFill = (startX, startY, fillColor) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const startIdx = (Math.floor(startY) * canvas.width + Math.floor(startX)) * 4;
    const startR = data[startIdx];
    const startG = data[startIdx + 1];
    const startB = data[startIdx + 2];

    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);

    if (startR === fillR && startG === fillG && startB === fillB) return;

    const stack = [[Math.floor(startX), Math.floor(startY)]];
    const visited = new Set();

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = `${x},${y}`;

      if (visited.has(key) || x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) continue;

      const idx = (y * canvas.width + x) * 4;
      if (Math.abs(data[idx] - startR) > 10 ||
          Math.abs(data[idx + 1] - startG) > 10 ||
          Math.abs(data[idx + 2] - startB) > 10) continue;

      visited.add(key);
      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = 255;

      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }

    context.putImageData(imageData, 0, 0);
  };

  const pickColor = (x, y) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const pixel = context.getImageData(x, y, 1, 1).data;
    const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(v => v.toString(16).padStart(2, '0')).join('');
    setPrimaryColor(hex);
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const isRightClick = e.button === 2;
    const currentColor = isRightClick ? secondaryColor : primaryColor;

    if (tool === TOOLS.FILL) {
      floodFill(x, y, currentColor);
      saveToHistory();
      return;
    }

    if (tool === TOOLS.PICKER) {
      pickColor(Math.floor(x), Math.floor(y));
      return;
    }

    setIsDrawing(true);
    setStartPos({ x, y });

    if (tool === TOOLS.PENCIL || tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.beginPath();
      context.moveTo(x, y);

      if (tool === TOOLS.ERASER) {
        context.strokeStyle = '#FFFFFF';
      } else {
        context.strokeStyle = currentColor;
      }
      context.lineWidth = tool === TOOLS.PENCIL ? 1 : brushSize;
    }
  };

  const draw = (e) => {
    const { x, y } = getCoordinates(e);
    const isRightClick = e.buttons === 2;
    const currentColor = isRightClick ? secondaryColor : primaryColor;

    if (tool === TOOLS.LINE || tool === TOOLS.RECTANGLE || tool === TOOLS.ELLIPSE) {
      const overlay = overlayCanvasRef.current;
      const ctx = overlay.getContext('2d');
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      if (!isDrawing) return;

      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === TOOLS.LINE) {
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === TOOLS.RECTANGLE) {
        ctx.strokeRect(startPos.x, startPos.y, x - startPos.x, y - startPos.y);
      } else if (tool === TOOLS.ELLIPSE) {
        ctx.beginPath();
        const radiusX = Math.abs(x - startPos.x) / 2;
        const radiusY = Math.abs(y - startPos.y) / 2;
        const centerX = startPos.x + (x - startPos.x) / 2;
        const centerY = startPos.y + (y - startPos.y) / 2;
        ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
      return;
    }

    if (!isDrawing) return;

    if (tool === TOOLS.PENCIL || tool === TOOLS.BRUSH || tool === TOOLS.ERASER) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      context.lineTo(x, y);
      context.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    if (tool === TOOLS.LINE || tool === TOOLS.RECTANGLE || tool === TOOLS.ELLIPSE) {
      const canvas = canvasRef.current;
      const overlay = overlayCanvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(overlay, 0, 0);

      const overlayCtx = overlay.getContext('2d');
      overlayCtx.clearRect(0, 0, overlay.width, overlay.height);
    }

    setIsDrawing(false);
    saveToHistory();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const saveAsJpg = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'my-drawing.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.9);
    link.click();
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <Window id={id} title={title} onClose={onClose} position={position} size={size} className="paint-window">
      <div className="paint-container">
        {/* Toolbar */}
        <div className="paint-toolbar">
          <button className="paint-action-btn" onClick={saveAsJpg}>Save as JPG</button>
          <button className="paint-action-btn" onClick={clearCanvas}>Clear</button>
          <button className="paint-action-btn" onClick={undo} disabled={historyIndex <= 0}>Undo</button>
          <button className="paint-action-btn" onClick={redo} disabled={historyIndex >= canvasHistory.length - 1}>Redo</button>
        </div>

        {/* Main Content Area */}
        <div className="paint-main">
          {/* Tool Panel */}
          <div className="paint-toolbox">
            <div className="paint-tools-grid">
              {Object.entries(TOOLS).map(([key, toolType]) => (
                <button
                  key={key}
                  className={`paint-tool-btn ${tool === toolType ? 'active' : ''}`}
                  onClick={() => setTool(toolType)}
                  title={key.charAt(0) + key.slice(1).toLowerCase()}
                >
                  {TOOL_ICONS[toolType]}
                </button>
              ))}
            </div>

            {/* Brush Size */}
            <div className="paint-brush-sizes">
              <div className="paint-section-label">Size</div>
              <div className="paint-size-options">
                {BRUSH_SIZES.map(s => (
                  <button
                    key={s}
                    className={`paint-size-btn ${brushSize === s ? 'active' : ''}`}
                    onClick={() => setBrushSize(s)}
                    title={`${s}px`}
                  >
                    <span className="paint-size-dot" style={{
                      width: Math.min(s * 1.5, 14),
                      height: Math.min(s * 1.5, 14)
                    }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Color Display */}
            <div className="paint-color-display">
              <div
                className="paint-secondary-color"
                style={{ backgroundColor: secondaryColor }}
                onClick={() => {
                  const temp = primaryColor;
                  setPrimaryColor(secondaryColor);
                  setSecondaryColor(temp);
                }}
                title="Secondary color (right-click to draw)"
              />
              <div
                className="paint-primary-color"
                style={{ backgroundColor: primaryColor }}
                title="Primary color (left-click to draw)"
              />
            </div>
          </div>

          {/* Canvas Area */}
          <div className="paint-canvas-container">
            <div className="paint-canvas-wrapper">
              <canvas
                ref={canvasRef}
                width={600}
                height={400}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onContextMenu={handleContextMenu}
                className="paint-canvas"
              />
              <canvas
                ref={overlayCanvasRef}
                width={600}
                height={400}
                className="paint-overlay-canvas"
              />
            </div>
          </div>
        </div>

        {/* Color Palette */}
        <div className="paint-palette">
          <div className="paint-palette-colors">
            {XP_COLORS.map((row, rowIdx) => (
              <div key={rowIdx} className="paint-palette-row">
                {row.map((color, colIdx) => (
                  <button
                    key={`${rowIdx}-${colIdx}`}
                    className={`paint-color-swatch ${primaryColor === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setPrimaryColor(color)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSecondaryColor(color);
                    }}
                    title={color}
                  />
                ))}
              </div>
            ))}
          </div>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="paint-color-input"
            title="Custom color"
          />
        </div>

        {/* Status Bar */}
        <div className="paint-statusbar">
          <span>{tool.charAt(0).toUpperCase() + tool.slice(1)}</span>
          <span>{brushSize}px</span>
        </div>
      </div>
    </Window>
  );
};

export default PaintApp;
