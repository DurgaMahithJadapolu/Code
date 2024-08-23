const mongoose = require('mongoose');

const Order = require('../Model/Order');
const Customer = require('../Model/Customer');

// // Helper function to aggregate data by time intervals

const aggregateByTime = (collection, matchStage, groupStage) => {
  return collection.aggregate([
    { $match: matchStage },
    {
      $project: {
        created_at: {
          $dateFromString: { dateString: "$created_at" } // Ensure date conversion
        }
      }
    },
    {
      $group: {
        _id: groupStage,
        total: { $sum: "$total_price_set.shop_money.amount" },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

const totalSalesOverTime = async (req, res) => {
  const { interval = 'daily' } = req.query;
  let groupStage;

  switch (interval) {
    case 'monthly':
      groupStage = { yearMonth: { $dateToString: { format: "%Y-%m", date: "$created_at" } } };
      break;
    case 'quarterly':
      // Custom logic for quarterly intervals might be needed
      groupStage = { yearMonth: { $dateToString: { format: "%Y-%m", date: "$created_at" } } };
      break;
    case 'yearly':
      groupStage = { year: { $dateToString: { format: "%Y", date: "$created_at" } } };
      break;
    case 'daily':
    default:
      groupStage = { dateString: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } } };
  }

  try {
    const salesData = await aggregateByTime(Order, {}, groupStage);
    res.json(salesData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Controller for Number of Repeat Customers

const repeatCustomersOverTime = async (req, res) => {
    const { interval = 'daily' } = req.query;
    let groupStage;
  
    // Define grouping based on interval
    switch (interval) {
      case 'monthly':
        groupStage = { year: { $year: "$created_at" }, month: { $month: "$created_at" }, customer: "$customer_id" };
        break;
      case 'quarterly':
        groupStage = { year: { $year: "$created_at" }, quarter: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } }, customer: "$customer_id" };
        break;
      case 'yearly':
        groupStage = { year: { $year: "$created_at" }, customer: "$customer_id" };
        break;
      case 'daily':
      default:
        groupStage = { year: { $year: "$created_at" }, month: { $month: "$created_at" }, day: { $dayOfMonth: "$created_at" }, customer: "$customer_id" };
    }
  
    try {
      const repeatCustomers = await Order.aggregate([
        // Ensure `created_at` is treated as a date
        { $addFields: { created_at: { $toDate: "$created_at" } } },
        // Group by the specified interval and customer ID
        { $group: { _id: groupStage, count: { $sum: 1 } } },
        // Filter for repeat customers
        { $match: { count: { $gt: 1 } } },
        // Regroup to consolidate data
        {
          $group: {
            _id: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day"
            },
            total: { $sum: 1 }
          }
        },
        // Sort results
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
      ]);
  
      res.json(repeatCustomers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  


// Controller for Geographical Distribution of Customers
const geographicalDistribution = async (req, res) => {
  try {
    const geoDistribution = await Customer.aggregate([
      { $group: { _id: "$default_address.city", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(geoDistribution);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Controller for New Customers Added Over Time

const newCustomersOverTime = async (req, res) => {
  const { interval = 'daily' } = req.query;
  let groupStage;

  switch (interval) {
    case 'monthly':
      groupStage = { 
        _id: { 
          year: { $year: { $toDate: "$created_at" } }, 
          month: { $month: { $toDate: "$created_at" } } 
        } 
      };
      break;
    case 'quarterly':
      groupStage = { 
        _id: { 
          year: { $year: { $toDate: "$created_at" } }, 
          quarter: { $ceil: { $divide: [{ $month: { $toDate: "$created_at" } }, 3] } } 
        } 
      };
      break;
    case 'yearly':
      groupStage = { 
        _id: { 
          year: { $year: { $toDate: "$created_at" } } 
        } 
      };
      break;
    case 'daily':
    default:
      groupStage = { 
        _id: { 
          year: { $year: { $toDate: "$created_at" } }, 
          month: { $month: { $toDate: "$created_at" } }, 
          day: { $dayOfMonth: { $toDate: "$created_at" } } 
        } 
      };
  }

  try {
    const customerData = await Customer.aggregate([
      { $match: { created_at: { $exists: true, $ne: null } } },  // Ensure created_at exists and is not null
      { $group: { _id: groupStage._id, count: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
    ]);

    res.json(customerData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





// Controller for Customer Lifetime Value by Cohorts
// const customerLifetimeValueByCohort = async (req, res) => {
//   try {
//     const customerLifetimeValue = await Order.aggregate([
//       {
//         $group: {
//           _id: { customer: "$customer_id", year: { $year: "$created_at" }, month: { $month: "$created_at" } },
//           totalSpent: { $sum: "$total_price_set.shop_money.amount" }
//         }
//       },
//       {
//         $group: {
//           _id: { year: "$_id.year", month: "$_id.month" },
//           lifetimeValue: { $sum: "$totalSpent" }
//         }
//       },
//       { $sort: { "_id.year": 1, "_id.month": 1 } }
//     ]);
//     res.json(customerLifetimeValue);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const customerLifetimeValueByCohort = async (req, res) => {
  try {
    const customerLifetimeValue = await Order.aggregate([
      {
        $group: {
          _id: {
            customer: "$customer_id",
            year: { $year: { $toDate: "$created_at" } },
            month: { $month: { $toDate: "$created_at" } }
          },
          totalSpent: { $sum: "$total_price_set.shop_money.amount" }
        }
      },
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month"
          },
          lifetimeValue: { $sum: "$totalSpent" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json(customerLifetimeValue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




module.exports = {
  totalSalesOverTime,
  newCustomersOverTime,
  repeatCustomersOverTime,
  geographicalDistribution,
  customerLifetimeValueByCohort
};
