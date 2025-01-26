import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ErrorChartCard = () => {
  const [totalErrors, setTotalErrors] = useState(0); // Total des erreurs
  const [errorData, setErrorData] = useState([0, 0]); // Données pour le graphique (Error, Warning)

  // Fonction pour récupérer les données depuis le backend
  const fetchErrorData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/errors'); // Remplacez par votre endpoint
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      const data = await response.json();

      // Calculer le nombre total d'erreurs et d'avertissements
      const errorCount = data.filter((error) => error.Level === 'Error').length;
      const warningCount = data.filter((error) => error.Level === 'Warning').length;

      // Mettre à jour l'état
      setTotalErrors(errorCount + warningCount);
      setErrorData([errorCount, warningCount]);
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  // Récupérer les données toutes les 5 secondes
  useEffect(() => {
    fetchErrorData(); // Récupérer les données immédiatement
    const intervalId = setInterval(fetchErrorData, 5000); // Récupérer les données toutes les 5 secondes

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []);

  // Données pour le graphique
  const chartData = {
    labels: ['Error', 'Warning'], // Mettre à jour les labels
    datasets: [
      {
        data: errorData, // Tableau contenant les valeurs pour chaque catégorie
        backgroundColor: ['#FF4B55', '#FFA500'],
        hoverBackgroundColor: ['#FF4B55', '#FFA500'],
        borderWidth: 0,
      },
    ],
  };

  // Options du graphique
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    cutout: '70%',
  };

  return (
    <div className="bg-white font-sans rounded-lg w-[230px] h-full p-4 flex flex-col items-center justify-between shadow-md">
      {/* Graphique en anneau */}
      <div className="relative w-[120px] h-[120px]">
        <Doughnut data={chartData} options={chartOptions} />
        {/* Total des erreurs au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold">{totalErrors}</span>
          <span className="text-sm text-gray-500">errors</span>
        </div>
      </div>

      {/* Légende */}
      <div className="mt-4 mb-4 space-y-6">
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-red-500 rounded mr-2"></div>
            <span className="text-sm font-bold">Error</span>
          </div>
          <span className="text-sm ml-3 text-gray-600">{errorData[0]}</span> {/* Nombre d'erreurs */}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-orange-500 rounded mr-2"></div>
            <span className="text-sm font-bold">Warning</span>
          </div>
          <span className="text-sm ml-3  text-gray-600">{errorData[1]}</span> {/* Nombre d'avertissements */}
        </div>
      </div>
    </div>
  );
};

export default ErrorChartCard;