const express = require('express');
const router = express.Router();
const CustomerController = require('../Controllers/analyticsController');




router.get('/total-sales', CustomerController.totalSalesOverTime);
router.get('/repeat-customers', CustomerController.repeatCustomersOverTime);
router.get('/geo-distribution', CustomerController.geographicalDistribution);
router.get('/new-customers', CustomerController.newCustomersOverTime);
router.get('/customer-lifetime-value', CustomerController.customerLifetimeValueByCohort);

module.exports = router;
