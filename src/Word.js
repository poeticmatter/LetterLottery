import React from "react";
import "./styles.css";

const Word = ({ text, wordScore }) => {
  return (
    <div className="word-container">
      <div className="word">{text}</div>
      <div className="divider"></div>
      <div className="word-score">{wordScore}</div>
    </div>
  );
};

export default Word;
