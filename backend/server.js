const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB();

// ====================================
// CORS Configuration
// ====================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// ====================================
// Middleware
// ====================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`
  );
  next();
});

// ====================================
// Routes
// ====================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/study-requests', require('./routes/studyRequestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// ====================================
// Root Route
// ====================================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusConnect API Running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    database:
      mongoose.connection.readyState === 1
        ? 'connected'
        : 'disconnected',
  });
});

// ====================================
// Health Check Route
// ====================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ====================================
// 404 Handler
// ====================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ====================================
// Global Error Handler
// ====================================
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ====================================
// Start Server
// ====================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n===================================');
  console.log(`🚀 CampusConnect Server Running`);
  console.log(`🌍 Environment : ${process.env.NODE_ENV}`);
  console.log(`📍 Port        : ${PORT}`);
  console.log(`🗄️ Database    : MongoDB Connected`);
  console.log('===================================\n');
});

// ====================================
// Graceful Shutdown
// ====================================
process.on('SIGINT', () => {
  console.log('\nShutting down server...');

  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;