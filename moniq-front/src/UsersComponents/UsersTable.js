import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Importer les icônes
import Search from "./Search";

const UsersTable = () => {
  const [users, setUsers] = useState([]); // Liste complète des utilisateurs
  const [filteredUsers, setFilteredUsers] = useState([]); // Liste filtrée
  const [search, setSearch] = useState(''); // Valeur du champ de recherche
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const usersPerPage = 4; // Nombre d'utilisateurs par page

  // Récupérer les utilisateurs depuis l'API Flask
  useEffect(() => {
    axios.get('http://localhost:5000/api/users') // URL de ton API Flask
      .then((response) => {
        setUsers(response.data); // Mettre à jour la liste des utilisateurs
        setFilteredUsers(response.data); // Initialiser les utilisateurs filtrés
      })
      .catch((error) => {
        console.error("Il y a eu une erreur lors de la récupération des utilisateurs : ", error);
      });
  }, []);

  // Mettre à jour les utilisateurs filtrés en fonction de la recherche
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredUsers(users); // Si la recherche est vide, affiche tous les utilisateurs
    } else {
      setFilteredUsers(
        users.filter((user) => {
          // Vérifie si l'ID correspond exactement à la recherche ou si le nom correspond à la recherche
          return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.id === parseInt(search) // Comparaison stricte de l'ID avec la valeur saisie
          );
        })
      );
    }
  }, [search, users]);

  // Calcul des utilisateurs à afficher pour la page actuelle
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Gestion des boutons de pagination
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="w-full font-sans">
      {/* Conteneur avec alignement à droite du composant Search */}
      <div className="flex justify-between items-center space-x-4">
        {/* à gauche */}
        <div className="flex space-x-2">
          {/* Autre contenu de ton composant UsersManage */}
        </div>
        {/* à droite */}
        <div className="flex mb-1">
          <Search
            placeholder="Search for users..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <h2 className="text-xl text-gray-600 font-bold">Users</h2>

      {/* le tableau */}
      <table className="table-auto w-full bg-gray-100 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-white text-gray-600 font-sans-bold">
          <tr>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">ID</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Name</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Role</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Action</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Queries</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index} className="text-center border-t border-gray-300 hover:bg-gray-50">
              <td className="px-6 py-3">{user.id}</td>
              <td className="px-6 py-3">{user.name}</td>
              <td className="px-6 py-3">{user.role}</td>
              <td className="px-6 py-3">{user.action}</td>
              <td className="px-6 py-3">{user.queries}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 text-white px-2 py-2 rounded-full"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          className="bg-gray-300 text-white px-2 py-2 rounded-full"
          onClick={nextPage}
          disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
