import logo from './logo.svg';
import './App.css';
import './Board.css';
import { Board } from './Board.js';
import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
  const [isLoggedIn, setLogin] = useState(false);
  
  function onClickSquare(square_index) {
      socket.emit('move', square_index);
      setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[square_index] = 'X';
          return newBoard;
      });
  }
  
  function onLogin() {
    setLogin(previsLoggedIn => {
      return true;
    });
  }
  
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('move', (data) => {
      console.log('Player move received!');
      console.log(data);
      // If the server sends a message (on behalf of another client), then we
      // add it to the list of messages to render it on the UI.
      setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          newBoard[data] = 'X';
          return newBoard;
      });
    });
  }, []);
  
  
  return (
    <div>
      {isLoggedIn === false ?(
        <div>
          Please enter your username<br></br>
          <input type="text" />
          <button onClick={() => {onLogin();}}> Login </button>
        </div>
      ) : (
        <div class="board">
          <Board onClick={onClickSquare} board={board} />
        </div>
      )}
    </div>
  );
}

export default App;
