import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import '../Styles/Charts.css';

// Register the components
Chart.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const NewCustomersChart = () => {
  const [newCustomersData, setNewCustomersData] = useState({
    labels: [],
    datasets: [
      {
        label: 'New Customers',
        data: [],
        borderColor: 'rgba(75,192,192,1)', // Line color
        backgroundColor: 'rgba(75,192,192,0.2)', // Fill color (under the line)
        borderWidth: 3, // Line width
        pointBackgroundColor: 'rgba(75,192,192,1)', // Point color
        pointBorderColor: '#fff', // Point border color
        pointHoverBackgroundColor: '#fff', // Point hover color
        pointHoverBorderColor: 'rgba(75,192,192,1)', // Point hover border color
        fill: true, // Fill area under the line
        tension: 0.3, // Line tension (curve)
      },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/new-customers')
      .then(response => {
        console.log(response.data); // Log data to check its structure
        if (Array.isArray(response.data) && response.data.length > 0) {
          const data = response.data;
          const chartData = {
            labels: data.map(entry => `${entry._id.year}-${entry._id.month}-${entry._id.day}`),
            datasets: [
              {
                label: 'New Customers',
                data: data.map(entry => entry.count),
                borderColor: 'rgba(75,192,192,1)', // Line color
                backgroundColor: 'rgba(75,192,192,0.2)', // Fill color (under the line)
                borderWidth: 3, // Line width
                pointBackgroundColor: 'rgba(75,192,192,1)', // Point color
                pointBorderColor: '#fff', // Point border color
                pointHoverBackgroundColor: '#fff', // Point hover color
                pointHoverBorderColor: 'rgba(75,192,192,1)', // Point hover border color
                fill: true, // Fill area under the line
                tension: 0.3, // Line tension (curve)
              },
            ],
          };
          setNewCustomersData(chartData);
        } else {
          setError('Data format is incorrect or empty.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err); // Log error
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="chart">
      <h2>New Customers Over Time</h2>
      <Line 
        data={newCustomersData}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'New Customers Over Time',
              font: {
                size: 18,
                weight: 'bold',
              },
              color: '#333',
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.7)',
              titleColor: '#fff',
              bodyColor: '#fff',
            },
            legend: {
              position: 'top',
              labels: {
                color: '#333',
                font: {
                  size: 14,
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(0,0,0,0.1)',
              },
              ticks: {
                color: '#333',
              },
            },
            y: {
              grid: {
                color: 'rgba(0,0,0,0.1)',
              },
              ticks: {
                color: '#333',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default NewCustomersChart;
