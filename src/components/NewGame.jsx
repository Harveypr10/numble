import React, { useState, useEffect } from 'react';
import DigitInputRow from './DigitInputRow';
import './NewGame.css';

export default function NewGame({ digits, startNewGame, fullDate, description }) {
  const maxGuesses = 5;
  const [guesses, setGuesses] = useState(Array(maxGuesses).fill([]));
  const [feedbacks, setFeedbacks] = useState(Array(maxGuesses).fill([]));
  const [activeRow, setActiveRow] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [digitStatusMap, setDigitStatusMap] = useState({});

  const statusPriority = (status) => {
    if (status === 'correct') return 3;
    if (status === 'misplaced') return 2;
    if (status === 'absent') return 1;
    return 0;
  };

  useEffect(() => {
    setGuesses(Array(maxGuesses).fill([]));
    setFeedbacks(Array(maxGuesses).fill([]));
    setActiveRow(0);
    setGameOver(false);
    setDigitStatusMap({});
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

    const newDigitStatusMap = { ...digitStatusMap };
    guesses[activeRow].forEach((digit, i) => {
      const status = fb[i].status;
      const existing = newDigitStatusMap[digit];
      if (!existing || statusPriority(status) > statusPriority(existing)) {
        newDigitStatusMap[digit] = status;
      }
    });
    setDigitStatusMap(newDigitStatusMap);
    console.log('Updated digitStatusMap:', newDigitStatusMap);

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
      if (digit === targetDigit) return { status: 'correct' };
      const direction = digit < targetDigit ? 'up' : 'down';
      if (!targetArr.includes(digit)) return { status: 'absent', direction };
      return { status: 'misplaced', direction };
    });
  };

  const handleDigitInput = (digit) => {
    if (gameOver || guesses[activeRow].length >= 6) return;
    updateGuess([...guesses[activeRow], digit]);
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
      {guesses.map((guess, index) => (
        <DigitInputRow
          key={index}
          guess={guess}
          feedback={feedbacks[index]}
          targetDigits={digits}
        />
      ))}

<div className="numpad-grid">
  <div className="numpad-left">
    <div className="numpad-row">
      {[1, 2, 3, 4, 5].map((d) => {
        const status = digitStatusMap[d];
        const statusClass =
          status === 'correct'
            ? 'correct-digit'
            : status === 'misplaced'
            ? 'misplaced-digit'
            : status === 'absent'
            ? 'absent-digit'
            : '';
        const className = `digit ${statusClass}`.trim();
        return (
          <button key={d} className={className} onClick={() => handleDigitInput(d)}>
            {d}
          </button>
        );
      })}
    </div>
    <div className="numpad-row">
      {[6, 7, 8, 9, 0].map((d) => {
        const status = digitStatusMap[d];
        const statusClass =
          status === 'correct'
            ? 'correct-digit'
            : status === 'misplaced'
            ? 'misplaced-digit'
            : status === 'absent'
            ? 'absent-digit'
            : '';
        const className = `digit ${statusClass}`.trim();
        return (
          <button key={d} className={className} onClick={() => handleDigitInput(d)}>
            {d}
          </button>
        );
      })}
    </div>
  </div>

  <div className="delete-button-wrapper">
    <button className="del-button tall-del" onClick={handleDelete}>Del</button>
  </div>
</div>

      <div className="numpad-row">
        <button className="newgame" onClick={startNewGame}>🔄 New Game</button>
        <button className="enter" onClick={submitGuess}>Enter</button>
        <button className="clr" onClick={handleClear}>Clr</button>
      </div>

      {gameOver && (
        <div className="clue-box">
          <p><strong>Date:</strong> {fullDate}</p>
          <p><strong>Event:</strong> {description}</p>
          <p style={{ color: 'green', fontWeight: 'bold' }}>
            {feedbacks[activeRow].every((f) => f.status === 'correct')
              ? '🎉 Correct! You solved it.'
              : '🛑 Out of guesses — try another puzzle!'}
          </p>
        </div>
      )}
    </div>
  );
}