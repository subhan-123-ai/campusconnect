import { create } from 'zustand';
import axiosInstance from '../api/axios';

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
  };
};

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  // Initialize auth from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      set({
        token,
        user: normalizeUser(JSON.parse(user)),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({ isLoading: false });
    }
  },

  // Register
  register: async (formData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post('/auth/register', formData);

      const { token, user } = response.data;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      set({
        token,
        user: normalizedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Login
  login: async (formData) => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.post('/auth/login', formData);

      const { token, user } = response.data;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      set({
        token,
        user: normalizedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const response = await axiosInstance.put('/auth/profile', updates);
      const normalizedUser = normalizeUser(response.data.user);

      localStorage.setItem('user', JSON.stringify(normalizedUser));
      set({ user: normalizedUser });

      return response.data;
    } catch (error) {
      throw error;
    }
  },
}));