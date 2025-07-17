import React, { useState, useEffect } from 'react';
import { getRandomPuzzle } from './utils/NewGame';
import NewGame from './components/NewGame';
import './App.css';

function App() {
  const [targetDigits, setTargetDigits] = useState([]);
  const [fullDate, setFullDate] = useState('');
  const [description, setDescription] = useState('');
  const [showResult, setShowResult] = useState(false);

  const startNewGame = () => {
    const puzzle = getRandomPuzzle();
    setTargetDigits(puzzle.digits);
    setFullDate(puzzle.fullDate);
    setDescription(puzzle.description);
    setShowResult(false);
    console.log('Puzzle updated in App.jsx:', puzzle);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="title">Elementle</h1>
<img
  src="/numble/HammieLogo.png"
  alt="Hammie the Hamster"
  className="hammie-logo"
/>
      </div>

      <p className="subtitle">
        Hammie the hamster powered history-math game
      </p>

      {showResult && (
        <div className="event-reveal">
          <h3>{fullDate}</h3>
          <p>{description}</p>
        </div>
      )}

      <hr style={{ margin: '2em 0' }} />

      <NewGame
        digits={targetDigits}
        startNewGame={startNewGame}
        fullDate={fullDate}
        description={description}
        onComplete={() => setShowResult(true)}
      />
    </div>
  );
}

export default App;