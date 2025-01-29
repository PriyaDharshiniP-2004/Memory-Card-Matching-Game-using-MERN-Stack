import React from "react";
import "../styles/Popup.css";

export default function Popup({ time, attempt,analysisMessage,badge, restartGame, close }) {

  const badgeIcons = {
    gold: "🥇",
    silver : "🥈",
    bronze : "🥉",
  };
  return (
    <div className="popup">
      <div className="popup-content">
        <h2>🎉 Game Completed! 🎉</h2>
        <p>{analysisMessage}</p>
        {badge && (
          <div className="badge">
            <p>You've earned:</p>
            <span className={`badge-icon ${badge}`}>
              {badgeIcons[badge]} {badge.toUpperCase()} Badge
            </span>
          </div>
        )}
        <p>Time: {time} seconds using {attempt} moves.</p>
        <button onClick={restartGame}>Play Again</button>
        <button onClick={close}>Home</button>
      </div>
    </div>
  );
}
