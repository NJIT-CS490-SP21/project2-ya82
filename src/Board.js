import React from 'react';
import './Board.css';
import { RenderSquare } from './Square.js';
import { useState } from 'react';

export function RenderBoard(props) {
    const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
    
    function onClickBoard(index) {
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[index] = 'X';
            return newBoard;
        });
    }
    
    return (
      <div class="board">
        <RenderSquare clickHandler={() => onClickBoard(0)} letter={board[0]} />
        <RenderSquare clickHandler={() => onClickBoard(1)} letter={board[1]} />
        <RenderSquare clickHandler={() => onClickBoard(2)} letter={board[2]} />
        <RenderSquare clickHandler={() => onClickBoard(3)} letter={board[3]} />
        <RenderSquare clickHandler={() => onClickBoard(4)} letter={board[4]} />
        <RenderSquare clickHandler={() => onClickBoard(5)} letter={board[5]} />
        <RenderSquare clickHandler={() => onClickBoard(6)} letter={board[6]} />
        <RenderSquare clickHandler={() => onClickBoard(7)} letter={board[7]} />
        <RenderSquare clickHandler={() => onClickBoard(8)} letter={board[8]} />
      </div>
    );
}

