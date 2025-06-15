// server.js

require("dotenv").config({ path: ".env" });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Debug: Log the Mongo URI (remove after testing)
console.log("📦 MONGO_URI:", process.env.MONGO_URI);

// ✅ Check if MONGO_URI exists before connecting
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file.");
  process.exit(1);
}

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Import middleware
const authMiddleware = require('./middleware/auth');

// Public routes
app.use('/api/auth', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use('/api/auth', require('./routes/auth'));

// Protected routes
app.use('/api/notices', authMiddleware, require('./routes/notices'));
app.use('/api/events', authMiddleware, require('./routes/events'));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🧪 ENV Test:", process.env.TEST_ENV); // Should print "loaded"

});
