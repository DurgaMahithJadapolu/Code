import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TotalSales = () => {
  const [chartData, setChartData] = useState({
    labels: [], // X-axis labels
    datasets: [
      {
        label: 'Total Sales',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Background color
        borderColor: 'bule', // Border color
        borderWidth: 5, // Border width
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/total-sales')
      .then(response => {
        console.log(response.data); // Log entire data
        console.log(response.data[0]); // Log a sample item
        if (Array.isArray(response.data)) {
          // Process the data for Chart.js
          const labels = response.data.map(item => item.name); // Extract names for X-axis
          const dataPoints = response.data.map(item => item.sales); // Extract sales values

          setChartData({
            labels: labels,
            datasets: [
              {
                label: 'Total Sales',
                data: dataPoints,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'blue',
                borderWidth: 1,
              },
            ],
          });
        } else {
          setError('Data format is incorrect or API returned an unexpected result.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err); // Log the error
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='chart'>
      <h2>Total Sales</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              callbacks: {
                label: function(tooltipItem) {
                  return `Sales: ${tooltipItem.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Items', // Label for X-axis
              },
            },
            y: {
              title: {
                display: true,
                text: 'Sales', // Label for Y-axis
              },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

export default TotalSales;
