/**
 * Seed Script — Creates the default admin account.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL || 'admin@college.edu';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = 'System Administrator';

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`✅ Existing user promoted to admin: ${email}`);
      } else {
        console.log(`ℹ️  Admin already exists: ${email}`);
      }
    } else {
      await User.create({ name, email, password, role: 'admin' });
      console.log(`✅ Admin account created successfully!`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${password}`);
    }
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
};

seedAdmin();
