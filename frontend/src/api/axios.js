import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const loginType = localStorage.getItem('loginType');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('loginType');
      window.location.href = loginType === 'admin' ? '/admin/login' : '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
