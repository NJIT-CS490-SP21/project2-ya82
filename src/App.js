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
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([null, null]);
  
  function onClickSquare(square_index) {
      socket.emit('move', square_index);
      setBoard(prevBoard => {
          const newBoard = [...prevBoard];
          if (username === userList[0]) {
            newBoard[square_index] = 'X';
          }
          else if (username === userList[1]) {
            newBoard[square_index] = 'O';
          }
          return newBoard;
      });
  }
  
  function onLogin() {
    console.log('Username:');
    console.log(username);
    socket.emit('login', username);
    setLogin(previsLoggedIn => {
      return true;
    });
  }
  
  useEffect(() => {
    // Listening for a chat event emitted by the server. If received, we
    // run the code in the function that is passed in as the second arg
    socket.on('userList', (data) => {
      console.log('User list received!');
      console.log(data);
      var userListLengthTracker = userList.length;
      while (data.length > userListLengthTracker){
            setUserList(prevList => [...prevList, null]);
            userListLengthTracker = userListLengthTracker + 1;
          }
          
      setUserList(prevList => {
        const newList = [...prevList];
        for (var i = 0; i < data.length; i++) {
          newList[i] = data[i];
        }
        return newList;
      });
    });
  }, []);
  
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
          
          if (username === userList[0]) {
            newBoard[data] = 'O';
          }
          
          else if (username === userList[1]) {
            newBoard[data] = 'X';
          }
          
          return newBoard;
      });
    });
  }, [username, userList]);
  
  
  return (
    <div>
      {isLoggedIn === false ?(
        <div>
          <form>
            <label>
            Please enter your username <br></br>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
            <button onClick={() => {onLogin()}}> Login </button>
            </label>
          </form>
        </div>
      ) : (
        <div>
          <p> Welcome {username}! </p>
          <div class="board">
            <Board onClick={onClickSquare} board={board} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
