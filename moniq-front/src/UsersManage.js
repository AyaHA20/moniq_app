import React from 'react';

function UsersManage() {
  return (
    <div>
      {/* Ligne avec carrousel à gauche, et boutons à droite */}
      <div className="flex justify-between items-center mt-6 space-x-4">
        {/* Carrousel à gauche */}
        <div className="flex space-x-2">
          <button className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center  hover:bg-gray-500 hover:font-bold hover:text-black transition-all duration-300">1</button>
          <button className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center  hover:bg-gray-500 hover:font-bold hover:text-black transition-all duration-300">2</button>
          <button className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center  hover:bg-gray-500 hover:font-bold hover:text-black transition-all duration-300">3</button>
        </div>

        {/* Boutons à droite */}
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Add member</button>
          <button className="bg-pink-500 text-white py-2 font-bold px-4 rounded">Edit roles</button>
        </div>
      </div>

      {/* Ajouter un grand rectangle blanc pour le composant UsersManage */}
      <div className="mt-6 bg-white w-full h-full flex-grow p-6 rounded-lg  ">
        {/* Contenu du composant UsersManage */}
      </div>
    </div>
  );
}

export default UsersManage;

