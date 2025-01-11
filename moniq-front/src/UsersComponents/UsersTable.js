import React, { useState, useEffect } from "react";

const UsersTable = () => {
  const [users, setUsers] = useState([]); // Liste complète des utilisateurs
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const usersPerPage = 4; // Nombre d'utilisateurs par page

  // Simulation de données (à remplacer par l'API)
  useEffect(() => {
    const simulatedData = [
      { id: 1, name: "Alice", role: "admin", action: "Edit/Delete", queries: 23 },
      { id: 2, name: "Bob", role: "user", action: "Edit/Delete", queries: 12 },
      { id: 3, name: "Charlie", role: "user", action: "Edit/Delete", queries: 7 },
      { id: 4, name: "Diana", role: "admin", action: "Edit/Delete", queries: 34 },
      { id: 5, name: "Eve", role: "user", action: "Edit/Delete", queries: 19 },
      { id: 6, name: "Frank", role: "admin", action: "Edit/Delete", queries: 25 },
      { id: 7, name: "Grace", role: "user", action: "Edit/Delete", queries: 8 },
      { id: 8, name: "Hank", role: "user", action: "Edit/Delete", queries: 15 },
      { id: 9, name: "Ivy", role: "admin", action: "Edit/Delete", queries: 20 },
      { id: 10, name: "Jack", role: "user", action: "Edit/Delete", queries: 14 },
      { id: 11, name: "Karen", role: "admin", action: "Edit/Delete", queries: 28 },
    ];

    setUsers(simulatedData); // Charger les données simulées
  }, []);

  // Calcul des utilisateurs à afficher pour la page actuelle
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Gestion des boutons de pagination
  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4 mb-0">
      <h2 className="text-xl font-bold mb-2">Users</h2>
      <table className="min-w-full table-auto bg-white shadow-md rounded-lg overflow-hidden">
  <thead>
    <tr className="text-left bg-gray-100 text-gray-600">
      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">ID</th>
      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">Name</th>
      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">Role</th>
      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">Action</th>
      <th className="px-6 py-3 text-sm font-semibold uppercase tracking-wider">Queries</th>
    </tr>
  </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{user.id}</td>
              <td className="border border-gray-300 px-4 py-2">{user.name}</td>
              <td className="border border-gray-300 px-4 py-2">{user.role}</td>
              <td className="border border-gray-300 px-4 py-2">{user.action}</td>
              <td className="border border-gray-300 px-4 py-2">{user.queries}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-2 mb-0">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          onClick={nextPage}
          disabled={currentPage === Math.ceil(users.length / usersPerPage)}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default UsersTable;
