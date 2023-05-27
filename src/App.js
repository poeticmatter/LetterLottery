import React from "react";
import Header from "./Header";
import LetterPool from "./LetterPool";
import Score from "./Score";
import LetterRow from "./LetterRow";
import "./styles.css";

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="game-info">
          <LetterPool count={24} />
          <Score totalScore={52} currentScore={7} />
        </div>
        <div className="letters-row-container">
          <LetterRow letters={["A", "C", "G"]} />
        </div>
      </div>
    </div>
  );
};

export default App;
