import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../Styles/Charts.css';

// Register the components you need for the chart
ChartJS.register(
  CategoryScale, // Required for category (x-axis)
  LinearScale,   // Required for linear (y-axis)
  BarElement,    // Required for bar elements
  Title,
  Tooltip,
  Legend
);

const RepeatCustomersChart = () => {
  const [customerData, setCustomerData] = useState({
    labels: [],
    datasets: [], // Empty datasets
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/repeat-customers?interval=daily')
      .then(response => {
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          const chartData = {
            labels: data.map(entry => `${entry._id.year}-${entry._id.month}-${entry._id.day}`),
            datasets: [ // Add datasets only if there's data
              {
                label: 'Repeat Customers',
                data: data.map(entry => entry.total),
                backgroundColor: 'rgba(153,102,255,0.6)',
              },
            ],
          };
          setCustomerData(chartData);
        } else {
          console.warn('Unexpected data format:', data);
          setCustomerData({
            labels: [],
            datasets: [], // Empty datasets
          });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setCustomerData({
          labels: [],
          datasets: [], // Empty datasets
        });
      });
  }, []);

  return (
    <div className="chart">
      <h2>Repeat Customers Over Time</h2>
      <Bar data={customerData} />
    </div>
  );
};

export default RepeatCustomersChart;
