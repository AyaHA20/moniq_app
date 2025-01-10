import React, { useState } from 'react';
import Boutton from './Boutton';
import Search from './Search';
import UsersTable from './UsersTable';

function UsersManage() {
  // État pour stocker la valeur de recherche
  const [search, setSearch] = useState('');

  // Fonction pour gérer les changements dans la barre de recherche
  const handleSearchChange = (event) => {
    setSearch(event.target.value); // Met à jour l'état avec la saisie utilisateur
  };

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
        <div className="my-4 space-x-4">
          <Boutton label="Add Member" color="blue"  /> {/* Bouton bleu */}
          <Boutton label="Edit Role" color="white" /> {/* Bouton blanc */}
          

        </div>
        </div>
      </div>

      {/* Ajouter un grand rectangle blanc pour le composant UsersManage */}
      <div className="mt-1 bg-white w-full h-full flex-grow p-6 rounded-lg ">
        <div className="my-1 flex-grow">
          {/* Autre contenu de votre composant UsersManage */}
        </div>
       {/* Contenu du composant UsersManage */}

       <div className=" flex justify-end">
          <Search
            placeholder="Search for users..."
            value={search}
            onChange={handleSearchChange}
          />
       </div>

       <div className="flex ">
           <UsersTable />
       </div>

      </div>



    </div>
  );
}

export default UsersManage;

