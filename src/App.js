import "./App.css";
import "./Board.css";
import "./Leaderboard.css";
import { Board } from "./Board.js";
import { useState, useEffect } from "react";
import io from "socket.io-client";
import { ListItem } from "./ListItem.js";

const socket = io();

function App() {
  const [board, setBoard] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [isLoggedIn, setLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [userList, setUserList] = useState([null, null]);
  const [showLeaderboard, setLeaderboard] = useState(false);

  function onClickSquare(square_index) {
    socket.emit("move", square_index);
    console.log("Move sent");
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      if (username === userList[0]) {
        newBoard[square_index] = "X";
      } else if (username === userList[1]) {
        newBoard[square_index] = "O";
      }
      return newBoard;
    });
  }

  function winCondition(tileLetter) {
    if (
      board[6] === tileLetter &&
      board[7] === tileLetter &&
      board[8] === tileLetter
    ) {
      return true;
    }

    if (
      board[3] === tileLetter &&
      board[4] === tileLetter &&
      board[5] === tileLetter
    ) {
      return true;
    }

    if (
      board[0] === tileLetter &&
      board[1] === tileLetter &&
      board[2] === tileLetter
    ) {
      return true;
    }

    if (
      board[6] === tileLetter &&
      board[3] === tileLetter &&
      board[0] === tileLetter
    ) {
      return true;
    }

    if (
      board[7] === tileLetter &&
      board[4] === tileLetter &&
      board[1] === tileLetter
    ) {
      return true;
    }

    if (
      board[8] === tileLetter &&
      board[5] === tileLetter &&
      board[2] === tileLetter
    ) {
      return true;
    }

    if (
      board[6] === tileLetter &&
      board[4] === tileLetter &&
      board[2] === tileLetter
    ) {
      return true;
    }

    if (
      board[8] === tileLetter &&
      board[4] === tileLetter &&
      board[0] === tileLetter
    ) {
      return true;
    }

    if (tileLetter === "draw") {
      var draw = null;
      for (var i = 0; i < board.length; i++) {
        if (board[i] === null) {
          draw = false;
        }
      }
      if (draw != false) {
        return true;
      }
    }

    return false;
  }

  function onLogin() {
    socket.emit("login", username);
    setLogin((previsLoggedIn) => {
      return true;
    });
  }
  
  function onLeaderboard() {
    setLeaderboard((prevLeaderboard) => {
      return !prevLeaderboard;
    });
  }

  function getSpectators() {
    if (userList.length > 2) {
      return userList.slice(2);
    }
    return [];
  }

  useEffect(() => {
    socket.on("userList", (data) => {
      var userListLengthTracker = userList.length;
      while (data.length > userListLengthTracker) {
        setUserList((prevList) => [...prevList, null]);
        userListLengthTracker = userListLengthTracker + 1;
      }

      setUserList((prevList) => {
        const newList = [...prevList];
        for (var i = 0; i < data.length; i++) {
          newList[i] = data[i];
        }
        return newList;
      });
    });
  }, []);

  var requestSent = false;

  useEffect(() => {
    if (requestSent === false) {
      console.log("Checking winCondition");
      console.log("Current board state", board);
      if (winCondition("X")) {
        requestSent = true;
        console.log("Player X won");
        if (
          window.confirm("Game over! " + userList[0] + " wins! Play again?")
        ) {
          socket.emit("gameOver");
          window.location.reload();
        }
      } else if (winCondition("O")) {
        requestSent = true;
        if (
          window.confirm("Game over! " + userList[1] + " wins! Play again?")
        ) {
          socket.emit("gameOver");
          window.location.reload();
        }
      } else if (winCondition("draw")) {
        requestSent = true;
        if (window.confirm("Game over! Draw! Play again?")) {
          socket.emit("gameOver");
          window.location.reload();
        }
      }
    }
  }, [board]);

  function moveReceived(data) {
    console.log("Received index", data);
    console.log("Username:", username);
    console.log("Userlist:", userList);
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];

      if (username === userList[0]) {
        newBoard[data] = "O";
      } else if (username === userList[1]) {
        newBoard[data] = "X";
      }

      return newBoard;
    });
  }

  const counter = 0;
  useEffect(() => {
    socket.on("move", (data) => {
      console.log("Move received");
      moveReceived(data);
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
        <p> Current active users: </p>
        <p> Player X: </p>
        <ListItem name={userList[0]} />
        <p> Player O: </p>
        <ListItem name={userList[1]} />
        <p> Spectator(s): </p>
        <p>
        {getSpectators().map(user => 
        <ListItem name={user} />
        )}
        </p>
        <div class="board">
            <Board onClick={onClickSquare} board={board} />
        </div>
        <div>
        {showLeaderboard === true ?(
        <div>
        <button onClick={() => {onLeaderboard()}}> Hide leaderboard </button>
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
        </div>
        ) : (
        <div>
        <button onClick={() => {onLeaderboard()}}> Show leaderboard </button>
        </div>
        )}
        </div>
    </div>
    )}
  </div>
  );
}

export default App;


