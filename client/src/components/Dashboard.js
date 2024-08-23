import React from 'react';
import SalesChart from './Totalsaleschart';
import RepeatCustomersChart from './RepeatCustomerChart';
import GeoDistributionChart from './GeographicalDistributionmap';
import NewCustomersChart from './NewCustomerChart';
import CohortValueChart from './LifetimeValueChart';
import '../Styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1 className='tag'>Business Dashboard</h1>
      <div className="chart-container">
        <SalesChart />
        <RepeatCustomersChart />
        <GeoDistributionChart />
        <NewCustomersChart />
        <CohortValueChart />
      </div>
    </div>
  );
};

export default Dashboard;
