import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import io from 'socket.io-client';
import 'chartjs-adapter-date-fns'; // Import date adapter

const socket = io();

const CpuMemoryChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'CPU Usage (%)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
            {
                label: 'Memory Usage (%)',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            }
        ]
    });

    useEffect(() => {
        // Fetch the initial data via API
        fetch('/api/metrics')
            .then((response) => response.json())
            .then((data) => {
                console.log('Initial data from API:', data); // Log API response
                if (data && data.length > 0) {
                    const labels = data.map(item => new Date(item.timestamp)); // Convert string to Date
                    const cpuData = data.map(item => item.cpu);
                    const memoryData = data.map(item => item.memory);

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'CPU Usage (%)',
                                data: cpuData,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                            },
                            {
                                label: 'Memory Usage (%)',
                                data: memoryData,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                fill: true,
                            }
                        ]
                    });
                } else {
                    console.log('No data available from the API');
                }
            })
            .catch((error) => {
                console.error('Error fetching data from API:', error);
            });

        // Handle real-time updates
        socket.on('update', (data) => {
            console.log('Received update:', data); // Log real-time updates
            if (data && data.timestamp && data.cpu !== undefined && data.memory !== undefined) {
                setChartData((prevData) => {
                    const updatedLabels = [...prevData.labels, new Date(data.timestamp)]; // Convert timestamp to Date
                    const updatedCpuData = [...prevData.datasets[0].data, data.cpu];
                    const updatedMemoryData = [...prevData.datasets[1].data, data.memory];

                    // Limit the number of points displayed on the graph (keep the last 50 points)
                    if (updatedLabels.length > 50) {
                        updatedLabels.shift();
                        updatedCpuData.shift();
                        updatedMemoryData.shift();
                    }

                    return {
                        labels: updatedLabels,
                        datasets: [
                            {
                                label: 'CPU Usage (%)',
                                data: updatedCpuData,
                                borderColor: 'rgba(75, 192, 192, 1)',
                                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                fill: true,
                            },
                            {
                                label: 'Memory Usage (%)',
                                data: updatedMemoryData,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                fill: true,
                            }
                        ]
                    };
                });
            }
        });

        // Clean up the socket connection
        return () => {
            socket.off('update');
        };
    }, []);

    return (
        <div>
            <h2>CPU and Memory Usage Over Time</h2>
            {chartData.labels.length === 0 ? (
                <p>Loading chart data...</p>
            ) : (
                <Line
                    data={chartData}
                    options={{
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'second',
                                    tooltipFormat: 'll HH:mm',
                                },
                                title: {
                                    display: true,
                                    text: 'Time',
                                },
                            },
                            y: {
                                min: 0,
                                max: 100,
                                title: {
                                    display: true,
                                    text: 'Usage (%)',
                                },
                            },
                        },
                    }}
                />
            )}
        </div>
    );
};

export default CpuMemoryChart;
