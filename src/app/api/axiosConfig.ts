// api/axiosConfig.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api'
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Oturum hatası
      localStorage.removeItem('auth');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;