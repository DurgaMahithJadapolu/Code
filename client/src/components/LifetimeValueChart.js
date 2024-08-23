import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../Styles/Charts.css';

// Register the components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CohortValueChart = () => {
  const [cohortData, setCohortData] = useState({
    labels: [], // Default empty labels
    datasets: [
      {
        label: 'Lifetime Value',
        data: [], // Default empty data
        backgroundColor: 'rgba(54,162,235,0.6)',
      },
    ],
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/customer-lifetime-value')
      .then(response => {
        console.log(response.data); // Log data to check its structure
        const data = response.data;
        if (Array.isArray(data)) {
          const chartData = {
            labels: data.map(entry => `${entry._id.year}-${entry._id.month}`),
            datasets: [
              {
                label: 'Lifetime Value',
                data: data.map(entry => entry.lifetimeValue),
                backgroundColor: 'rgba(54,162,235,0.6)',
              },
            ],
          };
          setCohortData(chartData);
        } else {
          console.error('Data format is incorrect.');
        }
      })
      .catch(error => {
        console.error(error); // Log error
      });
  }, []);

  return (
    <div className="chart">
      <h2>Customer Lifetime Value by Cohorts</h2>
      <Bar data={cohortData} />
    </div>
  );
};

export default CohortValueChart;
