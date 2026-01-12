const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

// Import routes
const orderRoutes = require('./routes/orderRoutes');
const cakeRoutes = require('./routes/cakeRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeShopDB';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('MongoDB Connected Successfully!');
    
    // Seed initial data
    seedInitialData();
})
.catch((error) => {
    console.log('MongoDB Connection Error:', error.message);
});

async function seedInitialData() {
  const Cake = require('./models/Cake');
  const count = await Cake.countDocuments();
  
  if (count === 0) {
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
      },
      {
        name: "Strawberry Bliss",
        description: "Fresh strawberry cake with cream cheese frosting and strawberry topping",
        price: 42.99,
        category: "Anniversary",
        image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop",
        rating: 4.9,
        flavors: ["Strawberry", "Cream Cheese"],
        sizes: ["Small", "Medium", "Large"],
        isPopular: true,
        isNew: true
      }
    ];
    
    await Cake.insertMany(cakesData);
    console.log('Initial cake data seeded');
  }
}

// Routes
app.use('/api', orderRoutes);
app.use('/api', cakeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'mongodb_connected' : 'disconnected',
    port: PORT
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Cake Shop Backend</title></head>
      <body style="font-family: Arial; padding: 20px;">
        <h1>Cake Shop Backend is Running!</h1>
        <p><strong>Status:</strong> Server is working</p>
        <p><strong>Database:</strong> ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}</p>
        <p><strong>Endpoints:</strong></p>
        <ul>
          <li><a href="/health">/health</a> - Health check</li>
          <li><a href="/api/orders">GET /api/orders</a> - View orders</li>
          <li><a href="/api/cakes">GET /api/cakes</a> - View cakes</li>
          <li><a href="/api/stats">GET /api/stats</a> - View statistics</li>
        </ul>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server started on: http://localhost:${PORT}`);
  console.log(`API Endpoints:`);
  console.log(`  GET  http://localhost:${PORT}/api/orders`);
  console.log(`  POST http://localhost:${PORT}/api/orders`);
  console.log(`  GET  http://localhost:${PORT}/api/cakes`);
  console.log(`  GET  http://localhost:${PORT}/api/stats`);
});