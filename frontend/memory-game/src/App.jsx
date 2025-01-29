import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Game from "./components/Game";
import Multiplayer from "./components/Multiplayer.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singleplayer" element={<Game />}/>
        <Route path="/multiplayer" element={<Multiplayer />}/>
      </Routes>
    </Router>
    
  );
};

export default App;