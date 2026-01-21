const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Apply security headers
app.use(helmet());

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration - more secure
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://localhost:5001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Add before other routes
app.get('/api/test-auth', (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('Auth header:', authHeader);
  res.json({
    success: true,
    message: 'Test endpoint working',
    authHeader: authHeader
  });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cakeRoutes = require('./routes/cakeRoutes');
const emailRoutes = require('./routes/emailRoutes');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeShopDB';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  
  // Seed initial data if needed
  seedInitialData();
})
.catch((error) => {
  console.log('❌ MongoDB Connection Error:', error.message);
  console.log('💡 Tip: Make sure MongoDB is running locally or update MONGODB_URI in .env file');
});

async function seedInitialData() {
  const Cake = require('./models/Cake');
  const User = require('./models/User');
  
  // Check if we have cakes
  const cakeCount = await Cake.countDocuments();
  
  if (cakeCount === 0) {
    console.log('🌱 Seeding initial cake data...');
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
    console.log('✅ Initial cake data seeded');
  }
  
  // Check if we have admin user
  const adminCount = await User.countDocuments({ role: 'admin' });
  if (adminCount === 0) {
    console.log('👑 Creating admin user...');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    await User.create({
      name: 'Admin',
      email: 'admin@cubecake.com',
      phone: '0743086099',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('✅ Admin user created (admin@cubecake.com / admin123)');
  }
}

// Apply rate limiting to auth routes
app.use('/api/auth', authLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', orderRoutes);
app.use('/api', cakeRoutes);
app.use('/api/email', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  const uptime = process.uptime();
  
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
    memory: process.memoryUsage(),
    nodeVersion: process.version
  });
});

// API documentation
app.get('/api-docs', (req, res) => {
  res.json({
    message: 'Cube Cake API Documentation',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'PUT /api/auth/profile',
        profileTest: 'GET /api/auth/profile-test'
      },
      orders: {
        getAll: 'GET /api/orders',
        create: 'POST /api/orders',
        myOrders: 'GET /api/orders/my-orders',
        updateStatus: 'PATCH /api/orders/:orderId/status',
        delete: 'DELETE /api/orders/:orderId',
        stats: 'GET /api/stats'
      },
      cakes: {
        getAll: 'GET /api/cakes',
        seed: 'POST /api/cakes/seed'
      },
      email: {
        test: 'GET /api/email/test-email',
        config: 'GET /api/email/config'
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cube Cake Backend API</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
          background: linear-gradient(135deg, #FF9E6D 0%, #FF6B8B 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        
        .container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 800px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          text-align: center;
        }
        
        h1 {
          color: #4A2C2A;
          margin-bottom: 20px;
          font-size: 2.5rem;
        }
        
        .logo {
          font-family: 'Dancing Script', cursive;
          font-size: 3rem;
          background: linear-gradient(135deg, #FF9E6D 0%, #FF6B8B 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        
        .status {
          display: inline-block;
          background: #4CAF50;
          color: white;
          padding: 10px 20px;
          border-radius: 50px;
          margin-bottom: 30px;
          font-weight: bold;
        }
        
        .endpoints {
          text-align: left;
          margin-top: 30px;
        }
        
        .endpoint {
          background: #FFF5E6;
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 15px;
          border-left: 4px solid #FF9E6D;
        }
        
        .method {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 5px;
          font-weight: bold;
          margin-right: 10px;
          font-size: 0.9rem;
        }
        
        .get { background: #4CAF50; color: white; }
        .post { background: #2196F3; color: white; }
        .put { background: #FF9800; color: white; }
        .delete { background: #F44336; color: white; }
        .patch { background: #9C27B0; color: white; }
        
        .url {
          font-family: monospace;
          color: #4A2C2A;
          font-weight: 500;
        }
        
        .description {
          color: #666;
          margin-top: 5px;
          font-size: 0.9rem;
        }
        
        .links {
          margin-top: 40px;
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 12px 24px;
          border-radius: 50px;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #FF9E6D 0%, #FF6B8B 100%);
          color: white;
        }
        
        .btn-secondary {
          background: #4A2C2A;
          color: white;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        
        .db-status {
          margin: 20px 0;
          padding: 10px;
          border-radius: 10px;
          background: ${mongoose.connection.readyState === 1 ? '#E8F5E9' : '#FFEBEE'};
          color: ${mongoose.connection.readyState === 1 ? '#2E7D32' : '#C62828'};
        }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="container">
        <div class="logo">Cube Cake</div>
        <h1>Backend API Server</h1>
        
        <div class="status">🟢 Server is running on port ${PORT}</div>
        
        <div class="db-status">
          Database: ${mongoose.connection.readyState === 1 ? '🟢 Connected' : '🔴 Disconnected'}
        </div>
        
        <div class="endpoints">
          <h3>Quick Links:</h3>
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/health</span>
            <div class="description">Health check endpoint</div>
          </div>
          
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/api-docs</span>
            <div class="description">API documentation</div>
          </div>
          
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/api/orders</span>
            <div class="description">Get all orders</div>
          </div>
          
          <div class="endpoint">
            <span class="method get">GET</span>
            <span class="url">/api/cakes</span>
            <div class="description">Get all cakes</div>
          </div>
        </div>
        
        <div class="links">
          <a href="/health" class="btn btn-primary">Health Check</a>
          <a href="/api-docs" class="btn btn-secondary">API Documentation</a>
          <a href="/api/orders" class="btn btn-primary">View Orders</a>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 0.9rem;">
          Frontend should be running on: <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
        </p>
      </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      '/',
      '/health',
      '/api-docs',
      '/api/auth/register',
      '/api/auth/login',
      '/api/orders',
      '/api/cakes',
      '/api/stats'
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Server Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`
  🚀 Cube Cake Backend Server Started!
  =====================================
  🌐 Server URL: http://localhost:${PORT}
  📡 API Base: http://localhost:${PORT}/api
  🗄️  Database: ${MONGODB_URI}
  
  📋 Available Endpoints:
     • http://localhost:${PORT}/              - Dashboard
     • http://localhost:${PORT}/health        - Health Check
     • http://localhost:${PORT}/api-docs      - API Documentation
     • http://localhost:${PORT}/api/orders    - Orders API
     • http://localhost:${PORT}/api/cakes     - Cakes API
     • http://localhost:${PORT}/api/auth/*    - Authentication
  
  🔗 Frontend: http://localhost:3000
  
  Press Ctrl+C to stop the server.
  `);
});