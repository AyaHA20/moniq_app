import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const UserCard = () => {
  const [data, setData] = useState({ admins: 0, users: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Appel à l'API pour récupérer les données des utilisateurs
        const response = await fetch('http://localhost:3000/api/user-counts');
        const result = await response.json();

        // Mise à jour de l'état avec les données reçues
        setData({
          admins: result.adminCount,
          users: result.userCount,
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData(); // Appel initial pour récupérer les données
    const interval = setInterval(fetchData, 5000); // Rafraîchir toutes les 5 secondes
    return () => clearInterval(interval); // Nettoyer l'intervalle au démontage
  }, []);

  // Préparer les données pour le graphique
  const chartData = {
    labels: ['Utilisateurs'],
    datasets: [
      {
        label: 'Admin',
        data: [data.admins],
        backgroundColor: '#20195F', // Couleur pour les admins
      },
      {
        label: 'User',
        data: [data.users],
        backgroundColor: '#A5B4FC', // Couleur pour les utilisateurs
      },
    ],
  };

  // Options du graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' }, // Position de la légende
    },
    scales: {
      x: { stacked: true }, // Barres empilées sur l'axe X
      y: {
        stacked: true, // Barres empilées sur l'axe Y
        min: 0, // Début de l'axe Y à 0
        max: 5, // Fin de l'axe Y à 5
        ticks: {
          stepSize: 1, // Pas de 1
        },
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