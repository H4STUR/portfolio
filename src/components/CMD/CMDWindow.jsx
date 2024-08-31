import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/cmdwindow.css';

// Commands
import help from './Commands/help';

const CMDWindow = ({ id, title, onClose, position, openWindow }) => {
  const initialText = [
    { input: '', output: 'System XD [Version 1.0.1]\n(c) 2024 Agares Lucas Majerski Corporation. No rights reserved.\n\n' }
  ];
  const [commands, setCommands] = useState(initialText);
  const [input, setInput] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 }); // Initial size of the CMD window

  const cmdOutputRef = useRef(null);
  const inputRef = useRef(null); 

  useEffect(() => {
    if (cmdOutputRef.current) {
      cmdOutputRef.current.scrollTop = cmdOutputRef.current.scrollHeight;
    }
  }, [commands]);

  const handleCommand = () => {
    const [command, ...params] = input.trim().split(/\s+/);
    let output;

    switch (command.toLowerCase()) {
      case 'help':
        output = params.length > 1 
          ? `HELP [command] - Displays help information for the specified command.\n`
          : help(params);
        break;
      case 'cls':
        if (params.length > 0) {
          output = `The 'cls' command does not take any parameters.`;
        } else {
          setCommands(initialText);
          setInput('');
          return;
        }
        break;
      case 'date':
        if (params.length > 0) {
          output = `The 'date' command does not take any parameters.`;
        } else {
          output = new Date().toString();
        }
        break;
      case 'notepad':
        if (params.length > 0) {
          output = `The 'notepad' command does not take any parameters.`;
        } else {
          output = `Opening Notepad...`;
          openWindow('File', 'Untitled - Notepad', '/FileTemplate');
        }
        break;
      case 'paint':
        if (params.length > 0) {
          output = `The 'paint' command does not take any parameters.`;
        } else {
          output = `Opening Paint...`;
          openWindow('Paint', 'Paint', 'PaintApp');
        }
        break;
      case 'minesweeper':
        if (params.length > 0) {
          output = `The 'minesweeper' command does not take any parameters.`;
        } else {
          output = `Opening Minesweeper...`;
          openWindow('Minesweeper', 'Minesweeper', 'MinesweeperApp');
        }
        break;
      case 'dsj':
        if (params.length > 0) {
          output = `The 'Deluxe Ski Jump' command does not take any parameters.`;
        } else {
          output = `Opening Deluxe Ski Jump...`;
          openWindow('DSJ', 'Deluxe Ski Jump', 'DeluxeSkiJumpApp');
        }
        break;
      case 'exit':
        if (params.length > 0) {
          output = `The 'exit' command does not take any parameters.`;
        } else {
          onClose(id);
          return;
        }
        break;
      default:
        output = `Unknown command: ${command}`;
        break;
    }

    setCommands([...commands, { input, output }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand();
    }
  };

  const handleWindowClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Update window size
  const handleResizeStop = (e, direction, ref, delta, position) => {
    setWindowSize({ width: ref.offsetWidth, height: ref.offsetHeight });
  };

  return (
    <Window 
      id={id} 
      title={title} 
      onClose={onClose} 
      position={position} 
      size={windowSize} 
      className="cmd-window"
      onResizeStop={handleResizeStop} // Pass resize handler to Window component
    >
      <div className="cmd-output" ref={cmdOutputRef} onClick={handleWindowClick}>
        {commands.map((cmd, index) => (
          <div key={index}>
            {cmd.input && <div className="cmd-input">C:\&gt;{cmd.input}</div>}
            <div className="cmd-output-text">{cmd.output}</div>
          </div>
        ))}
      </div>
      <div className="cmd-input-line">
        <span>C:\&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          autoFocus
          aria-label="Command input"
        />
      </div>
    </Window>
  );
};

export default CMDWindow;
