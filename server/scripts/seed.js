require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Item = require('../models/Item');
const connectDB = require('../config/db');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@college.edu',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Security Officer',
    email: 'security@college.edu',
    password: 'security123',
    role: 'security',
  },
  {
    name: 'John Doe',
    email: 'john@college.edu',
    password: 'user123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@college.edu',
    password: 'user123',
    role: 'user',
  },
];

const sampleItems = [
  {
    title: 'College ID Card',
    description: 'Blue lanyard with college logo. Name: John Doe',
    category: 'Documents',
    location: 'Library - 2nd Floor',
    date: new Date('2025-01-05'),
    imageUrl: '',
    type: 'lost',
    status: 'Lost',
  },
  {
    title: 'iPhone 14 Pro',
    description: 'Black iPhone 14 Pro with a blue case. Screen has a small crack.',
    category: 'Electronics',
    location: 'Cafeteria',
    date: new Date('2025-01-07'),
    imageUrl: '',
    type: 'lost',
    status: 'Lost',
  },
  {
    title: 'Found: Wallet',
    description: 'Brown leather wallet found near the main gate. Contains some cash and cards.',
    category: 'Accessories',
    location: 'Main Gate',
    date: new Date('2025-01-08'),
    imageUrl: '',
    type: 'found',
    status: 'At Security',
  },
  {
    title: 'Lost: AirPods',
    description: 'White AirPods Pro in a black case. Last seen in the gym.',
    category: 'Electronics',
    location: 'Gymnasium',
    date: new Date('2025-01-04'),
    imageUrl: '',
    type: 'lost',
    status: 'Returned',
  },
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });
      createdUsers.push(user);
      console.log(`Created user: ${user.email}`);
    }

    // Create items (assign to random users)
    for (const itemData of sampleItems) {
      // Assign items to users (mix of admin and regular users)
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      const item = await Item.create({
        ...itemData,
        userId: randomUser._id,
      });
      console.log(`Created item: ${item.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@college.edu / admin123');
    console.log('Security Officer: security@college.edu / security123');
    console.log('User: john@college.edu / user123');
    console.log('User: jane@college.edu / user123');
    console.log('\nYou can now start the server and test the application.');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed
seedDatabase();

