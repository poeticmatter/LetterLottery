/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import Header from "./Header";
import LetterPool from "./LetterPool";
import Score from "./Score";
import LetterRow from "./LetterRow";
import Word from "./Word";
import Keyboard from "./Keyboard";
import "./styles.css";
import "./keyboard.css";

const App = () => {
  // Initial game state
  const [lettersPool, setLettersPool] = useState(generateRandomLetters(24)); // Array of letters in the pool
  const [currentLetters, setCurrentLetters] = useState([]); // Array of currently used letters
  const [totalScore, setTotalScore] = useState(0); // Total score
  const [wordCount, setWordCount] = useState(0); // Counter for scored words
  const [currentWord, setCurrentWord] = useState("");

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

  const handleKeyboardKeyPress = (key) => {
    if (key === "Enter") {
      handleWordSubmission();
    } else if (key === "Backspace") {
      // Remove the last letter from currentWord
      setCurrentWord((prevWord) => prevWord.slice(0, -1));
    } else {
      // Add the key to currentWord
      setCurrentWord((prevWord) => prevWord + key);
    }
  };

  // Function to handle letter selection
  const handleDraw = () => {
    const drawnLetters = drawLetters(1);
    setCurrentLetters([...currentLetters, ...drawnLetters]); // Move the letters to the currentLetters array
  };

  const fillLetters = () => {
    if (lettersPool.length > 0 && currentLetters.length < 3) {
      const lettersToDraw = Math.min(
        3 - currentLetters.length,
        lettersPool.length
      );
      const drawnLetters = drawLetters(lettersToDraw);
      setCurrentLetters([...currentLetters, ...drawnLetters]); // Move the letters to the currentLetters array
    }
  };

  const drawLetters = (count) => {
    if (lettersPool.length >= count) {
      const lettersToDraw = lettersPool.slice(0, count); // Get the first 'count' letters from the lettersPool
      setLettersPool(lettersPool.slice(count)); // Remove the first 'count' letters from the lettersPool
      return lettersToDraw; //Return the drawn letters, the method calling it will need to setCurrentLetters()
    }
  };

  const handleBust = () => {
    // Remove all but the last letter from currentLetters
    const lastLetter = currentLetters[currentLetters.length - 1];
    const lettersToDraw = Math.min(2, lettersPool.length);
    const drawnLetters = drawLetters(lettersToDraw);
    setCurrentLetters([...lastLetter, ...drawnLetters]); // Move the letters to the currentLetters array
  };

  const handleWordSubmission = async () => {
    const isValidWord = await checkIfValidWord(currentWord);

    if (!isValidWord) {
      return;
    } else if (!containsAllLetters(currentWord, currentLetters)) {
      // Handle case when word is valid but doesn't contain all letters
      // Update the UI to display the missing letters in red
      console.log("Word does not contain all letters");
    } else {
      // Calculate word score based on the formula
      const wordScore =
        Math.pow(currentLetters.length, 2) +
        (currentLetters.length - currentWord.length);

      // Update the total score and word count
      setTotalScore((prevScore) => prevScore + wordScore);
      setWordCount((prevCount) => prevCount + 1);

      const lettersToDraw = Math.min(3, lettersPool.length);
      const drawnLetters = drawLetters(lettersToDraw);
      setCurrentLetters([...drawnLetters]);
    }
  };

  const checkIfValidWord = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const data = await response.json();
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error("Error checking word validity:", error);
      return false;
    }
  };

  const containsAllLetters = (word, letters) => {
    const wordLetters = word.split("");
    return wordLetters.every((letter) => letters.includes(letter));
  };

  // useEffect hook to call fillLetters() after the app initializes
  useEffect(() => {
    fillLetters();
  }, []);

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
          <Word text={currentWord} wordScore={8} />
        </div>
        <div className="centered-content">
          <button className="keyboard-button draw" onClick={handleDraw}>
            Draw
          </button>
          <button className="keyboard-button bust" onClick={handleBust}>
            Bust
          </button>
          <button
            className="keyboard-button draw"
            onClick={() => handleWordSubmission(currentWord)}
          >
            Submit
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
