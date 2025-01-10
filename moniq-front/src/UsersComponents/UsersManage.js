import React, { useState } from 'react';
import Boutton from './Boutton';
import UsersTable from './UsersTable';

function UsersManage() {
  // État pour stocker la visibilité de la modale
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fonction pour ouvrir la modale
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Ligne avec carrousel à gauche, et boutons à droite */}
      <div className="flex justify-between items-center mt-6 space-x-4">
        {/* Carrousel à gauche */}
        <div className="flex space-x-2">
          <button className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 hover:font-bold hover:text-black transition-all duration-300">1</button>
          <button className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 hover:font-bold hover:text-black transition-all duration-300">2</button>
          <button className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center hover:bg-gray-500 hover:font-bold hover:text-black transition-all duration-300">3</button>
        </div>

        {/* Boutons à droite */}
        <div className="flex space-x-4">
          <div className="my-4 space-x-4">
            <Boutton label="Add Member" color="blue" /> {/* Bouton bleu */}
            <Boutton label="Edit Role" color="white" onClick={openModal} /> {/* Bouton blanc */}
          </div>
        </div>
      </div>

      {/* Ajouter un grand rectangle blanc pour le composant UsersManage */}
      <div className="mt-1 bg-white w-full h-full flex-grow p-6 rounded-lg">
        <div className="my-1 flex-grow">
          {/* Autre contenu de votre composant UsersManage */}
        </div>
        <div className="flex">
          <UsersTable />
        </div>
      </div>

      {/* Modale */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>
            <p>Modifiez les informations du rôle ici.</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={closeModal}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManage;
