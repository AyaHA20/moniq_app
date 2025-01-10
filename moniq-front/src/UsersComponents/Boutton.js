// src/UserComponents/Button.js
import React from 'react';

function Button ({ label, color = 'blue',onClick }) {
  const colorClasses = color === 'blue' 
    ? 'bg-purple-500 text-white font-sans font-bold hover:bg-purple-700'
    : 'bg-white text-gray-500 text-bold border font-bold font-sans hover:bg-blue-100';

  return (
    <button className={`px-8 py-2 rounded-lg focus:outline-none ${colorClasses}`}
    onClick={onClick} // Ajouter cette ligne
    >
      {label}
    </button>
  );
};

export default Button;
