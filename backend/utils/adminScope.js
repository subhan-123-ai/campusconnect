const User = require('../models/User');

const getAdminUser = async (userId) => {
  return User.findById(userId).populate('university');
};

const isSuperAdmin = (adminUser) => Boolean(adminUser?.isSuperAdmin);

const hasGlobalAccess = (adminUser) =>
  adminUser.role === 'admin' || isSuperAdmin(adminUser);

const getUniversityFilter = (adminUser, universityId) => {
  if (hasGlobalAccess(adminUser)) {
    return universityId ? { university: universityId } : {};
  }
  return { university: adminUser.university._id || adminUser.university };
};

const canManageUser = (adminUser, targetUser) => {
  if (!targetUser) return false;
  if (targetUser._id.toString() === adminUser._id.toString()) return false;
  if (targetUser.role === 'admin') return false;
  if (!hasGlobalAccess(adminUser)) {
    const adminUni = (adminUser.university._id || adminUser.university).toString();
    const targetUni = (targetUser.university._id || targetUser.university).toString();
    if (adminUni !== targetUni) return false;
  }
  return true;
};

module.exports = {
  getAdminUser,
  isSuperAdmin,
  hasGlobalAccess,
  getUniversityFilter,
  canManageUser,
};
