import React from 'react';
import './Board.css';
import { RenderSquare } from './Square.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

export function RenderBoard(props) {
    const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
    const [isXNext, setIsXNext] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState("");
    const [showRestartButton, setRestartButton] = useState(false);
    
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
    
    function checkWinner(boardCopy) {
        const winnerCheck = calculateWinner(boardCopy);
        if (winnerCheck === 'X') {
            socket.emit('gameOver', {winner: props.userList.X, loser: props.userList.O});
        }
        
        else if (winnerCheck === 'O') {
            socket.emit('gameOver', {winner: props.userList.O, loser: props.userList.X});
        }
        
        else if (winnerCheck === null && !boardCopy.includes(null)) {
            console.log('Draw detected');
            socket.emit('gameOver', {winner: "Draw!"});
        }
    }
    
    function onClickBoard(index) {
        if ((props.currentUser === props.userList.X || props.currentUser === props.userList.O) && gameOver === false) {
            setRestartButton(true);
            const newBoard = [...board];
            if (isXNext === true) {
                newBoard[index] = 'X';
            }
            else {
                newBoard[index] = 'O';
            }
            socket.emit('move', {updateBoard: newBoard, XNext: !isXNext});
            checkWinner(newBoard);
        }
    }
    
    function onClickRestart() {
        const emptyBoard = [null, null, null, null, null, null, null, null, null];
        socket.emit('restart', {updateBoard: emptyBoard});
    }
    
    useEffect(() => {
        socket.on('move', (data) => {
            setBoard(data.updateBoard);
            setIsXNext(data.XNext);
        });
        
        socket.on('gameOver', (data) => {
            setGameOver(true);
            setWinner(data.winner);
        });
        
        socket.on('restart', (data) => {
            setGameOver(false);
            setBoard(data.updateBoard);
            setIsXNext(true);
            setWinner("");
        });
    }, []);
    
    return (
      <div>
        {gameOver === true ? (
          <div>
            <p> Game Over! </p>
            <div>
              {winner === "Draw!" ? (
                <p> Draw! </p>
              ) : (
                <p> {winner} wins! </p>
              )}
            </div>
            <div>
              {showRestartButton === true ? (
                <button onClick={onClickRestart}>Restart</button>
              ) : (
                <div></div>
              )}
            </div>
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

