import React from "react";
import "./App.css";
import Square from "./Components/Square/Square";

const renderFrom = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const App = () => {
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
          {renderFrom.map((arr) =>
            arr.map((e) => {
              return <Square />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
