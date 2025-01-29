import React, { useState, useEffect } from "react";
import Card from "./Card";
import Popup from "./Popup";
import "../styles/Game.css";
import axios from "axios";

const themes = {
    nature: ['🌲', '🌸', '🌻', '🍁', '🍄', '🌴', '🌼', '🌿', '🍃', '🌾', '🍂', '🌷', '🐚', '💐', '🥀', '🪵', '☘️', '🪸'],
    architecture: ['🏛️', '🏠', '🏢', '🏰', '🏙️', '🏚️', '🛖', '🏩', '⛩️', '🕍', '🏤', '🏥', '🏗️', '🕋', '🏭', '🛤️', '🏕️', '🛣️'],
    space: ['🌌', '⭐', '🌠', '🪐', '🚀', '🌑', '🌕', '🛸', '☄️', '🌙', '🛰️', '🌟', '💫', '⚡', '💥', '✨', '☀️', '⛅']
};
let attempts = 0;

const levels = {
  easy: 6,
  medium: 9,
  hard: 12,
};

function Game() {
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
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [badge, setBadge] = useState("");

  const themeBackgrounds ={
    nature : "linear-gradient(rgba(128, 128, 128, 0.4), rgba(169, 169, 169, 0.4)),url('/images/nature2.jpg')",
    space : "linear-gradient(rgba(25, 25, 112, 0.5), rgba(0, 0, 139, 0.5)),url('/images/space.jpg')",
    architecture : "linear-gradient(rgba(128, 128, 128, 0.4), rgba(169, 169, 169, 0.4)),url('/images/Architecture.jpg')",
    
};


  useEffect(() => {
    if (theme) {
      document.body.style.background = themeBackgrounds[theme];
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.height = "100vh";
      document.body.style.margin = "0"; 
      document.body.style.padding = "0";
    } else {
      document.body.style.background = "linear-gradient(rgba(30, 60, 114, 0.6), rgba(42, 82, 152, 0.6)),url('/images/home.avif')";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.height = "100vh";
      document.body.style.margin = "0"; // Reset margins for full body coverage
      document.body.style.padding = "0"; // Reset padding
      
    }
  }, [theme]);


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
      attempts++;
      if (firstChoice.emoji === secondChoice.emoji) {
        setCards((prev) =>
          prev.map((card) =>
            card.emoji === firstChoice.emoji ? { ...card, matched: true } : card
          )
        );
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
      sendData();
      analyzePerformance();
      setShowPopup(true);
      
    }
  }, [matches, cards]);

  // Reset card selection
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

    const analyzePerformance = () => {
        let message;
        let badge;
      
        if (level === 'easy') {
          if (attempts <= 7 && time <= 25) {
            message = "Great job! Your concentration is excellent!";
            badge = "gold";
          } else if (attempts <= 10 && time <= 50) {
            message = "Good effort! Your concentration is average.";
            badge = "silver";
          } else {
            message = "Keep practicing! Your concentration needs improvement.";
            badge = "bronze";
          }
        } else if (level === 'medium') {
          if (attempts <= 10 && time <= 35) {
            message = "Great job! Your concentration is excellent!";
            badge = "gold";
          } else if (attempts <= 15 && time <= 45) {
            message = "Good effort! Your concentration is average.";
            badge = "silver";
          } else {
            message = "Keep practicing! Your concentration needs improvement.";
            badge = "bronze";
          }
        } else if (level === 'hard') {
          if (attempts <= 12 && time <= 60) {
            message = "Great job! Your concentration is excellent!";
            badge = "gold";
          } else if (attempts <= 15 && time <= 70) {
            message = "Good effort! Your concentration is average.";
            badge = "silver";
          } else {
            message = "Keep practicing! Your concentration needs improvement.";
            badge = "bronze";
          }
        }
      
        setAnalysisMessage(message);
        setBadge(badge);
    };

    const saveGameData = async(gameData)=>{
        try{
            const response = await axios.post("http://localhost:5000/api/games/save", gameData);
            console.log("Game data saved:", response.data);
        }catch(err){
            console.error("Error saving game data:",err.message);
        }
    };

    const sendData = ()=>{
        if(matches === levels[level]){
            const gameData = {
                theme,
                level,
                time,
                attempts,
            };
            console.log(gameData);
            saveGameData(gameData);
        }
    };

    
    
  return (
    
    <div className="Game">
      <h1>Memory Card Game</h1>
      {!theme ? (
        <div className="theme-selector">
          <h2>Select Theme:</h2>
          <button onClick={() => setTheme("nature")}>Nature 🌳</button>
          <button onClick={() => setTheme("space")}>Space 🚀</button>
          <button onClick={() => setTheme("architecture")}>Architecture 🐶</button>
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
          <div className="controls">
            {/* <button onClick={() => setTheme(null)}>Change Theme</button>
            <button onClick={() => setLevel(null)}>Change Level</button> */}
            <div className="timer">Time: {time}s</div>
          </div>
          
        </>
      )}
      {/* {showPopup && <Popup time={time} attempt={attempts} analysisMessage={analysisMessage} restartGame={() => {setLevel(null) ;setShowPopup(false)}} close={() => {setShowPopup(false);setTheme(null); setLevel(null)}} />} */}
      {showPopup && (
        <Popup
        time={time}
        attempt={attempts}
        analysisMessage={analysisMessage}
        badge={badge}
        restartGame={()=>{
            setLevel(null);
            attempts=0;
            setShowPopup(false);
        }}
        close={()=>{
            setShowPopup(false);
            setTheme(null);
            setLevel(null);
        }}
        />
    )}
    </div>
  );
}

export default Game;
