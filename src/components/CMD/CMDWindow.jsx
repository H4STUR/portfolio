import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/cmdwindow.css';
import folderStructure from '../folderStructure.json'; // Import the folder structure JSON
import help from './Commands/help';
import cd from './Commands/cd';

const CMDWindow = ({ id, title, onClose, position, openWindow }) => {
  const initialText = [
    { input: '', output: 'System XD [Version 1.0.1]\n(c) 2024 Agares Lucas Majerski Corporation. No rights reserved.\n\n' }
  ];
  const [commands, setCommands] = useState(initialText);
  const [input, setInput] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 }); // Initial size of the CMD window
  const [currentPath, setCurrentPath] = useState(['C:', 'Users', 'Danio', 'Desktop']); // Initial path
  const [currentFolder, setCurrentFolder] = useState(folderStructure.C.Users.Danio.Desktop); // Start at Desktop

  const cmdOutputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (cmdOutputRef.current) {
      cmdOutputRef.current.scrollTop = cmdOutputRef.current.scrollHeight;
    }
  }, [commands]);

  // Helper function to resolve the path to the target folder in the structure
  const resolvePath = (pathArray, structure) => {
    let current = structure;
    for (const dir of pathArray.slice(1)) { // Skip 'C:' for traversal
      if (current[dir] && current[dir].icons) {
        current = current[dir].icons;
      } else if (current[dir]) {
        current = current[dir];
      } else {
        return null; // Path not found
      }
    }
    return current;
  };

  const handleCommand = () => {
    const [command, ...params] = input.trim().split(/\s+/);
    let output;
    const pathBeforeCommand = currentPath.join('\\'); // Store the path before executing the command

    switch (command.toLowerCase()) {
      case 'help':
        output = help(params);
        break;
      case 'cls':
        setCommands(initialText);
        setInput('');
        return;
      case 'date':
        output = new Date().toString();
        break;
      case 'cd': {
        const result = cd(params, currentPath, folderStructure); // Correct cd function call
        if (result.path.join('\\') !== currentPath.join('\\')) {
          setCurrentPath(result.path);
          const newFolder = resolvePath(result.path, folderStructure);
          if (newFolder) {
            setCurrentFolder(newFolder); // Update the current folder based on the new path
          }
        }
        output = result.message;
        break;
      }
      case 'dir':
        output = handleDIR();
        break;
      case 'notepad':
        output = `Opening Notepad...`;
        openWindow('File', 'Untitled - Notepad', '/FileTemplate');
        break;
      case 'paint':
        output = `Opening Paint...`;
        openWindow('Paint', 'Paint', 'PaintApp');
        break;
      case 'minesweeper':
        output = `Opening Minesweeper...`;
        openWindow('Minesweeper', 'Minesweeper', 'MinesweeperApp');
        break;
      case 'dsj':
        output = `Opening Deluxe Ski Jump...`;
        openWindow('DSJ', 'Deluxe Ski Jump', 'DeluxeSkiJumpApp');
        break;
      case 'exit':
        onClose(id);
        return;
      default:
        output = `Unknown command: ${command}`;
        break;
    }

    // Update the commands state with the new command, including the path where it was executed
    setCommands(prevCommands => [
      ...prevCommands,
      { input: `${pathBeforeCommand}> ${input}`, output }
    ]);
    setInput(''); // Clear the input
  };

  // Function to list directory contents
  const handleDIR = () => {
    if (!currentFolder || typeof currentFolder !== 'object') {
      return 'No items found in this directory.';
    }
    const items = Object.entries(currentFolder).map(([key, value]) => {
      return value.type ? `${value.type} ${value.title || key}` : key;
    });
    return items.join('\n') || 'No items found in this directory.';
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
      onResizeStop={handleResizeStop}
    >
      <div className="cmd-output" ref={cmdOutputRef} onClick={handleWindowClick}>
        {commands.map((cmd, index) => (
          <div key={index}>
            {cmd.input && <div className="cmd-input">{cmd.input}</div>}
            <div className="cmd-output-text">{cmd.output}</div>
          </div>
        ))}
      </div>
      <div className="cmd-input-line">
        <span>{currentPath.join('\\')}&gt;</span>
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
