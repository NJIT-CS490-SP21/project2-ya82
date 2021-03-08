import logo from './logo.svg';
import './App.css';
import { RenderBoard } from './Board.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  const [userList, setUserList] = useState({"X": "", "O":"", "Spectators":[]});
  const loginRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  function updateUsers(user) {
    const newList = {...userList};
    if (newList.X === "") {
      newList.X = user;
    }
    else if (newList.O === "") {
      newList.O = user;
    }
    else {
      newList.Spectators = [...newList.Spectators, user];
    }
    socket.emit('login', {newUsers: newList});
    setLoggedIn(prevState => !prevState);
  }
  
  useEffect(() => {
    socket.on('login', (data) => {
      setUserList(data.newUsers);
    });
  }, []);
  
  return (
    <div>
      {loggedIn === false ? (
      <div>
        <input ref={loginRef} type="text" />
        <button onClick={() => updateUsers(loginRef.current.value)}>Login</button>
      </div>
      ) : (
      <div>
        <RenderBoard />
      </div>
      )}
    </div>
  );
}

export default App;
