import React from 'react';
import './Numpad.css';

const Numpad = ({
  onDigit,
  onDelete,
  onClear,
  onEnter,
  guesses = [],
  feedbacks = [],
}) => {
const getDigitStatus = (digit) => {
  let status = '';
  let isCorrect = false;
  let isMisplaced = false;
  let isAbsent = false;
  let hasBeenGuessed = false;

  for (let row = 0; row < feedbacks.length; row++) {
    const guessRow = guesses[row] || [];
    const feedbackRow = feedbacks[row] || [];

    for (let i = 0; i < guessRow.length; i++) {
      if (guessRow[i] === digit) {
        hasBeenGuessed = true;
        const fb = feedbackRow[i];
        if (!fb) continue;

        if (fb.status === 'correct') isCorrect = true;
        else if (fb.status === 'misplaced') isMisplaced = true;
        else if (fb.status === 'absent') isAbsent = true;
      }
    }
  }

  if (isCorrect) return 'correct';
  if (isMisplaced) return 'misplaced'; // Changed from 'misplaced-border'
  if (isAbsent) return 'absent';
  if (hasBeenGuessed) return 'tried'; // optional if you want to reflect "tried but neutral"
  return '';
};

  const renderButton = (digit) => {
    const status = getDigitStatus(digit);

    return (
      <button className={`key ${status}`} onClick={() => onDigit(digit)}>
        {digit}
      </button>
    );
  };

  return (
    <div className="numpad-grid">
      <div className="digit-column">
        <div className="digit-row">{renderButton(1)}{renderButton(2)}{renderButton(3)}</div>
        <div className="digit-row">{renderButton(4)}{renderButton(5)}{renderButton(6)}</div>
        <div className="digit-row">{renderButton(7)}{renderButton(8)}{renderButton(9)}</div>
        <div className="digit-row">{renderButton(0)}<button className="key enter" onClick={onEnter}>Enter</button></div>
      </div>
      <div className="action-column">
        <button className="key clear" onClick={onClear}>Clr</button>
        <button className="key delete" onClick={onDelete}>Del</button>
      </div>
    </div>
  );
};

export default Numpad;