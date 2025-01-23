import React from "react";
import "../styles/Card.css";

export default function Card({ card, handleChoice, flipped, disabled }) {
  const handleClick = () => {
    if (!disabled && !flipped) {
      handleChoice(card);
    }
  };

  return (
    <div className="card" onClick={handleClick}>
      <div className={flipped ? "flipped" : ""}>
        <div className="front">❓</div>
        <div className="back">{card.emoji}</div>
      </div>
    </div>
  );
}
