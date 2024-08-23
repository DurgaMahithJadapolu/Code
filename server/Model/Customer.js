const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  id: String,
  email: String,
  first_name: String,
  last_name: String,
  created_at: Date,
  orders_count: Number,
  total_spent: Number,
  last_order_id: String,
  default_address: {
    city: String,
    country: String,
    address1: String
  }
});

module.exports = mongoose.model('Customer', customerSchema, 'shopifyCustomers');
