import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const UserCard = () => {
  const [data, setData] = useState({ admins: 0, users: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user-data'); // URL du backend
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData(); // Appel initial pour récupérer les données

    const interval = setInterval(fetchData, 5000); // Rafraîchir toutes les 5 secondes

    return () => clearInterval(interval); // Nettoyer l'intervalle au démontage
  }, []);

  const chartData = {
    labels: ['Utilisateurs'],
    datasets: [
      {
        label: 'Admin',
        data: [data.admins],
        backgroundColor: '#20195F',
      },
      {
        label: 'User',
        data: [data.users],
        backgroundColor: '#A5B4FC',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        min: 0, // Début de l'axe y à 0
        max: 100, // Fin de l'axe y à 100
        stepSize: 20, // Pas de 20
      },
    },
  };

  return (
    <div className="bg-white rounded-lg w-[350px] h-[240px] p-4">
      <h3 className="text-lg font-sans font-bold mb-2">Users</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default UserCard;

