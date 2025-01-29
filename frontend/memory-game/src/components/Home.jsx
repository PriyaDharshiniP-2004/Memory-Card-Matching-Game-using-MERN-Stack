import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <h1>Welcome to the Memory Card Game</h1>
      <div className="home-buttons">
        <button onClick={() => navigate("/singleplayer")}>Single Player</button>
        <button onClick={() => navigate("/multiplayer")}>Multiplayer</button>
      </div>
    </div>
  );
};

export default Home;