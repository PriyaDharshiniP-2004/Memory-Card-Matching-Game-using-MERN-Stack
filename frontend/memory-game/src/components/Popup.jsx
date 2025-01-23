import React from "react";
import "../styles/Popup.css";

export default function Popup({ time, attempt, restartGame, close }) {
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>🎉 Game Completed! 🎉</h2>
        <p>Time: {time} seconds using {attempt} moves.</p>
        <button onClick={restartGame}>Play Again</button>
        <button onClick={close}>Home</button>
      </div>
    </div>
  );
}
