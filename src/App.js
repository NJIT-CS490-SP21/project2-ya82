import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import RenderBoard from './Board';
import ListUsers from './ListUsers';
import RenderLeaderboard from './Leaderboard';

const socket = io();

function App() {
  const [userList, setUserList] = useState({ X: '', O: '', Spectators: [] });
  const loginRef = useRef(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboard, setLeaderboard] = useState({});

  function updateUsers(user) {
    if (user !== '') {
      const newList = { ...userList };
      if (newList.X === '') {
        newList.X = user;
      } else if (newList.O === '') {
        newList.O = user;
      } else {
        newList.Spectators = [...newList.Spectators, user];
      }
      socket.emit('login', { newUsers: newList, currentUser: user });
      setCurrentUser(user);
      setLoggedIn((prevState) => !prevState);
    }
  }

  function onClickLeaderboard() {
    setShowLeaderboard((prevShowLeaderboard) => !prevShowLeaderboard);
  }

  useEffect(() => {
    socket.on('login', (data) => {
      setUserList(data.newUsers);
    });

    socket.on('updateLeaderboard', (data) => {
      setLeaderboard(data);
    });
  }, []);

  return (
    <div>
      {loggedIn === false ? (
        <div>
          <input ref={loginRef} type="text" />
          <button type="button" onClick={() => updateUsers(loginRef.current.value)}>
            Login
          </button>
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
              {userList.Spectators.map((user) => (
                <ListUsers name={user} />
              ))}
            </ul>
          </div>

          <div>
            {showLeaderboard === false ? (
              <div>
                <button type="button" onClick={onClickLeaderboard}>
                  Show Leaderboard
                </button>
              </div>
            ) : (
              <div>
                <button type="button" onClick={onClickLeaderboard}>
                  Hide Leaderboard
                </button>
                <RenderLeaderboard leaderboard={leaderboard} currentUser={currentUser} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
