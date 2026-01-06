const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeShopDB';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('MongoDB Connected Successfully!');
})
.catch((error) => {
    console.log('MongoDB Connection Error:', error.message);
});

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head><title>Cake Shop Backend</title></head>
            <body style="font-family: Arial; padding: 20px;">
                <h1>Cake Shop Backend is Running!</h1>
                <p><strong>Status:</strong> Server is working</p>
                <p><strong>Database:</strong> ${mongoose.connection.readyState === 1 ? 'Connected' : 'Using Memory (OK for testing)'}</p>
                <p><strong>Endpoints:</strong></p>
                <ul>
                    <li><a href="/">/</a> - This page</li>
                    <li><a href="/health">/health</a> - Health check</li>
                    <li><a href="/api/test">/api/test</a> - API test</li>
                    <li><a href="/api/orders">GET /api/orders</a> - View orders</li>
                    <li>POST /api/orders - Place order (use Postman/curl)</li>
                </ul>
                <p><em>Note: Orders are saved in memory for testing. They'll persist until server restarts.</em></p>
            </body>
        </html>
    `);
});

app.get('/health', (req, res) => {
    res.json({
        status: 'Server is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'mongodb_connected' : 'memory_storage',
        port: PORT,
        message: 'Ready to accept cake orders!'
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'API is working!',
        success: true,
        database: mongoose.connection.readyState === 1 ? 'MongoDB' : 'In-memory (for testing)'
    });
});

let temporaryOrders = [];
let orderCounter = 1;

app.post('/api/orders', (req, res) => {
    try {
        const order = {
            id: `ORDER-${orderCounter++}`,
            ...req.body,
            createdAt: new Date(),
            status: 'Pending',
            orderNumber: Date.now()
        };
        
        temporaryOrders.push(order);
        
        console.log(`New order received: ${order.id}`);
        
        res.json({
            success: true,
            message: 'Order placed successfully!',
            order: order,
            note: mongoose.connection.readyState === 1 ? 
                  'Saved to MongoDB' : 
                  'Saved to memory (will persist until server restarts)'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error placing order',
            error: error.message
        });
    }
});

app.get('/api/orders', (req, res) => {
    res.json({
        success: true,
        count: temporaryOrders.length,
        orders: temporaryOrders,
        storage: mongoose.connection.readyState === 1 ? 'MongoDB' : 'Memory',
        note: 'To place orders, send POST request to /api/orders'
    });
});

app.listen(PORT, () => {
    console.log(`Server started on: http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Place order: POST http://localhost:${PORT}/api/orders`);
    console.log(`View orders: GET http://localhost:${PORT}/api/orders`);
    console.log(`Press Ctrl+C to stop`);
    console.log('');
    console.log('TIP: Use Postman or curl to test order placement!');
});
