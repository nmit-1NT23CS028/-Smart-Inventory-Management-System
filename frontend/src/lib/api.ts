import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('sims_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (typeof window !== 'undefined' && e.response?.status === 401) {
      localStorage.removeItem('sims_token');
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }
    return Promise.reject(e);
  }
);
