const mongoose = require('mongoose');

let memoryServer = null;

const seedUniversitiesIfEmpty = async () => {
  const University = require('../models/University');

  const count = await University.countDocuments();
  if (count > 0) return;

  const universities = [
    { name: 'Information Technology University', shortName: 'ITU', city: 'Lahore' },
    { name: 'FAST - NUCES', shortName: 'FAST', city: 'Islamabad' },
    { name: 'COMSATS University Islamabad', shortName: 'COMSATS', city: 'Islamabad' },
    { name: 'University of Engineering and Technology', shortName: 'UET', city: 'Lahore' },
    { name: 'University of Management and Technology', shortName: 'UMT', city: 'Lahore' },
    { name: 'University of Central Punjab', shortName: 'UCP', city: 'Lahore' },
    { name: 'Punjab University', shortName: 'PU', city: 'Lahore' },
    { name: 'University of Lahore', shortName: 'UOL', city: 'Lahore' },
    { name: 'Government College University', shortName: 'GCU', city: 'Lahore' },
    { name: 'National University of Sciences and Technology', shortName: 'NUST', city: 'Islamabad' },
  ];

  await University.insertMany(universities);
  console.log(`Seeded ${universities.length} universities`);
};

const connectDB = async () => {
  const useMemoryDb =
    process.env.USE_MEMORY_DB === 'true' || process.env.NODE_ENV === 'development';
  const uri = process.env.MONGO_URI;

  const connectOptions = {
    serverSelectionTimeoutMS: 10000,
    autoSelectFamily: false,
  };

  if (uri && process.env.USE_MEMORY_DB !== 'true') {
    try {
      const conn = await mongoose.connect(uri, connectOptions);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      await seedUniversitiesIfEmpty();
      return conn;
    } catch (error) {
      console.error('Atlas/remote MongoDB connection failed:', error.message);

      if (!useMemoryDb) {
        throw error;
      }

      console.warn('Falling back to in-memory MongoDB for local development...');
    }
  }

  if (!useMemoryDb) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();

  const conn = await mongoose.connect(memoryUri, connectOptions);
  console.log('MongoDB Connected: in-memory database (local dev)');
  await seedUniversitiesIfEmpty();
  return conn;
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};

module.exports = connectDB;
module.exports.disconnectDB = disconnectDB;
