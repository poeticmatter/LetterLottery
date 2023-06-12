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
  const [wordScore, setWordScore] = useState("Use all letters"); // Score for the current word

  // Helper function to generate a random order of letters
  function generateRandomLetters(letterCount) {
    const letterFrequency = [
      ["A", 8],
      ["B", 1.5],
      ["C", 2.5],
      ["D", 4],
      ["E", 12],
      ["F", 2],
      ["G", 2],
      ["H", 6],
      ["I", 7],
      ["J", 0.5],
      ["K", 0.5],
      ["L", 4],
      ["M", 2.5],
      ["N", 7],
      ["O", 7.5],
      ["P", 2],
      ["Q", 0.5],
      ["R", 6],
      ["S", 6],
      ["T", 9],
      ["U", 3],
      ["V", 1],
      ["W", 2.5],
      ["X", 0.5],
      ["Y", 2],
      ["Z", 0.5],
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

  const handleKeyboardKeyPress = async (key) => {
    console.log("Key Pressed:", key); // Add this console.log statement
    var newWord = currentWord;
    if (key === "Enter") {
      handleWordSubmission();
    } else {
      if (key === "Backspace") {
        // Remove the last letter from currentWord
        newWord = newWord.slice(0, -1);
      } else {
        // Add the key to currentWord
        newWord = newWord + key;
      }
      const wordScore = await calculateWordScore(newWord, currentLetters);
      setWordScore(wordScore);
      setCurrentWord(newWord);
    }

    console.log("Current word after update:", newWord);
  };

  // function handling draw button
  const handleDraw = (event) => {
    const drawnLetters = drawLettersWithCheck(1);
    setCurrentLetters([...currentLetters, ...drawnLetters]); // Move the letters to the currentLetters array
    event.target.blur();
  };

  const drawLettersWithCheck = (count) => {
    const lettersToDraw = Math.min(count, lettersPool.length);
    return drawLetters(lettersToDraw);
  };

  const drawLetters = (count) => {
    // Get the first 'count' letters from the lettersPool
    const drawnLetters = lettersPool.slice(0, count); // Get the first 'count' letters from the lettersPool
    // Remove the first 'count' letters from the lettersPool
    setLettersPool((prevLetters) => prevLetters.slice(count));
    return drawnLetters;
  };

  const handleBust = (event) => {
    // Remove all but the last letter from currentLetters
    const lastLetter = currentLetters[currentLetters.length - 1];
    const drawnLetters = drawLettersWithCheck(2);
    setCurrentLetters([...lastLetter, ...drawnLetters]); // Move the letters to the currentLetters array
  };

  const handleWordSubmission = async () => {
    console.log("Word submitted:", currentWord, "."); // Log that the word was submitted
    const wordScore = await calculateWordScore(currentWord, currentLetters);
    //if wordScore is smaller than or equal to 0, return.
    if (wordScore >= 0) {
      // Update the total score and word count
      setTotalScore((prevScore) => prevScore + wordScore);
      setWordCount((prevCount) => prevCount + 1);

      const drawnLetters = drawLettersWithCheck(3);
      setCurrentLetters([...drawnLetters]);
      setCurrentWord("");
    }
  };
  // Get wordlist and check if the word is in it
  const checkIfValidWord = async (word) => {
    const words = await getWordList();
    return words.includes(word.toLowerCase());
  };

  const calculateWordScore = async (word, letters) => {
    console.log("---------------------");
    console.log("Calculating score for word: ", word, "And letters: ", letters); // Log that the score is being calculated
    const isValidWord = await checkIfValidWord(word);
    if (!isValidWord) {
      console.log("Word invalid: ", word); // Log that the word is invalid
      return "Invalid Word";
    } else if (!containsAllLetters(word, letters)) {
      console.log("Word does not contain all letters: ", word); // Log that the word does not contain all letters
      return "Use all letters";
    }
    console.log("Word valid: ", word); // Log that the word is valid
    return Math.pow(letters.length, 2) + (letters.length - word.length);
  };

  // Check if the word contains all letters
  const containsAllLetters = (word, letters) => {
    //Convert word to an array of letters with duplicates
    const wordLetters = word.split("");

    for (const letter of letters) {
      console.log("Checking letter: ", letter); // Log that the letter is being checked
      //if letter is not in word, return false
      if (!wordLetters.includes(letter)) {
        console.log("Word does not contain letter: ", letter); // Log that the word does not contain the letter
        return false;
      } else {
        //remove letter from wordSet
        wordLetters.splice(wordLetters.indexOf(letter), 1);
        console.log("Word after removing letter: ", wordLetters); // Log that the word after removing the letter
      }
    }
    return true;
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
    if (currentLetters.length === 0) {
      setCurrentLetters(drawLetters(3));
    }
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
          <Word text={currentWord} wordScore={wordScore} />
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
