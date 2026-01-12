const express = require('express');
const router = express.Router();
const Cake = require('../models/Cake');

// Get all cakes
router.get('/cakes', async (req, res) => {
  try {
    const cakes = await Cake.find();
    res.json({
      success: true,
      count: cakes.length,
      cakes: cakes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cakes',
      error: error.message
    });
  }
});

// Seed cakes data
router.post('/cakes/seed', async (req, res) => {
  try {
    const cakesData = [
      {
        name: "Chocolate Dream",
        description: "Rich dark chocolate cake with creamy chocolate ganache and chocolate shavings",
        price: 45.99,
        category: "Birthday",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        rating: 4.8,
        flavors: ["Chocolate", "Dark Chocolate"],
        sizes: ["Small", "Medium", "Large"],
        isPopular: true,
        isNew: false
      },
      {
        name: "Vanilla Elegance",
        description: "Classic vanilla sponge with buttercream frosting and fresh berries",
        price: 39.99,
        category: "Wedding",
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&h=300&fit=crop",
        rating: 4.6,
        flavors: ["Vanilla", "Buttercream"],
        sizes: ["Medium", "Large"],
        isPopular: true,
        isNew: false
      }
    ];
    
    await Cake.deleteMany({});
    const cakes = await Cake.insertMany(cakesData);
    
    res.json({
      success: true,
      message: 'Cakes seeded successfully',
      count: cakes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding cakes',
      error: error.message
    });
  }
});

module.exports = router;