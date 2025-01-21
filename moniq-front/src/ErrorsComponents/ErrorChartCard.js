import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ErrorChartCard = ({ totalErrors, errorData }) => {
  const chartData = {
    labels: ['Error', 'Alert'],
    datasets: [
      {
        data: errorData, // Tableau contenant les valeurs pour chaque catégorie
        backgroundColor: ['#FF4B55', '#FFA500'],
        hoverBackgroundColor: ['#FF4B55', '#FFA500'],
        borderWidth: 0,
      },
    ],
  };

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
        <div className="flex items-center mt-4">
          <div className="h-5 w-5 bg-red-500 rounded mr-2 mt-4 "></div>
          <span className="text-sm mt-4 font-bold">Error</span>
        </div>
        <div className="flex items-center">
          <div className="h-5 w-5 bg-orange-500 rounded mr-2 mt-4"></div>
          <span className="text-sm mt-4 font-bold">Alert</span>
        </div>
        
      </div>
    </div>
  );
};

export default ErrorChartCard;
