import React from "react";
import Header from "./Header";
import LetterPool from "./LetterPool";
import Score from "./Score";
import LetterRow from "./LetterRow";
import Word from "./Word";
import Keyboard from "./Keyboard";
import "./styles.css";
import "./keyboard.css";

const handleKeyboardKeyPress = (key) => {
  // Handle the key press event
};

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="centered-content">
          <LetterPool count={24} />
          <Score totalScore={52} currentScore={7} />
        </div>
        <div className="centered-content">
          <LetterRow letters={["A", "C", "G"]} />
        </div>
        <div className="centered-content">
          <Word text="Cage" wordScore={8} />
        </div>
        <div className="centered-content">
          <button className="keyboard-button draw">Draw</button>
          <button className="keyboard-button bust">Bust</button>
        </div>
        <div className="centered-content">
          <Keyboard onKeyPress={handleKeyboardKeyPress} />
        </div>
      </div>
    </div>
  );
};

export default App;
