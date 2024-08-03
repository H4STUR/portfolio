import React, { useState } from 'react';
import Window from '../Window';

import keyImg from '../../assets/images/Icons/HD/Key.png';

const PasswordPrompt = ({ id, title, onClose, onSubmit, position }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit(password);
  };

  return (
    <Window id={id} title="Password" onClose={onClose} position={position} className="window password-prompt">
      <div className="password-prompt-content">
        <div className="password-prompt-img">
            <img src={keyImg} alt="CMD"/>
        </div>
        <div className="password-prompt-title">
            <p>Folder '{title}' is password protected. Please enter the password in the box below.</p>
            <span>Password: </span>
            <input
                className='input-password'
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <div className="password-prompt-buttons">
            <button onClick={handleSubmit}>OK</button>
            <button onClick={() => onClose(id)}>Cancel</button>
        </div>
      </div>
    </Window>
  );
};

export default PasswordPrompt;
