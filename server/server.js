const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes');

// Load environment variables
dotenv.config();

// Basic check for required env values (helpful during setup)
if (!process.env.MONGO_URI) {
  // eslint-disable-next-line no-console
  console.warn('Warning: MONGO_URI is not set in .env');
}
if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('Warning: JWT_SECRET is not set in .env');
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// Get port from environment or default
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${PORT}`);
});

