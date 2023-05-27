import React from "react";
import "./styles.css";

const LetterPool = ({ count }) => {
  return (
    <div className="letter-pool">
      <div className="letter">{count}</div>
    </div>
  );
};

export default LetterPool;
