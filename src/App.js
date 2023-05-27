/* eslint-disable no-undef */
import React, { useState } from "react";
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
  // Initial game state
  const [lettersPool, setLettersPool] = useState(generateRandomLetters(24)); // Array of letters in the pool
  const [currentLetters, setCurrentLetters] = useState([]); // Array of currently used letters
  const [totalScore, setTotalScore] = useState(0); // Total score
  const [wordCount, setWordCount] = useState(0); // Counter for scored words

  // Helper function to generate a random order of letters
  function generateRandomLetters(count) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const letters = alphabet.split("");
    let randomLetters = [];

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      const letter = letters.splice(randomIndex, 1)[0];
      randomLetters.push(letter);
    }

    return randomLetters;
  }

  // Function to handle letter selection
  const handleDraw = () => {
    if (lettersPool.length > 0) {
      const [letter] = lettersPool; // Get the first letter from the lettersPool
      setLettersPool(lettersPool.slice(1)); // Remove the first letter from the lettersPool
      setCurrentLetters([...currentLetters, letter]); // Move the letter to the currentLetters array
      // Update game state as needed based on the selected letter
    }
  };

  const handleBust = () => {
    // Remove all but the last letter from currentLetters
    const lastLetter = currentLetters[currentLetters.length - 1];
    setCurrentLetters([lastLetter]);

    // Add 2 new letters from lettersPool to currentLetters
    const remainingLettersCount = lettersPool.length;
    if (remainingLettersCount >= 2) {
      const newLetters = lettersPool.slice(0, 2);
      setLettersPool(lettersPool.slice(2));
      setCurrentLetters((prevLetters) => [...prevLetters, ...newLetters]);
    } else if (remainingLettersCount === 1) {
      const newLetter = lettersPool[0];
      setLettersPool([]);
      setCurrentLetters((prevLetters) => [...prevLetters, newLetter]);
    }
  };

  // Function to handle word submission
  const handleWordSubmission = (word) => {
    // Check if the submitted word is valid and update game state accordingly
    // Calculate word score, update total score and word count
  };

  return (
    <div className="app">
      <Header />
      <div className="content">
        <div className="centered-content">
          <LetterPool count={lettersPool.length} />
          <Score totalScore={totalScore} currentScore={wordCount} />
        </div>
        <div className="centered-content">
          <LetterRow letters={currentLetters} />
        </div>
        <div className="centered-content">
          <Word text="Cage" wordScore={8} />
        </div>
        <div className="centered-content">
          <button className="keyboard-button draw" onClick={handleDraw}>
            Draw
          </button>
          <button className="keyboard-button bust" onClick={handleBust}>
            Bust
          </button>
        </div>
        <div className="centered-content">
          <Keyboard onKeyPress={handleKeyboardKeyPress} />
        </div>
      </div>
    </div>
  );
};

export default App;
