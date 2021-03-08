import logo from './logo.svg';
import './App.css';
import { RenderBoard } from './Board.js';
import { ListUsers } from './ListUsers.js';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io();

function App() {
  const [userList, setUserList] = useState({"X": "", "O":"", "Spectators":[]});
  const loginRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("")
  
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
    setCurrentUser(user);
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
        <div>
          <RenderBoard currentUser={currentUser} userList={userList} />
        </div>
        
        <div>
          <p> Player X </p>
          <ul>
            <ListUsers name={userList.X} />
          </ul>
          
          <p> Player O </p>
          <ul>
            <ListUsers name={userList.O} />
          </ul>
          
          <p> Spectators </p>
          <ul>
            {userList.Spectators.map(user => <ListUsers name={user} />)}
          </ul>
        </div>
        
      </div>
      )}
    </div>
  );
}

export default App;
