import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-plugin-datalabels'; // Import the plugin

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GeoDistribution = () => {
  const [chartData, setChartData] = useState({
    labels: [], // X-axis labels
    datasets: [
      {
        label: 'Geographical Distribution',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color
        borderColor: 'rgba(75, 192, 192, 1)', // Border color
        borderWidth: 1, // Border width
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://code-backend-tqsq.onrender.com/api/geo-distribution')
      .then(response => {
        const data = response.data;
        if (Array.isArray(data)) {
          // Process the data for Chart.js
          const labels = data.map(item => item.region); // Extract region names
          const dataPoints = data.map(item => item.count); // Extract count values

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Geographical Distribution',
                data: dataPoints,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                datalabels: {
                  display: true, // Show data labels
                  color: '#000', // Text color for labels
                  anchor: 'end',
                  align: 'top',
                },
              },
            ],
          });
        } else {
          setError('Data format is incorrect or API returned an unexpected result.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='chart'>
      <h2>Geographical Distribution</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            datalabels: {
              display: true,
              color: '#000', // Color for data labels
              anchor: 'end',
              align: 'top',
            },
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Count: ${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Region', // Label for X-axis
              },
            },
            y: {
              title: {
                display: true,
                text: 'Count', // Label for Y-axis
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default GeoDistribution;
