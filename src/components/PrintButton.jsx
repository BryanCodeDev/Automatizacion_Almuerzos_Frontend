import React from 'react';

const PrintButton = ({ onPrint, text = 'Imprimir' }) => {
  return (
    <button
      onClick={onPrint}
      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {text}
    </button>
  );
};

export default PrintButton;