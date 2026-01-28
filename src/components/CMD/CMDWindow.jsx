import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/cmdwindow.css';
import folderStructure from '../folderStructure.json'; // Import the folder structure JSON
import help from './Commands/help';
import cd from './Commands/cd';
import xd from './Commands/xd';
import kutas from './Commands/kutas';
import duzykutas from './Commands/duzykutas';

const CMDWindow = ({ id, title, onClose, position, openWindow }) => {
  const initialText = [
    { input: '', output: 'System XD [Version 1.4.2]\n(c) 2024 Agares Lucas Majerski Corporation. No rights reserved.\n\n' }
  ];
  const [commands, setCommands] = useState(initialText);
  const [input, setInput] = useState('');
  const [windowSize, setWindowSize] = useState({ width: 600, height: 400 }); // Initial size of the CMD window
  const [currentPath, setCurrentPath] = useState(['C:', 'Users', 'Danio', 'Desktop']); // Initial path
  const [currentFolder, setCurrentFolder] = useState(folderStructure.C.Users.Danio.Desktop); // Start at Desktop

  const cmdOutputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Scroll the window-content container (parent of cmd-output)
    const container = cmdOutputRef.current?.parentElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [commands]);

  // Helper function to resolve the path to the target folder in the structure
  const resolvePath = (pathArray, structure, getLastMeta = false) => {
    let current = structure;
  
    for (let i = 0; i < pathArray.length; i++) {
      let key = pathArray[i];
      if (i === 0 && key.endsWith(':')) key = key.replace(':', '');
  
      if (!current || typeof current !== 'object' || !current.hasOwnProperty(key)) {
        return null;
      }
  
      const next = current[key];
  
      if (i === pathArray.length - 1 && getLastMeta) {
        return next; // return the full object (including .restricted)
      }
  
      current =
        next && typeof next === 'object' && next.icons
          ? next.icons
          : next;
    }
  
    return current;
  };
  
  

  const parseCommand = (input) => {
    const regex = /(?:[^\s"]+|"[^"]*")+/g;
    const matches = input.match(regex) || [];
    return matches.map(s => s.replace(/^"|"$/g, ''));
  };

  const handleCommand = async () => {
    const [command, ...params] = parseCommand(input.trim());
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
        console.log('CD input:', params);
        const result = cd(params, currentPath, folderStructure);
        console.log('Result from cd():', result);
      
        if (result.path.join('\\') !== currentPath.join('\\')) {
          setCurrentPath(result.path);
          const newFolder = resolvePath(result.path, folderStructure);
          console.log('Resolved folder:', newFolder);
          if (newFolder) {
            setCurrentFolder(newFolder);
          }
        }
        output = result.message;
        break;
      }

      case 'type': {
        if (params.length === 0) {
          output = 'Usage: type [filename]';
          break;
        }
      
        const filename = params[0].toLowerCase();
        const fileKey = Object.keys(currentFolder).find(key => key.toLowerCase() === filename);
        const file = currentFolder[fileKey];
      
        if (!file || !file.template) {
          output = `The system cannot find the file: ${params[0]}`;
          break;
        }
      
        try {
          const loadedContent = await import(`../Templates/File/${file.template}.js`);
          output = loadedContent.default;
        } catch (err) {
          console.error('Error loading template:', err);
          output = `Error reading file: ${params[0]}`;
        }
      
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

      case 'ls':
      case 'cat':
        output = `${command}? Sounds like a Linux command :)`;
        break;

      case 'xd':
        output = xd();
        break;

      case 'dick':
      case 'kutas':
        output = kutas();
        break;
      case 'bigdick':
      case 'duzykutas':
        output = duzykutas();
        break;

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
      onContentClick={handleWindowClick}
    >
      <div className="cmd-output" ref={cmdOutputRef} onClick={handleWindowClick}>
        {commands.map((cmd, index) => (
          <div key={index}>
            {cmd.input && <div className="cmd-input">{cmd.input}</div>}
            <div className="cmd-output-text">{cmd.output}</div>
          </div>
        ))}
      </div>
      <div className="cmd-input-line" onClick={handleWindowClick}>
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
