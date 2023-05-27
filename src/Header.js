import React from "react";
import "./styles.css";

const Header = () => {
  return (
    <header className="header">
      <div class="header-left" />
      <div className="header-center">
        <span className="header-title">Letter Lottery</span>
      </div>
      <div className="header-right">
        <button className="question-mark-btn">
          <img
            src={process.env.PUBLIC_URL + "/help.png"}
            alt="Help Icon"
            className="help-icon"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
