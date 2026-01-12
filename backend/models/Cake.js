const mongoose = require('mongoose');

const cakeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: Number,
  category: String,
  image: String,
  rating: Number,
  flavors: [String],
  sizes: [String],
  isPopular: Boolean,
  isNew: Boolean
});

module.exports = mongoose.model('Cake', cakeSchema);