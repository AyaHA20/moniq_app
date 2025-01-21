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
  const queriesPerPage = 5;

  useEffect(() => {
    const simulatedLongQueries = [
      { id: 1, executionTime: "3.2s", userId: "U001", queryText: "SELECT * FROM users WHERE age > 30" },
      { id: 2, executionTime: "5.8s", userId: "U002", queryText: "UPDATE orders SET status = 'shipped' WHERE id = 42" },
      { id: 3, executionTime: "4.1s", userId: "U003", queryText: "DELETE FROM logs WHERE created_at < '2024-01-01'" },
      { id: 4, executionTime: "2.5s", userId: "U004", queryText: "SELECT * FROM orders WHERE status = 'pending'" },
      { id: 5, executionTime: "5.8s", userId: "U002", queryText: "UPDATE orders SET status = 'shipped' WHERE id = 42" },
      { id: 6, executionTime: "2.5s", userId: "U004", queryText: "SELECT * FROM orders WHERE status = 'pending'" },
      { id: 7, executionTime: "5.8s", userId: "U002", queryText: "UPDATE orders SET status = 'shipped' WHERE id = 42" }

      
      // Ajoutez plus de données si nécessaire
    ];
    const simulatedInProgressQueries = [
      { id: 8, executionTime: "3.8s", userId: "U005", queryText: "INSERT INTO audit (action, timestamp) VALUES ('logout', NOW())" },
      { id: 9, executionTime: "6.2s", userId: "U006", queryText: "SELECT * FROM products WHERE category = 'electronics'" },
      { id: 10, executionTime: "3.8s", userId: "U005", queryText: "INSERT INTO audit (action, timestamp) VALUES ('logout', NOW())" },
      { id: 11, executionTime: "6.2s", userId: "U006", queryText: "SELECT * FROM products WHERE category = 'electronics'" },
      { id: 12, executionTime: "3.8s", userId: "U005", queryText: "INSERT INTO audit (action, timestamp) VALUES ('logout', NOW())" },
      { id: 13, executionTime: "6.2s", userId: "U006", queryText: "SELECT * FROM products WHERE category = 'electronics'" },
      { id: 6, executionTime: "2.5s", userId: "U004", queryText: "SELECT * FROM orders WHERE status = 'pending'" },
      { id: 7, executionTime: "5.8s", userId: "U002", queryText: "UPDATE orders SET status = 'shipped' WHERE id = 42" }
      // Ajoutez plus de données si nécessaire
    ];

    setLongQueries(simulatedLongQueries);
    setFilteredLongQueries(simulatedLongQueries);
    setInProgressQueries(simulatedInProgressQueries);
    setFilteredInProgressQueries(simulatedInProgressQueries);
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
    <div className="w-full font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-sans text-gray-600 font-bold">Queries Tables</h2>
        <Search placeholder="Search for queries..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="flex justify-between font-sans items-center mb-4">
        <h2 className="text-xl font-bold text-gray-600">Long Queries</h2>
        <h2 className="text-xl font-bold text-gray-600">Queries In Progress</h2>
      </div>

      <div className="flex justify-between items-start gap-x-6">
        {/* Long Queries Table */}
        <div className="w-1/2">
          <table className="table-auto bg-gray-100 shadow-md rounded-lg overflow-hidden mb-6 w-full">
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
          <div className="flex justify-between items-center">
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
        <div className="w-1/2">
          <table className="table-auto bg-gray-100 shadow-md rounded-lg overflow-hidden mb-6 w-full">
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
