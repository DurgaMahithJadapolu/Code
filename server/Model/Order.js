const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: String,
  created_at: Date,
  total_price_set: {
    shop_money: {
      amount: String,
      currency_code: String
    }
  },
  customer: Object,
});

module.exports = mongoose.model('Order', orderSchema, 'shopifyOrders');
