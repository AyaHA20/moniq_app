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
    <div className='mb-0'>
      {/* Ligne avec carrousel à gauche, et boutons à droite */}
      <div className="flex justify-between items-center mt-6 space-x-4">
        {/* Carrousel à gauche */}
       <div></div>

        {/* Boutons à droite */}
        <div className="flex space-x-4">
        <div className="my-4 space-x-4">
          <Boutton label="Add Member" color="blue"  /> {/* Bouton bleu */}
          <Boutton label="Edit Role" color="white" /> {/* Bouton blanc */}
          

        </div>
        </div>
      </div>

      {/* Ajouter un grand rectangle blanc pour le composant UsersManage */}
      <div className="mt-0 bg-white w-full h-200 flex-grow mb-0  p-6 rounded-lg ">
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

