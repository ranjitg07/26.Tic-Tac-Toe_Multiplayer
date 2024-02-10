import React, { useEffect, useState } from "react";
import "./App.css";
import Square from "./Components/Square/Square";


const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {

  const [gameState, setGameState] = useState(renderFrom);
  const [currentPlayer, setCurrentPlayer] = useState('circle');
  const [finishedState, setFinisedState] = useState(false);

  const checkWinner = () => {
    // Row Dynamic
    for(let row = 0; row < gameState.length; row++) {
      if(gameState[row][0] === gameState[row][1] && gameState[row][1] === gameState[row][2]) {
        return gameState[row][0]
      }
    }
    // Column Dynamic
    for(let col = 0; col < gameState.length; col++) {
      if(gameState[0][col] === gameState[1][col] && gameState[1][col] === gameState[2][col]) {
        return gameState[0][col]
      }
    }

    // Diagonal left Winner
    if(gameState[0][0] === gameState[1][1] && gameState[1][1] === gameState[2][2]){
      return gameState[0][0];
    }

    // Diagonal Right Winner
    if(gameState[0][2] === gameState[1][1] && gameState[1][1] === gameState[2][0]){
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

  return (
    <div className="main-div">
      <div className="move-detection">
          <div className="left">Yoursel</div>
          <div className="vs">VS</div>
          <div className="right">Opponent</div>
        </div>
      <div>
        <h1 className="game-heading bg-style">Tic Tac Toe</h1>

        <div className="square-wrapper">
          {gameState.map((arr, rowIndex) =>
            arr.map((e, colIndex) => {
              return <Square
                finishedState = {finishedState}
                currentPlayer = {currentPlayer}
                setCurrentPlayer = {setCurrentPlayer}
                setGameState = {setGameState}
                id = {rowIndex * 3 + colIndex} 
                key = {rowIndex * 3 + colIndex} />;
            })
          )}
        </div>

        {/* Winner Message */}
        { finishedState && finishedState !== "draw" && (
          <h3 className="winner-msg">{finishedState} Won 🎉</h3>
        )}

        {/* Draw Message */}
        { finishedState && finishedState === "draw" && (
          <h3 className="draw-msg">It's a Draw 🤔</h3>
        )}
        
      </div>
    </div>
  );
};

export default App;
