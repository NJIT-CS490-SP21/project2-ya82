import React from 'react';
import './Leaderboard.css';

export function RenderLeaderboard(props) {
    return (
        <table>
            <thead>
                <tr>
                    <th colspan="2">The table header</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>The table body</td>
                    <td>with two columns</td>
                </tr>
            </tbody>
        </table>
        
        ); 
}