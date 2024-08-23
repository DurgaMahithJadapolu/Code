const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: String,
  title: String,
  vendor: String,
  created_at: Date,
  updated_at: Date,
  variants: Array,
});

module.exports = mongoose.model('Product', productSchema, 'shopifyProducts');
