import axiosInstance from '../api/axios';

export const resourceService = {
  uploadResource: async (formData) => {
    const response = await axiosInstance.post('/resources/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getResources: async (params) => {
    const response = await axiosInstance.get('/resources', { params });
    return response.data;
  },

  getMyResources: async () => {
    const response = await axiosInstance.get('/resources/my-resources');
    return response.data;
  },

  downloadResource: async (resourceId) => {
    const response = await axiosInstance.post(`/resources/${resourceId}/download`);
    return response.data;
  },

  downloadResourceFile: async (resourceId, fileName) => {
    const response = await axiosInstance.get(`/resources/${resourceId}/file`, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || 'resource';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response;
  },

  deleteResource: async (resourceId) => {
    const response = await axiosInstance.delete(`/resources/${resourceId}`);
    return response.data;
  },
};
