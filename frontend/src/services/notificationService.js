import axiosInstance from '../api/axios';

export const notificationService = {
  // Get notifications
  getNotifications: async (params) => {
    const response = await axiosInstance.get('/notifications', { params });
    return response.data;
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await axiosInstance.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await axiosInstance.patch('/notifications/mark-all/read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  },
};