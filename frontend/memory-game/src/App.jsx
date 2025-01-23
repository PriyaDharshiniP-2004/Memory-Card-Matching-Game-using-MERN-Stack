import React, { useState, useEffect } from "react";
import Card from "./components/Card";
import Popup from "./components/Popup";
import "./styles/App.css";

// const themes = {
//   nature: ["🌳", "🌺", "🍁", "🌞", "🍄", "🌿"],
//   space: ["🌌", "🚀", "🪐", "🌠", "👾", "⭐"],
//   animals: ["🐶", "🐱", "🐭", "🦊", "🐼", "🐯"],
// };
const themes = {
    nature: ["🌳", "🌻", "🌊", "🌵", "🍂", "🌺", "🌞", "🌾", "🌻", "🍀", "🌱", "🌹", "🌱", "🌺", "🌵"],
    space: ["🌌", "🚀", "🛸", "🪐", "🌠", "🌟", "🌙", "🌍", "🚀", "🌑", "🌕", "🌑", "🪐", "✨", "🛸"],
    architecture: ["🏛", "🏠", "🏗", "🕌", "🏰", "🏘", "🏯", "🏛", "🏢", "🏠", "🏗", "🏠", "🏢", "🏰", "🏙"],
  };
let attempts = 0;

const levels = {
  easy: 6,
  medium: 9,
  hard: 12,
};

function App() {
  const [theme, setTheme] = useState(null); 
  const [level, setLevel] = useState(null);
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [observing, setObserving] = useState(false);

  useEffect(() => {
    if (theme && level) {
      initializeGame();
    }
  }, [theme, level]);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  const initializeGame = () => {
    const cardSet = themes[theme];
    const totalCards = levels[level];
    const selectedIcons = cardSet.slice(0,totalCards);
    const shuffledCards = [...selectedIcons,...selectedIcons]
        .sort(() => Math.random() - 0.5)
        .map((emoji,index) => ({id:index, emoji, matched:false}));
    // const shuffledCards = [...cardSet, ...cardSet]
    //   .slice(0, totalCards) // Take the required number of pairs
    //   .sort(() => Math.random() - 0.5)
    //   .map((emoji, index) => ({ id: index, emoji, matched: false }));
    setCards(shuffledCards);
    setMatches(0);
    setTime(0);
    setTimerActive(false);
    setObserving(true);
    setShowPopup(false);

    // Show cards for 5 seconds, then hide them
    setTimeout(() => {
      setObserving(false);
      setTimerActive(true);
    }, 5000);
  };

  // Handle card selection
  const handleChoice = (card) => {
    if (!disabled && !observing) {
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };

  // Compare two selected cards
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.emoji === secondChoice.emoji) {
        setCards((prev) =>
          prev.map((card) =>
            card.emoji === firstChoice.emoji ? { ...card, matched: true } : card
          )
        );
        attempts++;
        setMatches((prev) => prev + 1);
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  // Check for game completion
  useEffect(() => {
    if (matches > 0 && matches === cards.length / 2) {
      setTimerActive(false);
      setShowPopup(true);
    }
  }, [matches, cards]);

  // Reset card selection
  const resetTurn = () => {
    attempts++;
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  return (
    <div className="App">
      <h1>Memory Card Game</h1>
      {!theme ? (
        <div className="theme-selector">
          <h2>Select Theme:</h2>
          <button onClick={() => setTheme("nature")}>Nature 🌳</button>
          <button onClick={() => setTheme("space")}>Space 🚀</button>
          <button onClick={() => setTheme("animals")}>Architecture 🐶</button>
        </div>
      ) : !level ? (
        <div className="level-selector">
          <h2>Select Difficulty:</h2>
          <button onClick={() => setLevel("easy")}>Easy</button>
          <button onClick={() => setLevel("medium")}>Medium</button>
          <button onClick={() => setLevel("hard")}>Hard</button>
        </div>
      ) : (
        <>
          <div className="controls">
            <button onClick={() => setTheme(null)}>Change Theme</button>
            <button onClick={() => setLevel(null)}>Change Level</button>
            <div className="timer">Time: {time}s</div>
          </div>
          <div className="card-grid">
            {cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                handleChoice={handleChoice}
                flipped={card === firstChoice || card === secondChoice || card.matched || observing}
                disabled={disabled || observing}
              />
            ))}
          </div>
        </>
      )}
      {showPopup && <Popup time={time} attempt={attempts} restartGame={() => setLevel(null)} close={() => {setShowPopup(false);setTheme(null); setLevel(null)}} />}
    </div>
  );
}

export default App;
