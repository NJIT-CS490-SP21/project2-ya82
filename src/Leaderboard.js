import React from 'react';
import PropTypes from 'prop-types';
import './Leaderboard.css';

export default function RenderLeaderboard({ leaderboard, currentUser }) {
  return (
    <table>
      <thead>
        <tr>
          <th colSpan="2">Leaderboard</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.players.map((player, index) => (
          <tr>
            {player === currentUser ? <td className="currentUser">{player}</td> : <td>{player}</td>}
            <td>{leaderboard.scores[index]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

RenderLeaderboard.propTypes = {
  leaderboard: PropTypes.shape({
    players: PropTypes.arrayOf(PropTypes.string),
    scores: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  currentUser: PropTypes.string.isRequired,
};
