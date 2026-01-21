const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Make it optional for guest checkout
  },
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
  status: { 
    type: String, 
    enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp before saving - ONLY ONE MIDDLEWARE
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexes for better performance
orderSchema.index({ orderId: 1 }, { unique: true });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ email: 1 });
orderSchema.index({ user: 1 });

// Virtual property for active orders
orderSchema.virtual('isActive').get(function() {
  return ['Pending', 'Preparing', 'Ready'].includes(this.status);
});

// Method to get formatted delivery date
orderSchema.methods.getFormattedDeliveryDate = function() {
  return this.deliveryDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

module.exports = mongoose.model('Order', orderSchema);