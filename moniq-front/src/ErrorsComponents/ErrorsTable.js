import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ErrorsTable() {
  const [errors, setErrors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  useEffect(() => {
    // Fonction pour récupérer les erreurs depuis le backend
    const fetchErrors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/errors"); // Utilisez la route existante
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des erreurs");
        }
        const data = await response.json();
        setErrors(data);
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    // Récupérer les données immédiatement et toutes les 5 secondes
    fetchErrors();
    const intervalId = setInterval(fetchErrors, 5000);

    // Nettoyage lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  // Pagination logic
  const indexOfLastError = currentPage * rowsPerPage;
  const indexOfFirstError = indexOfLastError - rowsPerPage;
  const currentErrors = errors.slice(indexOfFirstError, indexOfLastError);

  const nextPage = () => {
    if (currentPage < Math.ceil(errors.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-gray-600 mb-4">Errors Table</h2>
      <table className="table-auto bg-gray-100 shadow-md rounded-lg overflow-hidden mb-6 w-full">
        <thead className="bg-white text-gray-600 text-xs font-bold">
          <tr>
            <th className="px-4 py-2 uppercase tracking-wider">Level</th>
            <th className="px-4 py-2 uppercase tracking-wider">Message</th>
            <th className="px-4 py-2 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody>
          {currentErrors.map((error, index) => (
            <tr key={index} className="text-center text-sm border-t border-gray-300 hover:bg-gray-50">
              <td className="px-4 py-3">{error.Level}</td>
              <td className="px-4 py-3">{error.Message}</td>
              <td className="px-4 py-3">{error.Date}</td>
            </tr>
          ))}
          {currentErrors.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center py-3 text-gray-500">
                No errors found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination buttons */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 text-white bg-gray-300 rounded ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronLeft />
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(errors.length / rowsPerPage)}
          className={`px-4 py-2 text-white bg-gray-300 rounded ${
            currentPage === Math.ceil(errors.length / rowsPerPage) ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default ErrorsTable;