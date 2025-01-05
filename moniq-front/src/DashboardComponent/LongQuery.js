import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LongQuery = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/long-query'); // URL du backend
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData(); // Appel initial

    const interval = setInterval(fetchData, 5000); // Interroger toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
  }, []);

  const chartData = {
    labels: data.map((item) => item.userId),
    datasets: [
      {
        label: 'Temps (s)',
        data: data.map((item) => item.time),
        backgroundColor: '#4F46E5',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,  // Assurer que l'axe Y commence à 0
        min: 0,  // Définir la valeur minimale à 0
        max: 40, // Définir la valeur maximale à 40
        stepSize: 5, // Définir le pas à 5
      },
    },
  };

  return (
    <div className="bg-white rounded-lg w-[350px] h-[240px] p-4">
      <h3 className="text-lg font-sans font-bold mb-2">Long Query</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default LongQuery;


