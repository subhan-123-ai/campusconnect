import axiosInstance from '../api/axios';

export const eventService = {
  getEvents: async (params) => {
    const response = await axiosInstance.get('/events', { params });
    return response.data;
  },

  getMyEvents: async () => {
    const response = await axiosInstance.get('/events/my-events');
    return response.data;
  },

  createEvent: async (formData) => {
    const response = await axiosInstance.post('/events/create', formData);
    return response.data;
  },

  registerForEvent: async (eventId) => {
    const response = await axiosInstance.post(`/events/${eventId}/register`);
    return response.data;
  },

  unregisterFromEvent: async (eventId) => {
    const response = await axiosInstance.post(`/events/${eventId}/unregister`);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await axiosInstance.delete(`/events/${eventId}`);
    return response.data;
  },
};
