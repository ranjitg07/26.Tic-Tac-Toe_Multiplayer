import React, { useState } from "react";
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
          {gameState.map((arr) =>
            arr.map((e) => {
              return <Square
                currentPlayer = {currentPlayer}
                setCurrentPlayer = {setCurrentPlayer}
                setGameState = {setGameState}
                id = {e} 
                key = {e} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
