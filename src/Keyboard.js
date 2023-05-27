import React from "react";
import "./keyboard.css";

const Keyboard = ({ onKeyPress }) => {
  const handleKeyPress = (key) => {
    onKeyPress(key);
  };

  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
  const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {row1.map((key, keyIndex) => (
          <button
            key={keyIndex}
            className="keyboard-button"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        {row2.map((key, keyIndex) => (
          <button
            key={keyIndex}
            className="keyboard-button"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
      </div>
      <div className="keyboard-row">
        <button
          className="keyboard-button enter"
          onClick={() => handleKeyPress("Enter")}
        >
          Enter
        </button>
        {row3.map((key, keyIndex) => (
          <button
            key={keyIndex}
            className="keyboard-button"
            onClick={() => handleKeyPress(key)}
          >
            {key}
          </button>
        ))}
        <button
          className="keyboard-button backspace"
          onClick={() => handleKeyPress("Backspace")}
        >
          Backspace
        </button>
      </div>
    </div>
  );
};

export default Keyboard;
