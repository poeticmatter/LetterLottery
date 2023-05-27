import React from "react";

const Score = ({ totalScore, currentScore }) => {
  return (
    <div className="score">
      <div className="score-item">{totalScore}</div>
      <div className="divider"></div>
      <div className="score-item">{currentScore}</div>
    </div>
  );
};

export default Score;
