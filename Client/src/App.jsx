import React, { useEffect, useState } from "react";
import "./App.css";
import Square from "./Components/Square/Square";
import Tic from './assets/t-logo.png';
import Loader from '../src/assets/loader1.gif'
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {

  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState('circle');
  const [finishedState, setFinisedState] = useState(false);
  const [finishedArrayState, setFinisedArrayState] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playingAs, setPlayingAs] = useState(null);


  const checkWinner = () => {
    // Row Dynamic
    for(let row = 0; row < gameState.length; row++) {
      if(gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
        // bg-color change for row winner
        setFinisedArrayState([row * 3 + 0, row * 3 + 1, row * 3 + 2]);
        return gameState[row][0]
      }
    }
    // Column Dynamic
    for(let col = 0; col < gameState.length; col++) {
      if(gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
        // bg-color change for column winner
        setFinisedArrayState([0 * 3 + col, 1 * 3 + col, 2 * 3 + col]);
        return gameState[0][col]
      }
    }

    // Diagonal left Winner
    if(gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]) {
      // bg-color change for d-left winner
      setFinisedArrayState([0, 4, 8]);
      return gameState[0][0];
    }

    // Diagonal Right Winner
    if(gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]) {
      // bg-color change for d-right winner
      setFinisedArrayState([2, 4, 6]);
      return gameState[0][2];
    }

    const isDraw = gameState.flat().every(e => {
      if(e === 'circle' || e === 'cross') return true;
    })

    if(isDraw) return "draw";

    return null;
  }

  useEffect(() => {
    const winner = checkWinner();
    if(winner){
      setFinisedState(winner);
    }
  }, [gameState]);

  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write your name to enter the game!";
        }
      }
    });
    return result;
  }

  socket?.on("opponentLeftMatch", () =>{
    alert("Opponent Left The Match")
    setFinisedState = ("opponentLeftMatch");

  })

  socket?.on("playerMoveFromServer", (data) => {
    const id = data.state.id;
    setGameState((prevState) => {
      let newState = [...prevState];
        const rowIndex = Math.floor(id / 3);
        const colIndex = id % 3;
        newState[rowIndex][colIndex] = data.state.sign;
        return newState;
    });
    setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
  });

  socket?.on("connect", function () {
    setPlayOnline(true);
  });

  socket?.on("OpponentNotFound", function () {
    setOpponentName(false);
  });

  socket?.on("OpponentFound", function (data) {
    setPlayingAs(data.playingAs);
    setOpponentName(data.opponentName);
  });

  
  async function playOnlineClick() {
    const result = await takePlayerName();
    if(!result.isConfirmed){
      return;
    }
    
    const username = result.value;
    setPlayerName(username);
    
    const newSocket = io ("http://localhost:3000",{
      autoConnect: true
    });
    newSocket?.emit("request_to_play", {
      playerName: username,
    })
    
    setSocket(newSocket);
  }

  // Play Online Screen
  if(!playOnline){
    return ( <div className="main-div">
      <img className="tic-logo" src={Tic} alt="Tic-Tac-Toe Logo" />
      <h1 className="heading1">Tic Tac Toe Multiplayer Game</h1>
      <button onClick={playOnlineClick} className="play-btn color1">Play Online</button>
    </div>
    );
  }
  //--------------------

  if (playOnline && !opponentName) {
    return (
      <div className="waiting">
        <p>Waiting for opponent ...</p>
        <img src={Loader} className="loading-gif" allowFullScreen></img>
      </div>
    );
  }
  

  return (
    <div className="main-div">
      <div className="move-detection">
          <div className={`left ${currentPlayer === playingAs ? "current-move-" + currentPlayer : ''}`}>{playerName}</div>
          <div className="vs">VS</div>
          <div className={`right ${currentPlayer !== playingAs ? "current-move-" + currentPlayer : ''}`}>{opponentName}</div>
        </div>
      <div>
        <h1 className="game-heading bg-style">Tic Tac Toe</h1>

        <div className="square-wrapper">
          {gameState.map((arr, rowIndex) =>
            arr.map((e, colIndex) => {
              return <Square
                socket = { socket }
                playingAs = {playingAs }
                gameState = { gameState }
                finishedArrayState = {finishedArrayState}
                finishedState = {finishedState}
                currentPlayer = {currentPlayer}
                setCurrentPlayer = {setCurrentPlayer}
                setGameState = {setGameState}
                id = {rowIndex * 3 + colIndex} 
                key = {rowIndex * 3 + colIndex} />;
                currentElement = {e}
            })
          )}
        </div>

        {/* Winner Message */}
        { finishedState && finishedState !== 'opponentLeftMatch' && finishedState !== "draw" && (
          <h3 className="winner-msg">
            {finishedState === playingAs ? "You " : finishedState} Won 🎉
            </h3>
        )}

        {/* Draw Message */}
        { finishedState && finishedState !== 'opponentLeftMatch' && finishedState === "draw" && (
          <h3 className="draw-msg">It's a Draw 🤔</h3>
        )} 
      </div>
        { !finishedState && opponentName && (
          <h2>You are playing against {opponentName}👀</h2>
        )}
        { finishedState && finishedState === 'opponentLeftMatch' && (
          <h2>You won, Opponent has left</h2>
        )}
    </div>
  );
};

export default App;
