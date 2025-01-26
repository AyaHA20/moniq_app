import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LongQuery = () => {
  const [data, setData] = useState([]);

  // Fonction pour convertir "HH:MM:SS.SSS" en secondes
  const convertToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Appel à l'API pour récupérer les requêtes longues
        const response = await fetch('http://localhost:3000/api/long-queries');
        const result = await response.json();

        // Vérifie que la réponse est un tableau
        if (Array.isArray(result)) {
          // Convertir les temps d'exécution en secondes
          const formattedData = result.map((item) => ({
            ...item,
            Execution_Time: convertToSeconds(item.Execution_Time),
          }));

          // Trier les données par Execution_Time (du plus long au plus court)
          const sortedData = formattedData.sort((a, b) => b.Execution_Time - a.Execution_Time);

          // Garder uniquement les 3 requêtes les plus longues
          const top3Data = sortedData.slice(0, 3);

          setData(top3Data);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau :', result);
          setData([]); // Initialise avec un tableau vide
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setData([]); // Initialise avec un tableau vide en cas d'erreur
      }
    };

    fetchData(); // Appel initial
    const interval = setInterval(fetchData, 60000); // Interroger toutes les 1 minute
    return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
  }, []);

  // Préparer les données pour le graphique
  const chartData = {
    labels: data.map((item) => {
      // Raccourcir l'étiquette User_ID pour qu'elle tienne mieux sur l'axe X
      const userId = item.User_ID;
      return userId.length > 20 ? userId.substring(0, 20) + '...' : userId;
    }),
    datasets: [
      {
        label: 'Temps (s)',
        data: data.map((item) => item.Execution_Time), // Utiliser Execution_Time converti en secondes
        backgroundColor: '#4F46E5', // Couleur des barres
      },
    ],
  };

  // Options du graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Désactiver l'ajustement automatique des étiquettes
          maxRotation: 45, // Rotation des étiquettes pour qu'elles ne se chevauchent pas
          minRotation: 45, // Rotation des étiquettes pour qu'elles ne se chevauchent pas
        },
      },
      y: {
        beginAtZero: true, // Assurer que l'axe Y commence à 0
        min: 0, // Définir la valeur minimale à 0
        max: 200, // Définir la valeur maximale à 200
        ticks: {
          stepSize: 30, // Définir le pas à 30 secondes
          callback: (value) => {
            // Afficher uniquement les valeurs spécifiques
            const allowedValues = [0, 30, 60, 90, 120, 150, 200];
            return allowedValues.includes(value) ? value : null;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Masquer la légende si elle n'est pas nécessaire
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