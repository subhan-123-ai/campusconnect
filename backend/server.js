const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

const defaultOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://campusconnect-three-beta.vercel.app',
  'https://www.campusconnect-three-beta.vercel.app',
];

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

const allowedOrigins = [
  ...new Set(
    [...defaultOrigins, ...envOrigins, process.env.FRONTEND_URL].filter(Boolean)
  ),
];

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Allow Vercel preview/production deployments
  if (/^https:\/\/[\w-]+\.vercel\.app$/.test(origin)) return true;
  return false;
};

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.path} - Origin: ${req.get('origin') || 'none'}`
  );
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/study-requests', require('./routes/studyRequestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusConnect API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CampusConnect API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\nCampusConnect Backend Running on Port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`API: https://campusconnect-backend-wa1a.onrender.com/api`);
      console.log(`Frontend: https://campusconnect-three-beta.vercel.app\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
