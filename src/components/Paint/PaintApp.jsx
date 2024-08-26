import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/paint.css'; // Uncomment if needed

const PaintApp = ({ id, title, onClose, position }) => {
  const [size, setSize] = useState({ width: 600, height: 400 });
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineCap = 'round';
    context.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    context.lineTo(x, y);
    context.strokeStyle = color;
    context.lineWidth = brushSize;
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <Window id={id} title={title} onClose={onClose} position={position} size={size} className="paint-window">
      <div className="flex flex-col items-center p-4 bg-gray-100">
      
        <div className="paint-controls mb-4 flex space-x-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-10 w-10"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(e.target.value)}
            className="w-32"
          />
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Clear
          </button>
        </div>

        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          className="border border-gray-300 bg-white"
        />
      </div>
    </Window>
  );
};

export default PaintApp;
