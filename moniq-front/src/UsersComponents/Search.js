import React from 'react';
import { AiOutlineSearch } from 'react-icons/ai';

function Search ({ placeholder, value, onChange })  {
  return (
    <div className="flex items-center bg-gray-200 rounded-lg p-2 w-64">
       <AiOutlineSearch className="text-gray-500 mr-2" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Search...'}
        className="bg-gray-200 w-full p-1 outline-none font-sans text-gray-700"
      />
    </div>
  );
};

export default Search;
