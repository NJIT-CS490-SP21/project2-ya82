import React from 'react';
import './Board.css';
import { RenderSquare } from './Square.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export function RenderBoard(props) {
    const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
    
    function onClickBoard(index) {
        socket.emit('move', { index: index });
        setBoard(prevBoard => {
            const newBoard = [...prevBoard];
            newBoard[index] = 'X';
            return newBoard;
        });
    }
    
    useEffect(() => {
        socket.on('move', (data) => {
            setBoard(prevBoard => {
                const newBoard = [...prevBoard];
                newBoard[data.index] = 'X';
                return newBoard;
            });
        });
    }, []);
    
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

