// Scoreboard.jsx
import React from 'react';

const Scoreboard = () => {
  // Example scores; replace with dynamic data as needed
  const scores = [
    { name: 'Player 1', time: 30, difficulty: 'Easy' },
    { name: 'Player 2', time: 45, difficulty: 'Medium' },
    { name: 'Player 3', time: 60, difficulty: 'Hard' },
  ];

  return (
    <div className="scoreboard">
      <h2>Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Time (s)</th>
            <th>Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <td>{score.name}</td>
              <td>{score.time}</td>
              <td>{score.difficulty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;
