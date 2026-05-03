import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
});

// Интерсептор запросов - добавляет institution_id в заголовки
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Добавляем текущий institution_id в заголовок (если есть)
    const institutionId = localStorage.getItem('current_institution_id');
    if (institutionId && config.url.includes('/api/v1/institutions/')) {
      config.headers['X-Institution-Id'] = institutionId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерсептор ответов - обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('current_institution_id');
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      console.error('Доступ запрещён: пользователь не состоит в этой организации');
    }
    return Promise.reject(error);
  }
);

export default apiClient;