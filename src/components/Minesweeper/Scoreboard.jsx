// Scoreboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Scoreboard = () => {
  const [scores, setScores] = useState({ Easy: [], Medium: [], Hard: [] }); // Initialize scores as an object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch scores from the API when the component mounts
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await axios.get('http://localhost:8005/api/scores');
        setScores(response.data); // Set scores as the received object (expected: { Easy: [], Medium: [], Hard: [] })
        setLoading(false);
      } catch (error) {
        console.error('Error fetching scores:', error);
        setError('Failed to fetch scores');
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Ensure scores are accessed correctly based on the difficulty
  const getTopScores = (difficulty) => {
    return scores[difficulty] || []; // Access scores by difficulty, return empty array if undefined
  };

  return (
    <div className="scoreboard help-container">
      <h2>Scoreboard</h2>

      {/* Hard Section */}
      <section>
        <h3>Top 10 Hard Players</h3>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {getTopScores('Hard').map((score, index) => (
              <tr key={index}>
                <td>{index + 1}. {score.player_name}</td>
                <td>{score.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Medium Section */}
      <section>
        <h3>Top 10 Medium Players</h3>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {getTopScores('Medium').map((score, index) => (
              <tr key={index}>
                <td>{index + 1}. {score.player_name}</td>
                <td>{score.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Easy Section */}
      <section>
        <h3>Top 10 Easy Players</h3>
        <table>
          <thead>
            <tr>
              <th>Player</th>
              <th>Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {getTopScores('Easy').map((score, index) => (
              <tr key={index}>
                <td>{index + 1}. {score.player_name}</td>
                <td>{score.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
};

export default Scoreboard;
