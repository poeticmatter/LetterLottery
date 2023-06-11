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
  //word list
  const [wordList, setWordList] = useState([]); // Array of words
  // Initial game state
  const [lettersPool, setLettersPool] = useState(() =>
    generateRandomLetters(40)
  );
  const [currentLetters, setCurrentLetters] = useState([]); // Array of currently used letters
  const [totalScore, setTotalScore] = useState(0); // Total score
  const [wordCount, setWordCount] = useState(0); // Counter for scored words
  const [currentWord, setCurrentWord] = useState("");

  // Helper function to generate a random order of letters
  function generateRandomLetters(letterCount) {
    const letterFrequency = [
      ["A", 8.167],
      ["B", 1.492],
      ["C", 2.782],
      ["D", 4.253],
      ["E", 12.702],
      ["F", 2.228],
      ["G", 2.015],
      ["H", 6.094],
      ["I", 6.966],
      ["J", 0.153],
      ["K", 0.772],
      ["L", 4.025],
      ["M", 2.406],
      ["N", 6.749],
      ["O", 7.507],
      ["P", 1.929],
      ["Q", 0.095],
      ["R", 5.987],
      ["S", 6.327],
      ["T", 9.056],
      ["U", 2.758],
      ["V", 0.978],
      ["W", 2.36],
      ["X", 0.15],
      ["Y", 1.974],
      ["Z", 0.074],
    ];
    //create an array of size letterCount
    const letters = [];
    for (let i = 0; i < letterCount; i++) {
      //pick a random letter based on letterFrequency
      const random = Math.random() * 100;
      let sum = 0;
      for (const [letter, frequency] of letterFrequency) {
        sum += frequency;
        if (random < sum) {
          letters.push(letter);
          break;
        }
      }
    }
    //shuffle the array
    const randomLetters = [];
    while (letters.length > 0) {
      const randomIndex = Math.floor(Math.random() * letters.length);
      const randomLetter = letters.splice(randomIndex, 1)[0];
      randomLetters.push(randomLetter);
    }
    //print the array
    console.log(randomLetters);
    return randomLetters;
  }

  const handleKeyboardKeyPress = (key) => {
    console.log("Key Pressed:", key); // Add this console.log statement
    console.log("Current word before update:", currentWord);
    if (key === "Enter") {
      handleWordSubmission();
    } else if (key === "Backspace") {
      // Remove the last letter from currentWord
      setCurrentWord((prevWord) => prevWord.slice(0, -1));
    } else {
      // Add the key to currentWord
      setCurrentWord((prevWord) => prevWord + key);
    }
    console.log("Current word after update:", currentWord);
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
    return [];
  };

  const handleBust = () => {
    // Remove all but the last letter from currentLetters
    const lastLetter = currentLetters[currentLetters.length - 1];
    const lettersToDraw = Math.min(2, lettersPool.length);
    const drawnLetters = drawLetters(lettersToDraw);
    setCurrentLetters([...lastLetter, ...drawnLetters]); // Move the letters to the currentLetters array
  };

  const handleWordSubmission = async () => {
    console.log("Word submitted:", currentWord, "."); // Log that the word was submitted
    const isValidWord = await checkIfValidWord(currentWord);

    if (!isValidWord) {
      console.log("Word invalid"); // Log that the word is invalid
      return;
    } else if (!containsAllLetters(currentWord, currentLetters)) {
      console.log("Word does not contain all letters"); // Log that the word does not contain all letters
    } else {
      console.log("Word valid"); // Log that the word is valid

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
      setCurrentWord("");
    }
  };
  // Get wordlist and check if the word is in it
  const checkIfValidWord = async (word) => {
    const words = await getWordList();
    return words.includes(word.toLowerCase());
  };

  // Check if the word contains all letters
  const containsAllLetters = (word, letters) => {
    const wordSet = new Set(word);
    for (const letter of letters) {
      //if letter is not in word, return false
      if (!wordSet.has(letter)) {
        return false;
      } else {
        //remove letter from wordSet
        wordSet.delete(letter);
      }
      return true;
    }
  };

  const fetchWordList = async () => {
    const response = await fetch("wordlist.txt");
    const text = await response.text();
    const wordList = text.split("\n").map((word) => word.trim());
    return wordList;
  };

  // If wordlist is empty, fetch it. Otherwise return.
  const getWordList = async () => {
    if (wordList.length > 0) {
      return wordList;
    } else {
      const wordList = await fetchWordList();
      setWordList(wordList);
      return wordList;
    }
  };

  // useEffect hook to call fillLetters() after the app initializes
  useEffect(() => {
    fillLetters();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toUpperCase();
      const validKeys = /^[a-zA-Z]$/; // Regular expression to match letters
      const isLetter = validKeys.test(key);
      const isEnter = event.keyCode === 13;
      const isBackspace = event.keyCode === 8;

      if (isLetter || isEnter || isBackspace) {
        const processedKey = isBackspace
          ? "Backspace"
          : isEnter
          ? "Enter"
          : key;

        handleKeyboardKeyPress(processedKey);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentWord]);

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
        </div>
        <div className="centered-content">
          <Keyboard onKeyPress={handleKeyboardKeyPress} />
        </div>
      </div>
    </div>
  );
};

export default App;
