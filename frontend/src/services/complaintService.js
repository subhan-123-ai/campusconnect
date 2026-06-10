import axiosInstance from '../api/axios';

export const complaintService = {
  // Submit complaint
  submitComplaint: async (formData) => {
    const response = await axiosInstance.post('/complaints/submit', formData);
    return response.data;
  },

  // Get my complaints
  getMyComplaints: async (params) => {
    const response = await axiosInstance.get('/complaints/my-complaints', { params });
    return response.data;
  },

  // Get complaint detail
  getComplaintDetail: async (complaintId) => {
    const response = await axiosInstance.get(`/complaints/${complaintId}`);
    return response.data;
  },

  // Get all complaints (admin)
  getAllComplaints: async (params) => {
    const response = await axiosInstance.get('/complaints/all', { params });
    return response.data;
  },

  // Update complaint status (admin)
  updateComplaintStatus: async (complaintId, data) => {
    const response = await axiosInstance.patch(`/complaints/${complaintId}/status`, data);
    return response.data;
  },
};