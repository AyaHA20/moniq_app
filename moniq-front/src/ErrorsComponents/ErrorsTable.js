import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function ErrorsTable() {
    const [errors, setErrors] = useState([
        { id: 1, level: "Error", message: "Invalid query syntax", dateTime: "2025-01-21 10:30", action: "Retry" },
        { id: 2, level: "Alert", message: "Slow response time", dateTime: "2025-01-21 11:00", action: "Investigate" },
        { id: 3, level: "Error", message: "Database connection failed", dateTime: "2025-01-21 12:15", action: "Reconnect" },
        { id: 4, level: "Alert", message: "Backup completed", dateTime: "2025-01-21 13:00", action: "Acknowledge" },
        { id: 5, level: "Error", message: "Disk space low", dateTime: "2025-01-21 14:00", action: "Clean" },
        { id: 6, level: "Error", message: "Unauthorized access detected", dateTime: "2025-01-21 15:00", action: "Secure" },
        { id: 7, level: "Alert", message: "Server restarted", dateTime: "2025-01-21 16:00", action: "Acknowledge" },
        { id: 1, level: "Error", message: "Invalid query syntax", dateTime: "2025-01-21 10:30", action: "Retry" },
        { id: 7, level: "Alert", message: "Server restarted", dateTime: "2025-01-21 16:00", action: "Acknowledge" },
        { id: 1, level: "Error", message: "Invalid query syntax", dateTime: "2025-01-21 10:30", action: "Retry" }
      ]);
    
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

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
            <th className="px-4 py-2 uppercase tracking-wider">Date/Time</th>
            <th className="px-4 py-2 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentErrors.map((error) => (
            <tr key={error.id} className="text-center text-sm border-t border-gray-300 hover:bg-gray-50">
              <td className="px-4 py-3">{error.level}</td>
              <td className="px-4 py-3">{error.message}</td>
              <td className="px-4 py-3">{error.dateTime}</td>
              <td className="px-4 py-3">
                <button className="text-blue-600 hover:underline">{error.action}</button>
              </td>
            </tr>
          ))}
          {currentErrors.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-3 text-gray-500">
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
            currentPage === 1 
          }`}
        >
         <FiChevronLeft />
        </button>
        
        <button
          onClick={nextPage}
          disabled={currentPage === Math.ceil(errors.length / rowsPerPage)}
          className={`px-4 py-2 text-white bg-gray-300 rounded ${
            currentPage === Math.ceil(errors.length / rowsPerPage)
            
          }`}
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}

export default ErrorsTable;
