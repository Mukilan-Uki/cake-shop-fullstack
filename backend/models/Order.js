const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryType: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  deliveryAddress: String,
  specialInstructions: String,
  paymentMethod: { type: String, enum: ['cash', 'card', 'online'], default: 'cash' },
  
  // Cake design details
  base: String,
  frosting: String,
  size: String,
  layers: Number,
  toppings: [String],
  message: String,
  colors: {
    cake: String,
    frosting: String,
    decorations: String
  },
  
  totalPrice: Number,
  status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// orderSchema.pre('save', function(next) {
//   this.updatedAt = Date.now();
//   next();
// });

orderSchema.pre('save', async function(next) {
  try {
    this.updatedAt = Date.now();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Order', orderSchema);