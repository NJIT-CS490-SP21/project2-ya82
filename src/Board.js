import React from 'react';
import './Board.css';
import { RenderSquare } from './Square.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export function RenderBoard(props) {
    const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
    const [isXNext, setIsXNext] = useState(true);
    const [showRestartButton, setRestartButton] = useState(false);
    const [winner, setWinner] = useState("");
    
    function calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }
    
    function onClickBoard(index) {
        if (props.currentUser === props.userList.X || props.currentUser === props.userList.O) {
            const newBoard = [...board];
            if (isXNext === true) {
                newBoard[index] = 'X';
            }
            else {
                newBoard[index] = 'O';
            }
            
            socket.emit('move', {updateBoard: newBoard, XNext: !isXNext});
            const winnerCheck = calculateWinner(board);
            if (winnerCheck === 'X') {
                setWinner(props.userList.X);
                setRestartButton(true);
            }
            
            else if (winnerCheck === 'O') {
                setWinner(props.userList.O);
                setRestartButton(true);
            }
            
            else if (winnerCheck === "" && !board.includes(null)) {
                setWinner("Draw!");
                setRestartButton(true);
            }
        }
    }
    
    function onClickRestart() {
        setRestartButton(false);
        const emptyBoard = [null, null, null, null, null, null, null, null, null];
        socket.emit('restart', {updateBoard: emptyBoard});
    }
    
    useEffect(() => {
        socket.on('move', (data) => {
            setBoard(data.updateBoard);
            setIsXNext(data.XNext);
        });
        
        socket.on('restart', (data) => {
            setBoard(data.updateBoard);
            setIsXNext(true);
        });
    }, []);
    
    return (
      <div>
        {showRestartButton === true ? (
          <div>
            <button onClick={onClickRestart}>Restart</button>
           </div>
        ) : (
          <div></div>
        )}
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
      </div>
    );
}

