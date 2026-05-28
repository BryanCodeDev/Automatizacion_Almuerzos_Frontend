import React from 'react';

const NumericKeypad = ({ onKeyPress, onEnter, value, disabled }) => {
  const buttons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '⌫', '0', '✓'
  ];

  const handleClick = (btn) => {
    if (disabled) return;
    
    if (btn === '⌫') {
      onKeyPress('backspace');
    } else if (btn === '✓') {
      onEnter && onEnter();
    } else {
      onKeyPress(btn);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
      {buttons.map((btn) => (
        <button
          key={btn}
          type="button"
          onClick={() => handleClick(btn)}
          disabled={disabled}
          className="h-14 text-xl font-medium rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default NumericKeypad;