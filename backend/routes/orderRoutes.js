const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // ADDED THIS LINE
const Order = require('../models/Order');
const emailService = require('../utils/emailService');

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Delete order
router.delete('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOneAndDelete({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
});

// Get user's orders
router.get('/orders/my-orders', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    
    const orders = await Order.find({ user: decoded.id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders: orders
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Create new order
router.post('/orders', async (req, res) => {
  try {
    const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const orderData = {
      ...req.body,
      orderId,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add user ID if logged in
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
        orderData.user = decoded.id;
      } catch (jwtError) {
        // Token invalid, continue as guest
        console.log('Invalid token, proceeding as guest order');
      }
    }
    
    const order = new Order(orderData);
    await order.save();
    
    // Send confirmation email
    try {
      await emailService.sendOrderConfirmation(order);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the order if email fails
    }
    
    res.json({
      success: true,
      message: 'Order placed successfully!',
      order: order
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
});

// Get orders by status
router.get('/orders/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    const orders = await Order.find({ status }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Update order status
router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderId: orderId },
      { status: status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Send status update email
    try {
      await emailService.sendStatusUpdate(order, status);
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
    }
    
    res.json({
      success: true,
      message: 'Order status updated',
      order: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
});

// Get single order
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId: orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    
    // Get today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ 
      createdAt: { $gte: today } 
    });
    const todayRevenueResult = await Order.aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const todayRevenue = todayRevenueResult[0]?.total || 0;
    
    res.json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        todayOrders,
        todayRevenue: parseFloat(todayRevenue.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

module.exports = router;