import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,   // e.g. http://localhost:3000/api/v1
  timeout: 15000,
});

// Attach token to every request (if present)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('payapp_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401s globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('payapp_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;
