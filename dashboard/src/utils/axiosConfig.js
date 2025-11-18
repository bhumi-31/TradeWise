import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3002',
  timeout: 10000,
});

// Request interceptor - Add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request:', config.url);
      console.log('Token (first 30):', token.substring(0, 30) + '...');
    } else {
      console.warn('⚠️ No token found in localStorage for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiry
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Unauthorized! Token expired or invalid');
      console.log('Current token:', localStorage.getItem('token')?.substring(0, 30));
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      
      alert('Session expired! Please login again.');
      
      setTimeout(() => {
        window.location.href = 'http://localhost:3000/login';
      }, 100);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;