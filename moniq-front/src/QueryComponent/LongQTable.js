import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Search from "../UsersComponents/Search";

const LongQTable = () => {
  const [longQueries, setLongQueries] = useState([]);
  const [filteredLongQueries, setFilteredLongQueries] = useState([]);
  const [inProgressQueries, setInProgressQueries] = useState([]);
  const [filteredInProgressQueries, setFilteredInProgressQueries] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPageLong, setCurrentPageLong] = useState(1);
  const [currentPageInProgress, setCurrentPageInProgress] = useState(1);
  const queriesPerPage = 4;

  const fetchData = async () => {
    try {
      const longQueriesResponse = await fetch("http://localhost:5000/api/long-queries"); // URL de l'API
      const inProgressQueriesResponse = await fetch("http://localhost:5000/api/in-progress-queries");

      if (!longQueriesResponse.ok || !inProgressQueriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const longQueriesData = await longQueriesResponse.json();
      const inProgressQueriesData = await inProgressQueriesResponse.json();

      setLongQueries(longQueriesData);
      setFilteredLongQueries(longQueriesData);
      setInProgressQueries(inProgressQueriesData);
      setFilteredInProgressQueries(inProgressQueriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Récupération initiale des données
    fetchData();

    // Mise à jour des données toutes les 5 secondes
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval); // Nettoyage de l'intervalle
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredLongQueries(longQueries);
      setFilteredInProgressQueries(inProgressQueries);
    } else {
      const lowerCaseSearch = search.toLowerCase();
      setFilteredLongQueries(
        longQueries.filter(
          (query) =>
            query.userId.toLowerCase().includes(lowerCaseSearch) ||
            query.queryText.toLowerCase().includes(lowerCaseSearch)
        )
      );
      setFilteredInProgressQueries(
        inProgressQueries.filter(
          (query) =>
            query.userId.toLowerCase().includes(lowerCaseSearch) ||
            query.queryText.toLowerCase().includes(lowerCaseSearch)
        )
      );
    }
  }, [search, longQueries, inProgressQueries]);

  const paginate = (filteredQueries, currentPage) => {
    const indexOfLastQuery = currentPage * queriesPerPage;
    const indexOfFirstQuery = indexOfLastQuery - queriesPerPage;
    return filteredQueries.slice(indexOfFirstQuery, indexOfLastQuery);
  };

  const currentLongQueries = paginate(filteredLongQueries, currentPageLong);
  const currentInProgressQueries = paginate(filteredInProgressQueries, currentPageInProgress);

  const nextPage = (setPage, currentPage, totalItems) => {
    if (currentPage < Math.ceil(totalItems / queriesPerPage)) {
      setPage(currentPage + 1);
    }
  };

  const prevPage = (setPage, currentPage) => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full font-sans mt-2">
      <div className="flex justify-between items-center mb-0">
        <h2 className="text-xl font-sans text-gray-600 font-bold">Queries Tables</h2>
        <Search placeholder="Search by user or text..." value={search} onChange={(e) => setSearch(e.target.value)} />
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
                currentLongQueries.map((query) => (
                  <tr key={query.id} className="text-center text-sm border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-2 py-3">{query.executionTime}</td>
                    <td className="px-2 py-3">{query.userId}</td>
                    <td className="px-5 py-3">{query.queryText}</td>
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
          {/* Pagination Controls */}
          <div className="flex justify-between items-center mb-0">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => prevPage(setCurrentPageLong, currentPageLong)}
              disabled={currentPageLong === 1}
            >
              <FiChevronLeft />
            </button>
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
                currentInProgressQueries.map((query) => (
                  <tr key={query.id} className="text-center text-sm border-t border-gray-300 hover:bg-gray-50">
                    <td className="px-2 py-3">{query.executionTime}</td>
                    <td className="px-2 py-3">{query.userId}</td>
                    <td className="px-5 py-3">{query.queryText}</td>
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
          {/* Pagination Controls */}
          <div className="flex justify-between items-center">
            <button
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              onClick={() => prevPage(setCurrentPageInProgress, currentPageInProgress)}
              disabled={currentPageInProgress === 1}
            >
              <FiChevronLeft />
            </button>
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
