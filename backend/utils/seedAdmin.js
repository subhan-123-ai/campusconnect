const User = require('../models/User');
const University = require('../models/University');

const ADMIN_EMAIL = 'azanasghar1813@gmail.com';
const ADMIN_PASSWORD = 'Azan@181314';

const seedAdminIfNotExists = async () => {
  const university = await University.findOne().sort({ createdAt: 1 });
  if (!university) {
    console.warn('No universities found — skipping admin seed');
    return;
  }

  const existingUser = await User.findOne({ email: ADMIN_EMAIL });

  if (existingUser) {
    const needsPassword = existingUser.role !== 'admin' || !existingUser.isSuperAdmin;
    existingUser.role = 'admin';
    existingUser.isSuperAdmin = true;
    existingUser.isActive = true;
    existingUser.isBanned = false;
    if (needsPassword) {
      existingUser.password = ADMIN_PASSWORD;
    }
    await existingUser.save();
    console.log(`Admin account updated: ${ADMIN_EMAIL}`);
    return;
  }

  const admin = new User({
    name: 'Azan Asghar',
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    department: 'Administration',
    semester: 1,
    role: 'admin',
    isSuperAdmin: true,
    university: university._id,
  });

  await admin.save();
  console.log(`Super admin account created: ${ADMIN_EMAIL}`);
};

module.exports = seedAdminIfNotExists;
