const mongoose = require('mongoose');
const Cake = require('./models/Cake');
const Order = require('./models/Order');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cakeShopDB';

const cakeData = [
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
  // Add all your cake data from utils
];

const orderData = [
  {
    orderId: "ORDER-12345",
    customerName: "John Doe",
    phone: "0771234567",
    email: "john@example.com",
    deliveryDate: new Date("2024-12-25"),
    deliveryType: "delivery",
    deliveryAddress: "123 Main St",
    base: "chocolate",
    frosting: "vanilla",
    size: "medium",
    layers: 3,
    totalPrice: 54.99,
    status: "Pending"
  },
  // Add more sample orders
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Cake.deleteMany({});
    await Order.deleteMany({});
    
    // Insert cakes
    const cakes = await Cake.insertMany(cakeData);
    console.log(`Inserted ${cakes.length} cakes`);
    
    // Insert orders
    const orders = await Order.insertMany(orderData);
    console.log(`Inserted ${orders.length} orders`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();