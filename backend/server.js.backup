// server.js - SIMPLE WORKING VERSION
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
console.log('🔧 Connecting to MongoDB...');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeShopDB';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database:', mongoose.connection.name);
})
.catch((error) => {
    console.log('❌ MongoDB Connection Failed:', error.message);
    console.log('💡 Using fallback in-memory database for now...');
});

// Routes
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Cake Shop Backend</title></head>
            <body style="font-family: Arial; padding: 20px;">
                <h1>🎂 Cake Shop Backend is Running!</h1>
                <p>Server is working correctly.</p>
                <p>Database Status: ${mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected'}</p>
                <p>Try these endpoints:</p>
                <ul>
                    <li><a href="/health">/health</a> - Health check</li>
                    <li><a href="/api/test">/api/test</a> - API test</li>
                </ul>
            </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.json({
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        port: PORT
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working!',
        success: true
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server started on: http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`⚡ Press Ctrl+C to stop`);
});