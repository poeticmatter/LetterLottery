import React from "react";

const LetterRow = ({ letters }) => {
  return (
    <div className="letter-row">
      {letters.map((letter, index) => (
        <div className="letter" key={index}>
          {letter}
        </div>
      ))}
    </div>
  );
};

export default LetterRow;
