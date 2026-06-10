const mongoose = require('mongoose');
require('dotenv').config();
const University = require('./models/University');
const connectDB = require('./config/db');

const universities = [
  {
    name: 'Information Technology University',
    shortName: 'ITU',
    city: 'Lahore',
  },
  {
    name: 'FAST - NUCES',
    shortName: 'FAST',
    city: 'Islamabad',
  },
  {
    name: 'COMSATS University Islamabad',
    shortName: 'COMSATS',
    city: 'Islamabad',
  },
  {
    name: 'University of Engineering and Technology',
    shortName: 'UET',
    city: 'Lahore',
  },
  {
    name: 'University of Management and Technology',
    shortName: 'UMT',
    city: 'Lahore',
  },
  {
    name: 'University of Central Punjab',
    shortName: 'UCP',
    city: 'Lahore',
  },
  {
    name: 'Punjab University',
    shortName: 'PU',
    city: 'Lahore',
  },
  {
    name: 'University of Lahore',
    shortName: 'UOL',
    city: 'Lahore',
  },
  {
    name: 'Government College University',
    shortName: 'GCU',
    city: 'Lahore',
  },
  {
    name: 'National University of Sciences and Technology',
    shortName: 'NUST',
    city: 'Islamabad',
  },
];

const seedUniversities = async () => {
  try {
    await connectDB();

    // Clear existing universities
    await University.deleteMany({});
    console.log('🧹 Cleared existing universities');

    // Insert universities
    const result = await University.insertMany(universities);
    console.log(`✅ Seeded ${result.length} universities successfully!`);

    universities.forEach((uni) => {
      console.log(`   ✓ ${uni.shortName} - ${uni.name}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding universities:', error);
    process.exit(1);
  }
};

seedUniversities();