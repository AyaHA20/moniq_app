import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MediumCard = ({ type }) => {
  const [usage, setUsage] = useState(0); // Valeur d'utilisation en temps réel

  // Fonction pour déterminer la couleur en fonction de l'usage
  const getColor = (usage) => {
    if (usage >= 80) return '#EE6542'; // Rouge pour plus de 80%
    if (usage >= 60) return '#EEC642'; // Jaune pour 60-79%
    return '#7FBD70'; // Vert pour moins de 60%
  };

  // Données pour le graphique circulaire
  const chartData = {
    labels: ['Utilisation'],
    datasets: [
      {
        data: [usage, 100 - usage],
        backgroundColor: [getColor(usage), '#E0E0E0'],
        hoverBackgroundColor: [getColor(usage), '#E0E0E0'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    elements: { arc: { borderWidth: 0 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/usage'); // Exemple d'URL pour récupérer les données
        const data = await response.json();
        if (type === 'CPU') setUsage(data.cpuUsage);
        else if (type === 'Mem') setUsage(data.memUsage);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Mise à jour toutes les 5 secondes
    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="bg-white rounded-lg w-[230px] h-[130px] p-2 flex flex-col  ">
      {/* Titre et usage en temps réel */}
      <div className="flex justify-between mb-[1px]"> {/* Réduit la marge en bas */}
        <div className="flex flex-col">
          <span className="text-sm font-bold font-sans text-black  mt-[1px]">{type}</span> {/* Réduit la marge en haut */}
          <span className="text-xs text-gray-500 mt-[1px]">{usage}% using</span> {/* Petite marge */}
        </div>
      </div>

      {/* Contenu principal de la carte */}
      <div className="flex items-center justify-between">
        {/* Conteneur des carrés colorés */}
        <div className="flex flex-col space-y-[1px]"> {/* Réduit l'espacement entre les carrés */}
          <div className="flex items-center">
            <div className="h-4 w-4 bg-red-500 rounded mr-2"></div>
            <span className="text-sm">{'<= 80%'}</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-yellow-500 rounded mr-2"></div>
            <span className="text-sm">{'<=60%'}</span>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 bg-lime-600 rounded mr-2"></div>
            <span className="text-sm">{'<= 20%'}</span>
          </div>
        </div>

        {/* Graphique circulaire */}
        <div className="w-[80px] h-[80px] mt-0">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default MediumCard; 
