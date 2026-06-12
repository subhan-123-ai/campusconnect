import axiosInstance from '../api/axios';

export const adminService = {
  getDashboardStats: async (params) => {
    const response = await axiosInstance.get('/admin/dashboard/stats', { params });
    return response.data;
  },

  getUniversities: async () => {
    const response = await axiosInstance.get('/admin/universities');
    return response.data;
  },

  createUniversity: async (data) => {
    const response = await axiosInstance.post('/admin/universities', data);
    return response.data;
  },

  deleteUniversity: async (universityId) => {
    const response = await axiosInstance.delete(`/admin/universities/${universityId}`);
    return response.data;
  },

  getUsers: async (params) => {
    const response = await axiosInstance.get('/admin/users', { params });
    return response.data;
  },

  banUser: async (userId) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/ban`);
    return response.data;
  },

  unbanUser: async (userId) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/unban`);
    return response.data;
  },

  restrictUser: async (userId) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/restrict`);
    return response.data;
  },

  activateUser: async (userId) => {
    const response = await axiosInstance.patch(`/admin/users/${userId}/activate`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },

  getResources: async (params) => {
    const response = await axiosInstance.get('/admin/resources', { params });
    return response.data;
  },

  approveResource: async (resourceId) => {
    const response = await axiosInstance.patch(`/admin/resources/${resourceId}/approve`);
    return response.data;
  },

  rejectResource: async (resourceId) => {
    const response = await axiosInstance.patch(`/admin/resources/${resourceId}/reject`);
    return response.data;
  },

  deleteResource: async (resourceId) => {
    const response = await axiosInstance.delete(`/admin/resources/${resourceId}`);
    return response.data;
  },

  getEvents: async (params) => {
    const response = await axiosInstance.get('/admin/events', { params });
    return response.data;
  },

  approveEvent: async (eventId) => {
    const response = await axiosInstance.patch(`/admin/events/${eventId}/approve`);
    return response.data;
  },

  rejectEvent: async (eventId) => {
    const response = await axiosInstance.patch(`/admin/events/${eventId}/reject`);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await axiosInstance.delete(`/admin/events/${eventId}`);
    return response.data;
  },
};
