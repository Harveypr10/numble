import React, { useState, useEffect } from 'react';
import DigitInputRow from './DigitInputRow';
import Numpad from './Numpad';
import './NewGame.css';

export default function NewGame({ digits, startNewGame, fullDate, description }) {
  const maxGuesses = 5;
  const [guesses, setGuesses] = useState(Array(maxGuesses).fill([]));
  const [feedbacks, setFeedbacks] = useState(Array(maxGuesses).fill([]));
  const [activeRow, setActiveRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Reset game on new puzzle
    setGuesses(Array(maxGuesses).fill([]));
    setFeedbacks(Array(maxGuesses).fill([]));
    setActiveRow(0);
    setGameOver(false);
  }, [digits]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      const key = e.key;
      if (/^[0-9]$/.test(key)) {
        if (guesses[activeRow].length < 6) {
          updateGuess([...guesses[activeRow], Number(key)]);
        }
      } else if (key === 'Backspace') {
        updateGuess(guesses[activeRow].slice(0, -1));
      } else if (key === 'Enter' || key === ' ') {
        submitGuess();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [guesses, activeRow, gameOver]);

  const updateGuess = (newGuess) => {
    setGuesses((prevGuesses) =>
      prevGuesses.map((row, idx) => (idx === activeRow ? newGuess : row))
    );
  };

  const submitGuess = () => {
    if (guesses[activeRow].length !== 6) return;

    const fb = generateFeedback(guesses[activeRow], digits);

    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((row, idx) => (idx === activeRow ? fb : row))
    );

    const isCorrect = fb.every((f) => f.status === 'correct');
    if (isCorrect || activeRow === maxGuesses - 1) {
      setGameOver(true);
    } else {
      setActiveRow((prev) => prev + 1);
    }
  };

const generateFeedback = (guessArr, targetArr) => {
  return guessArr.map((digit, index) => {
    const targetDigit = targetArr[index];

    if (digit === targetDigit) {
      return { status: 'correct' }; // No arrow needed for correct digits
    }

    // Determine direction compared to correct digit at this index
    const direction = digit < targetDigit ? 'up' : 'down';

    if (!targetArr.includes(digit)) {
      return { status: 'absent', direction }; // ⬅️ Now includes arrow!
    }

    return { status: 'misplaced', direction };
  });
};

  const handleDigitInput = (digit) => {
    if (gameOver) return;
    if (guesses[activeRow].length < 6) {
      updateGuess([...guesses[activeRow], digit]);
    }
  };

  const handleDelete = () => {
    if (gameOver) return;
    updateGuess(guesses[activeRow].slice(0, -1));
  };

  const handleClear = () => {
    if (gameOver) return;
    updateGuess([]);
  };

  return (
    <div className="numble-game">
      <button onClick={startNewGame} style={{ marginBottom: '1em' }}>
        🔄 Start New Puzzle
      </button>

      {guesses.map((guess, index) => (
        <DigitInputRow
          key={index}
          guess={guess}
          feedback={feedbacks[index]}
          targetDigits={digits} // 👈 Ensure this is passed for arrow logic
        />
      ))}

<div
  className="clue-box"
  style={{
    margin: '1em 0',
    padding: '0.5em',
    background: '#f5f5f5',
    borderRadius: '6px',
  }}
>
  {/* Only show after puzzle ends */}
  {gameOver && (
    <>
      <p><strong>Date:</strong> {fullDate}</p>
      <p><strong>Event:</strong> {description}</p>
      <p style={{ color: 'green', fontWeight: 'bold', marginTop: '0.5em' }}>
        {feedbacks[activeRow].every((f) => f.status === 'correct')
          ? '🎉 Correct! You solved it.'
          : '🛑 Out of guesses — try another puzzle!'}
      </p>
    </>
  )}
</div>

      <Numpad
        onDigit={handleDigitInput}
        onDelete={handleDelete}
        onClear={handleClear}
        onEnter={submitGuess}
        guess={guesses[activeRow]}
        feedback={feedbacks[activeRow]}
        target={digits}
        guesses={guesses}
        feedbacks={feedbacks}
      />
    </div>
  );
}