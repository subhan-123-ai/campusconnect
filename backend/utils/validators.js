// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 6 characters)
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Department validation
const isValidDepartment = (department) => {
  const departments = ['AI', 'CS', 'SE', 'DS', 'BBA', 'EE'];
  return departments.includes(department);
};

// Semester validation
const isValidSemester = (semester) => {
  return semester >= 1 && semester <= 8;
};

// Complaint category validation
const isValidComplaintCategory = (category) => {
  const categories = ['Professor', 'Hostel', 'Cafeteria', 'Internet', 'Classroom', 'Transport', 'Other'];
  return categories.includes(category);
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidDepartment,
  isValidSemester,
  isValidComplaintCategory,
};