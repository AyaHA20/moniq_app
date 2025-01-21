import React, { useState, useEffect } from "react";
import axios from "axios";
import Boutton from "./Boutton";
import UsersTable from "./UsersTable";

function UsersManage() {
  const [error, setError] = useState(""); // Message d'erreur
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modale d'ajout
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modale d'édition
  const [userId, setUserId] = useState(""); // ID de l'utilisateur
  const [name, setName] = useState(""); // Nom de l'utilisateur
  const [role, setRole] = useState(""); // Rôle de l'utilisateur
  const [users, setUsers] = useState([]); // Liste d'utilisateurs depuis l'API

  // Fonction pour récupérer les données du back-end
  const fetchUsers = async () => {
    try {
      const response = await axios.get("https://your-api-endpoint.com/users");
      setUsers(response.data); // Met à jour les utilisateurs
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  // Appel API toutes les 5 secondes pour synchroniser les données
  useEffect(() => {
    fetchUsers(); // Premier appel immédiat
    const intervalId = setInterval(fetchUsers, 5000); // Rappel toutes les 5s
    return () => clearInterval(intervalId); // Nettoie l'intervalle lors du démontage
  }, []);

  // Ouvrir la modale d'édition
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  // Fermer la modale d'édition
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUserId("");
    setRole("");
  };

  // Ouvrir la modale d'ajout
  const openAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Fermer la modale d'ajout
  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setName("");
    setRole("");
  };

  // Mettre à jour le rôle de l'utilisateur
  const handleSaveEdit = async () => {
    if (role !== "admin" && role !== "user") {
      setError("Role must be either 'admin' or 'user'.");
      return;
    }

    try {
      await axios.put(`https://your-api-endpoint.com/users/${userId}`, { role });
      closeEditModal(); // Ferme la modale après succès
      fetchUsers(); // Récupère les utilisateurs mis à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du rôle:", error);
    }
  };

  // Ajouter un utilisateur
  const handleSaveAdd = async () => {
    if (!name || (role !== "admin" && role !== "user")) {
      setError("Name and role must be valid.");
      return;
    }

    try {
      await axios.post("https://your-api-endpoint.com/users", { name, role });
      closeAddModal(); // Ferme la modale après succès
      fetchUsers(); // Récupère les utilisateurs mis à jour
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center font-sans mt-6 space-x-4 mb-4">
        <div></div>
        <div className="flex space-x-4">
          <Boutton label="Add Member" color="blue" onClick={openAddModal} />
          <Boutton label="Edit Role" color="white" onClick={openEditModal} />
        </div>
      </div>

      <div className="mt-1 bg-white w-full h-full flex-grow p-6 rounded-lg">
        <UsersTable users={users} />
      </div>

      {/* Modale d'ajout */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Member</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="mt-2 h-8 w-full border border-gray-300 rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  className="mt-2 h-8 w-full border border-gray-300 rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </form>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={closeAddModal}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white px-5 py-2 rounded-lg"
                onClick={handleSaveAdd}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale d'édition */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Edit Role</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <input
                  type="text"
                  className="mt-2 h-8 w-full border border-gray-300 rounded-md"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <input
                  type="text"
                  className="mt-2 h-8 w-full border border-gray-300 rounded-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </form>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={closeEditModal}
              >
                Cancel
              </button>
              <button
                className="bg-purple-500 text-white px-5 py-2 rounded-lg"
                onClick={handleSaveEdit}
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

