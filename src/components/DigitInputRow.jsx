import React from 'react';
import './DigitInputRow.css'; // create this CSS file next

const ArrowFeedback = ({ status, direction }) => {
  if (status === 'correct' || !direction) return null;

  const arrowStyle = {
    color: direction === 'up' ? 'blue' : 'red',
    fontSize: '1.2em',
    marginLeft: '4px',
  };

  return <span style={arrowStyle}>{direction === 'up' ? '🔺' : '🔻'}</span>;
};

const DigitInputRow = ({ guess, feedback }) => {
  return (
    <div className="digit-row">
      {[...Array(6)].map((_, i) => {
        const digit = guess[i];
        const fb = feedback[i];

        let classes = 'digit-box';
        if (!digit && digit !== 0) classes += ' empty';

        if (fb?.status === 'correct') {
          classes += ' correct';
        } else if (fb?.status === 'misplaced') {
          classes += ' misplaced';
        } else if (fb?.status === 'absent') {
          classes += ' absent';
        }

        return (
          <div key={i} className={classes}>
            {digit !== undefined ? digit : ''}
            <ArrowFeedback status={fb?.status} direction={fb?.direction} />
          </div>
        );
      })}
    </div>
  );
};

export default DigitInputRow;