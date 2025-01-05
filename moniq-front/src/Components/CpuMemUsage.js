import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CpuMemUsage() {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "CPU",
        data: [],
        borderColor: "#EEC642", // Jaune
        backgroundColor: "rgba(250, 204, 21, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: "Mem",
        data: [],
        borderColor: "#EE6542", // Rouge
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://your-backend-api.com/usage");
        const result = await response.json();
        const currentTime = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        setData((prevData) => {
          const updatedLabels = [...prevData.labels, currentTime].slice(-10);
          const updatedCpuData = [...prevData.datasets[0].data, result.cpu].slice(-10);
          const updatedMemData = [...prevData.datasets[1].data, result.mem].slice(-10);

          return {
            labels: updatedLabels,
            datasets: [
              { ...prevData.datasets[0], data: updatedCpuData },
              { ...prevData.datasets[1], data: updatedMemData },
            ],
          };
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg   p-6 h-[200px] w-full overflow-hidden">
      <h2 className="text-lg font-bold font-sans text-black mb-0">
        Mem and CPU Usage by Time
      </h2>
      <div className="relative h-full w-full">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false, // Respecte la hauteur du conteneur
            plugins: {
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Usage (%)",
                },
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 25,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default CpuMemUsage


