import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Importer les icônes
import Search from "./Search";

const UsersTable = () => {
  const [users, setUsers] = useState([]); // Tous les utilisateurs
  const [filteredUsers, setFilteredUsers] = useState([]); // Utilisateurs filtrés
  const [search, setSearch] = useState(''); // Valeur du champ de recherche
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const usersPerPage = 4; // Nombre d'utilisateurs par page

  // Fonction pour déterminer le rôle (admin ou user)
  const determineRole = (user) => {
    if (
      user.Can_Select === "Y" &&
      user.Can_Insert === "Y" &&
      user.Can_Update === "Y" &&
      user.Can_Delete === "Y"
    ) {
      return "Admin";
    } else {
      return "User";
    }
  };

  // Fonction pour récupérer les utilisateurs depuis l'API
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users"); // Remplacez par votre endpoint API
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data); // Initialiser les utilisateurs filtrés avec les données récupérées
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Récupérer les utilisateurs toutes les 5 secondes
  useEffect(() => {
    fetchUsers(); // Récupérer les données au chargement initial
    const intervalId = setInterval(fetchUsers, 5000); // Récupérer les données toutes les 5 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  // Gestion de la recherche (par nom ou host)
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);

    if (value.trim() !== "") {
      // Filtrer les utilisateurs dont le nom ou le host correspond à la recherche
      const filtered = users.filter(
        (user) =>
          user.Name.toLowerCase().includes(value.toLowerCase()) || // Recherche par nom
          user.Host.toLowerCase().includes(value.toLowerCase())   // Recherche par host
      );
      setFilteredUsers(filtered);
    } else {
      // Si la recherche est vide, afficher tous les utilisateurs
      setFilteredUsers(users);
    }
  };

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
            placeholder="Search for users by name or host..."
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
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Host</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Name</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Role</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Can Select</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Can Insert</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Can Update</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Can Delete</th>
            <th className="px-6 py-1 text-sm font-semibold uppercase tracking-wider">Queries Executed</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.length > 0 ? (
            currentUsers.map((user, index) => (
              <tr key={index} className="text-center border-t border-gray-300 hover:bg-gray-50">
                <td className="px-6 py-3">{user.Host}</td>
                <td className="px-6 py-3">{user.Name}</td>
                <td className="px-6 py-3">{determineRole(user)}</td>
                <td className="px-6 py-3">{user.Can_Select}</td>
                <td className="px-6 py-3">{user.Can_Insert}</td>
                <td className="px-6 py-3">{user.Can_Update}</td>
                <td className="px-6 py-3">{user.Can_Delete}</td>
                <td className="px-6 py-3">{user.Queries_Executed}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                Aucun utilisateur trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {filteredUsers.length > usersPerPage && (
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
      )}
    </div>
  );
};

export default UsersTable;