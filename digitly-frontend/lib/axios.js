import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  withCredentials: true, 
});

// Добавляем токен в заголовки 
api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Неавторизован → редирект на логин
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;