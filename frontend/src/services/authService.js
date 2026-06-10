import axiosInstance from '../api/axios';

export const authService = {
  // Get user profile
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (formData) => {
    const response = await axiosInstance.put('/auth/profile', formData);
    return response.data;
  },

  // Get all universities
  getAllUniversities: async () => {
    const response = await axiosInstance.get('/auth/universities');
    return response.data;
  },

  // Get students
  getStudents: async (params) => {
    const response = await axiosInstance.get('/auth/students', { params });
    return response.data;
  },
};