import axiosInstance from '../api/axios';

export const resourceService = {
  // Upload resource
  uploadResource: async (formData) => {
    const response = await axiosInstance.post('/resources/upload', formData);
    return response.data;
  },

  // Get resources
  getResources: async (params) => {
    const response = await axiosInstance.get('/resources', { params });
    return response.data;
  },

  // Get my resources
  getMyResources: async () => {
    const response = await axiosInstance.get('/resources/my-resources');
    return response.data;
  },

  // Download resource
  downloadResource: async (resourceId) => {
    const response = await axiosInstance.post(`/resources/${resourceId}/download`);
    return response.data;
  },

  // Delete resource
  deleteResource: async (resourceId) => {
    const response = await axiosInstance.delete(`/resources/${resourceId}`);
    return response.data;
  },
};