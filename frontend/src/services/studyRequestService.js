import axiosInstance from '../api/axios';

export const studyRequestService = {
  // Send study request
  sendStudyRequest: async (formData) => {
    const response = await axiosInstance.post('/study-requests/send', formData);
    return response.data;
  },

  // Get my study requests
  getMyStudyRequests: async (params) => {
    const response = await axiosInstance.get('/study-requests/my-requests', { params });
    return response.data;
  },

  // Get sent requests
  getMySentRequests: async (params) => {
    const response = await axiosInstance.get('/study-requests/sent-requests', { params });
    return response.data;
  },

  // Accept request
  acceptStudyRequest: async (requestId) => {
    const response = await axiosInstance.patch(`/study-requests/${requestId}/accept`);
    return response.data;
  },

  // Reject request
  rejectStudyRequest: async (requestId) => {
    const response = await axiosInstance.patch(`/study-requests/${requestId}/reject`);
    return response.data;
  },

  // Cancel request
  cancelStudyRequest: async (requestId) => {
    const response = await axiosInstance.delete(`/study-requests/${requestId}/cancel`);
    return response.data;
  },
};