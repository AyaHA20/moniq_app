import React, { useState, useEffect } from 'react';
import ErrorsTable from './ErrorsTable';
import ErrorChartCard from './ErrorChartCard';

function ErrorsManage() {
  const [errors, setErrors] = useState([]);
  const [errorStats, setErrorStats] = useState({
    totalErrors: 0,
    errorData: [0, 0], 
  });

  useEffect(() => {
    const fetchErrorsData = async () => {
      try {
        // Récupération des erreurs pour le tableau
        const errorsResponse = await fetch('http://localhost:5000/api/errors'); // Remplacez l'URL par celle de votre API
        if (!errorsResponse.ok) {
          throw new Error("Erreur lors de la récupération des erreurs");
        }
        const errorsData = await errorsResponse.json();
        setErrors(errorsData);

        // Récupération des statistiques des erreurs pour le graphique
        const statsResponse = await fetch('http://localhost:5000/api/error-stats'); // API pour les statistiques
        if (!statsResponse.ok) {
          throw new Error("Erreur lors de la récupération des statistiques d'erreurs");
        }
        const statsData = await statsResponse.json();
        setErrorStats({
          totalErrors: statsData.totalErrors,
          errorData: statsData.errorLevels,
        });
      } catch (error) {
        console.error("Erreur :", error);
      }
    };

    // Récupérer les données immédiatement et toutes les 5 secondes
    fetchErrorsData();
    const intervalId = setInterval(fetchErrorsData, 5000);

    // Nettoyage lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-between gap-5">
      <div className="mt-5 bg-white w-4/5 h-full p-6 rounded-lg">
        {/* Tableau des erreurs */}
        <ErrorsTable errors={errors} />
      </div>
      <div className="w-1/5 h-full p-6 rounded-lg flex flex-col items-center">
        {/* Carte des statistiques des erreurs */}
        <ErrorChartCard totalErrors={errorStats.totalErrors} errorData={errorStats.errorData} />
      </div>
    </div>
  );
}

export default ErrorsManage;
