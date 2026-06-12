import { create } from 'zustand';
import axiosInstance from '../api/axios';

const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
  };
};

const clearStoredAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('loginType');
};

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  loginType: null,
  isLoading: true,
  isAuthenticated: false,

  clearAuth: () => {
    clearStoredAuth();
    set({
      user: null,
      token: null,
      loginType: null,
      isAuthenticated: false,
    });
  },

  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const loginType = localStorage.getItem('loginType');

    if (!token || !storedUser) {
      clearStoredAuth();
      set({
        user: null,
        token: null,
        loginType: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return;
    }

    try {
      const response = await axiosInstance.get('/auth/profile');
      const normalizedUser = normalizeUser(response.data.user);
      const expectedLoginType = normalizedUser.role === 'admin' ? 'admin' : 'student';

      if (loginType !== expectedLoginType) {
        get().clearAuth();
        set({ isLoading: false });
        return;
      }

      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('loginType', expectedLoginType);

      set({
        token,
        user: normalizedUser,
        loginType: expectedLoginType,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      get().clearAuth();
      set({ isLoading: false });
    }
  },

  register: async (formData) => {
    try {
      set({ isLoading: true });
      get().clearAuth();

      const response = await axiosInstance.post('/auth/register', formData);
      const { token, user } = response.data;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('loginType', 'student');

      set({
        token,
        user: normalizedUser,
        loginType: 'student',
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  login: async (formData) => {
    try {
      set({ isLoading: true });
      get().clearAuth();

      const response = await axiosInstance.post('/auth/login', formData);
      const { token, user } = response.data;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('loginType', 'student');

      set({
        token,
        user: normalizedUser,
        loginType: 'student',
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  adminLogin: async (formData) => {
    try {
      set({ isLoading: true });
      get().clearAuth();

      const response = await axiosInstance.post('/auth/admin/login', formData);
      const { token, user } = response.data;
      const normalizedUser = normalizeUser(user);

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
      localStorage.setItem('loginType', 'admin');

      set({
        token,
        user: normalizedUser,
        loginType: 'admin',
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    get().clearAuth();
  },

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

export const selectIsStudentSession = (state) =>
  state.isAuthenticated &&
  state.loginType === 'student' &&
  state.user?.role !== 'admin';

export const selectIsAdminSession = (state) =>
  state.isAuthenticated &&
  state.loginType === 'admin' &&
  state.user?.role === 'admin';
