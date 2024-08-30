// Help.jsx
import React from 'react';

const Help = () => {
  return (
    <div className="help-container">
        <p>
            Really? You don't know how to play the Minesweeper?<br></br>
            Seriously?...<br></br>
        </p>
      <h2>How to Play Minesweeper</h2>
      <ul>
        <li>Click on a cell to reveal it.</li>
        <li>Right-click to flag a cell as a mine.</li>
        <li>Double-click on a revealed cell to reveal its neighbors if it has the correct number of flagged neighbors.</li>
        <li>The goal is to reveal all cells without mines and flag all cells that contain mines.</li>
        <li>Use the numbers on revealed cells to figure out where mines are located.</li>
        <li>Win the game by revealing all non-mine cells or lose by revealing a mine.</li>
      </ul>
    </div>
  );
};

export default Help;
