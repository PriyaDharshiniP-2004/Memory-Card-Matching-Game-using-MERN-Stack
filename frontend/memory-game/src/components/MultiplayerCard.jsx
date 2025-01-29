import React from "react";
import "../styles/MultiplayerCard.css";

const MultiplayerCard = ({ card, index, isFlipped, onClick }) => {
  return (
    <div
      className={`card ${isFlipped ? "flipped" : ""}`} 
      onClick={() => onClick(index)}
    >
      {isFlipped ? (
        <span className="card-content">{card}</span>
      ) : (
        <span className="card-back">?</span>
      )}
    </div>
  );
};

export default MultiplayerCard;