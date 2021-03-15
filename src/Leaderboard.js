import React from 'react';
import './Leaderboard.css';

export function RenderLeaderboard(props) {
  return (
    <table>
      <thead>
        <tr>
          <th colspan="2">Leaderboard</th>
        </tr>
      </thead>
      <tbody>
        {props.leaderboard.players.map((player, index) => (
          <tr>
            {player === props.currentUser ? (
              <td class="currentUser"> {player} </td>
            ) : (
              <td> {player} </td>
            )}
            <td> {props.leaderboard.scores[index]} </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
