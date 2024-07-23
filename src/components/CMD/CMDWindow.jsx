import React, { useState, useEffect, useRef } from 'react';
import Window from '../Window';
import '../../styles/cmdwindow.css';

// Commands
import help from './Commands/help';

const CMDWindow = ({ id, title, onClose, position }) => {
  const initialText = [
    { input: '', output: 'System XD [Version 1.0.1]\n(c) 2024 Agares Lucas Majerski Corporation. No rights reserved.\n\n' }
  ];
  const [commands, setCommands] = useState(initialText);
  const [input, setInput] = useState('');

  const cmdOutputRef = useRef(null);

  useEffect(() => {
    if (cmdOutputRef.current) {
      cmdOutputRef.current.scrollTop = cmdOutputRef.current.scrollHeight;
    }
  }, [commands]);

  const handleCommand = () => {
    let output;
    switch (input.toLowerCase()) {
      case 'help':
        output = help();
        break;
      case 'cls':
        setCommands(initialText);
        setInput('');
        return;
      case 'date':
        output = new Date().toString();
        break;
      default:
        output = `Unknown command: ${input}`;
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

  return (
    <Window id={id} title={title} onClose={onClose} position={position} className="cmd-window">
      <div className="cmd-output" ref={cmdOutputRef}>
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
          autoFocus
        />
      </div>
    </Window>
  );
};

export default CMDWindow;
