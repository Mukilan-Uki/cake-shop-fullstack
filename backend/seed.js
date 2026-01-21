const mongoose = require('mongoose');
const Cake = require('./models/Cake');
const Order = require('./models/Order');
const User = require('./models/User');
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
  },
  {
    name: "Red Velvet Royal",
    description: "Classic red velvet with cream cheese frosting and edible gold leaf",
    price: 49.99,
    category: "Special",
    image: "https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&h=300&fit=crop",
    rating: 4.9,
    flavors: ["Red Velvet", "Cream Cheese"],
    sizes: ["Medium", "Large"],
    isPopular: true,
    isNew: false
  },
  {
    name: "Lemon Sunshine",
    description: "Zesty lemon cake with lemon curd filling and lemon glaze",
    price: 37.99,
    category: "Spring",
    image: "https://images.unsplash.com/photo-1559620192-032c64bc86af?w=400&h=300&fit=crop",
    rating: 4.7,
    flavors: ["Lemon", "Citrus"],
    sizes: ["Small", "Medium"],
    isPopular: false,
    isNew: true
  },
  {
    name: "Caramel Delight",
    description: "Moist caramel cake with salted caramel frosting and toffee pieces",
    price: 44.99,
    category: "Birthday",
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop",
    rating: 4.8,
    flavors: ["Caramel", "Toffee"],
    sizes: ["Small", "Medium", "Large"],
    isPopular: true,
    isNew: false
  }
];

const orderData = [
  {
    orderId: "ORDER-1704192345001",
    customerName: "John Doe",
    phone: "0771234567",
    email: "john@example.com",
    deliveryDate: new Date("2024-12-25"),
    deliveryType: "delivery",
    deliveryAddress: "123 Main St, Colombo 05",
    base: "chocolate",
    frosting: "vanilla",
    size: "medium",
    layers: 3,
    toppings: ["sprinkles", "berries"],
    message: "Happy Birthday John!",
    colors: {
      cake: "#8B4513",
      frosting: "#FFF5E6",
      decorations: "#FF6B8B"
    },
    totalPrice: 54.99,
    status: "Pending",
    specialInstructions: "Add extra sprinkles on top",
    paymentMethod: "cash"
  },
  {
    orderId: "ORDER-1704192345002",
    customerName: "Jane Smith",
    phone: "0777654321",
    email: "jane@example.com",
    deliveryDate: new Date("2024-12-20"),
    deliveryType: "pickup",
    base: "red-velvet",
    frosting: "cream-cheese",
    size: "large",
    layers: 4,
    toppings: ["flowers", "gold-leaf"],
    message: "Happy Anniversary!",
    colors: {
      cake: "#8B0000",
      frosting: "#FFFAF0",
      decorations: "#FF1493"
    },
    totalPrice: 69.99,
    status: "Preparing",
    specialInstructions: "Make it extra special for 25th anniversary",
    paymentMethod: "card"
  },
  {
    orderId: "ORDER-1704192345003",
    customerName: "Robert Johnson",
    phone: "0771122334",
    email: "robert@example.com",
    deliveryDate: new Date("2024-12-22"),
    deliveryType: "delivery",
    deliveryAddress: "456 Park Ave, Kandy",
    base: "vanilla",
    frosting: "strawberry",
    size: "small",
    layers: 2,
    toppings: ["chocolate-chips"],
    message: "Get Well Soon!",
    colors: {
      cake: "#F3E5AB",
      frosting: "#FFB6C1",
      decorations: "#9D5CFF"
    },
    totalPrice: 34.99,
    status: "Completed",
    specialInstructions: "Make it heart-shaped if possible",
    paymentMethod: "online"
  }
];

const userData = [
  {
    name: "Admin User",
    email: "admin@cubecake.com",
    phone: "0743086099",
    password: "admin123",
    role: "admin"
  },
  {
    name: "Test Customer",
    email: "customer@example.com",
    phone: "0771234567",
    password: "password123",
    role: "customer"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Cake.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    
    console.log('🗑️ Cleared existing data');
    
    // Insert cakes
    const cakes = await Cake.insertMany(cakeData);
    console.log(`✅ Inserted ${cakes.length} cakes`);
    
    // Insert orders
    const orders = await Order.insertMany(orderData);
    console.log(`✅ Inserted ${orders.length} orders`);
    
    // Insert users
    const users = await User.insertMany(userData);
    console.log(`✅ Inserted ${users.length} users`);
    
    // Create admin token
    const jwt = require('jsonwebtoken');
    const adminUser = await User.findOne({ email: "admin@cubecake.com" });
    
    if (adminUser) {
      const adminToken = jwt.sign(
        { id: adminUser._id, role: 'admin' }, 
        process.env.JWT_SECRET || 'your-secret-key-change-this',
        { expiresIn: '30d' }
      );
      console.log('\n🔐 Admin Login Credentials:');
      console.log('Email: admin@cubecake.com');
      console.log('Password: admin123');
      console.log('Token:', adminToken.substring(0, 50) + '...');
    }
    
    console.log('\n🎂 Database seeded successfully!');
    console.log('\n📊 Sample Data:');
    console.log(`   Cakes: ${cakes.length}`);
    console.log(`   Orders: ${orders.length}`);
    console.log(`   Users: ${users.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();