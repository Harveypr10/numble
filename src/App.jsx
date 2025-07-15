import React, { useState, useEffect } from 'react';
import { getRandomPuzzle } from './utils/NewGame';
import NewGame from './components/NewGame';
import './App.css';

function App() {
  const [targetDigits, setTargetDigits] = useState([]);
  const [fullDate, setFullDate] = useState('');
  const [description, setDescription] = useState('');
  const [showResult, setShowResult] = useState(false); // new state

  const startNewGame = () => {
    const puzzle = getRandomPuzzle();
    setTargetDigits(puzzle.digits);
    setFullDate(puzzle.fullDate);
    setDescription(puzzle.description);
    setShowResult(false); // reset on new game
    console.log('Puzzle updated in App.jsx:', puzzle);
  };

  useEffect(() => {
    startNewGame(); // Load initial puzzle
  }, []);

  return (
    <div className="App">
      <h1>🧠 Numble</h1>
      <p>Guess the 6-digit sequence from a famous historical date!</p>

      {/* REMOVE Target Digits from screen */}
      {/* Metadata revealed only when puzzle is complete */}
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
        onComplete={() => setShowResult(true)} // notify App when done
      />
    </div>
  );
}

export default App;