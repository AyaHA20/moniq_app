import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Search from "../UsersComponents/Search";

const LongQTable = () => {
  const [longQueries, setLongQueries] = useState([]);
  const [inProgressQueries, setInProgressQueries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPageLong, setCurrentPageLong] = useState(1);
  const [currentPageInProgress, setCurrentPageInProgress] = useState(1);
  const queriesPerPage = 3; // Nombre de requêtes par page

  // Fonction pour formater le temps d'exécution
  const formatExecutionTime = (executionTime) => {
    if (typeof executionTime === "string") {
      return executionTime; // Si c'est déjà une chaîne, on la retourne
    }
    // Si c'est un nombre (en secondes), on le formate en "HH:MM:SS"
    const hours = Math.floor(executionTime / 3600);
    const minutes = Math.floor((executionTime % 3600) / 60);
    const seconds = Math.floor(executionTime % 60);
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      const longQueriesResponse = await fetch("http://localhost:3000/api/long-queries");
      const inProgressQueriesResponse = await fetch("http://localhost:3000/api/queries");

      if (!longQueriesResponse.ok || !inProgressQueriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const longQueriesData = await longQueriesResponse.json();
      const inProgressQueriesData = await inProgressQueriesResponse.json();

      console.log("Long Queries Data:", longQueriesData); // Debug
      console.log("In Progress Queries Data:", inProgressQueriesData); // Debug

      // Formater les temps d'exécution pour les longues requêtes
      const formattedLongQueries = longQueriesData.map((query) => ({
        ...query,
        execution_time: formatExecutionTime(query.Execution_Time),
      }));

      // Formater les temps d'exécution pour les requêtes en cours
      const formattedInProgressQueries = inProgressQueriesData.map((query) => ({
        ...query,
        execution_time: formatExecutionTime(query.Execution_Time),
      }));

      setLongQueries(formattedLongQueries);
      setInProgressQueries(formattedInProgressQueries);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Récupérer les données toutes les 5 secondes
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData(); // Récupérer les données toutes les 5 secondes
    }, 5000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  // Récupérer les données au chargement initial
  useEffect(() => {
    fetchData(); // Récupérer les données au chargement initial
  }, []);

  // Fonction pour filtrer les données en fonction de la recherche
  const filterQueries = (queries) => {
    if (!search.trim()) {
      return queries; // Si la recherche est vide, retourner toutes les données
    }
    const searchTerm = search.toLowerCase();
    return queries.filter(
      (query) =>
        query.User_ID.toLowerCase().includes(searchTerm) || // Filtrer par User_ID
        query.Query_Text.toLowerCase().includes(searchTerm) // Filtrer par Query_Text
    );
  };

  // Paginer les données filtrées
  const paginate = (queries, currentPage) => {
    const indexOfLastQuery = currentPage * queriesPerPage;
    const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
    return queries.slice(indexOfFirstQuery, indexOfLastQuery);
  };

  const filteredLongQueries = filterQueries(longQueries);
  const filteredInProgressQueries = filterQueries(inProgressQueries);

  const currentLongQueries = paginate(filteredLongQueries, currentPageLong);
  const currentInProgressQueries = paginate(filteredInProgressQueries, currentPageInProgress);

  // Fonction pour passer à la page suivante
  const nextPage = (setPage, currentPage, totalItems) => {
    if (currentPage < Math.ceil(totalItems / queriesPerPage)) {
      setPage(currentPage + 1);
    }
  };

  // Fonction pour revenir à la page précédente
  const prevPage = (setPage, currentPage) => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full font-sans mt-2">
      <div className="flex justify-between items-center mb-0">
        <h2 className="text-xl font-sans text-gray-600 font-bold">Queries Tables</h2>
        <Search
          placeholder="Search by User ID or Query Text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex justify-between font-sans items-center mb-4">
        <h2 className="text-xl font-bold text-gray-600">Long Queries</h2>
        <h2 className="text-xl font-bold text-gray-600">Queries In Progress</h2>
      </div>

      <div className="flex justify-between items-start gap-x-6 mb-0">
        {/* Long Queries Table */}
        <div className="w-1/2 mb-0">
          <table className="table-auto bg-gray-100 shadow-md rounded-lg overflow-hidden mb-2 w-full">
            <thead className="bg-white text-gray-600 text-xs font-bold">
              <tr>
                <th className="px-2 py-2 uppercase tracking-wider w-1/4">Execution Time</th>
                <th className="px-2 py-2 uppercase tracking-wider w-1/4">User ID</th>
                <th className="px-5 py-2 uppercase tracking-wider w-1/2">Query Text</th>
              </tr>
            </thead>
            <tbody>
              {currentLongQueries.length > 0 ? (
                currentLongQueries.map((query, index) => (
                  <tr key={index} className="text-center text-sm border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-2 py-3">{query.execution_time}</td>
                    <td className="px-2 py-3">{query.User_ID}</td>
                    <td className="px-5 py-3">{query.Query_Text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center mb-0">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => prevPage(setCurrentPageLong, currentPageLong)}
              disabled={currentPageLong === 1}
            >
              <FiChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPageLong} of {Math.ceil(filteredLongQueries.length / queriesPerPage)}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => nextPage(setCurrentPageLong, currentPageLong, filteredLongQueries.length)}
              disabled={currentPageLong === Math.ceil(filteredLongQueries.length / queriesPerPage)}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Queries In Progress Table */}
        <div className="w-1/2 mb-0">
          <table className="table-auto bg-gray-100 shadow-md rounded-lg overflow-hidden mb-2 w-full">
            <thead className="bg-white text-gray-600 text-xs font-bold">
              <tr>
                <th className="px-2 py-2 uppercase tracking-wider w-1/4">Execution Time</th>
                <th className="px-2 py-2 uppercase tracking-wider w-1/4">User ID</th>
                <th className="px-5 py-2 uppercase tracking-wider w-1/2">Query Text</th>
              </tr>
            </thead>
            <tbody>
              {currentInProgressQueries.length > 0 ? (
                currentInProgressQueries.map((query, index) => (
                  <tr key={index} className="text-center text-sm border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-2 py-3">{query.execution_time}</td>
                    <td className="px-2 py-3">{query.User_ID}</td>
                    <td className="px-5 py-3">{query.Query_Text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3 text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-between items-center">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => prevPage(setCurrentPageInProgress, currentPageInProgress)}
              disabled={currentPageInProgress === 1}
            >
              <FiChevronLeft />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPageInProgress} of {Math.ceil(filteredInProgressQueries.length / queriesPerPage)}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => nextPage(setCurrentPageInProgress, currentPageInProgress, filteredInProgressQueries.length)}
              disabled={currentPageInProgress === Math.ceil(filteredInProgressQueries.length / queriesPerPage)}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongQTable;