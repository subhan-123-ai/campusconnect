const User = require('../models/User');
const University = require('../models/University');

const ADMIN_ACCOUNTS = [
  {
    email: 'azanasghar1813@gmail.com',
    password: 'Azan@181314',
    name: 'Azan Asghar',
    isSuperAdmin: true,
  },
  {
    email: 'admin@gmail.com',
    password: 'Admin@1234',
    name: 'Admin',
    isSuperAdmin: true,
  },
];

const upsertAdmin = async (university, { email, password, name, isSuperAdmin }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    existingUser.role = 'admin';
    existingUser.isSuperAdmin = isSuperAdmin;
    existingUser.isActive = true;
    existingUser.isBanned = false;
    existingUser.name = name;
    existingUser.password = password;
    await existingUser.save();
    console.log(`Admin account updated: ${email}`);
    return;
  }

  const admin = new User({
    name,
    email,
    password,
    department: 'Administration',
    semester: 1,
    role: 'admin',
    isSuperAdmin,
    university: university._id,
  });

  await admin.save();
  console.log(`Admin account created: ${email}`);
};

const seedAdminIfNotExists = async () => {
  const university = await University.findOne().sort({ createdAt: 1 });
  if (!university) {
    console.warn('No universities found — skipping admin seed');
    return;
  }

  for (const account of ADMIN_ACCOUNTS) {
    await upsertAdmin(university, account);
  }
};

module.exports = seedAdminIfNotExists;
