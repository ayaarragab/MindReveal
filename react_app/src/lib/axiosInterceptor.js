import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/mindreveal/api/v1';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedRequests = [];

const processFailedRequests = (token) => {
  failedRequests.forEach((prom) => {
    prom.resolve(token);
  });
  failedRequests = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.data  && config.data.username && config.data.username.includes('admin')) {
      localStorage.setItem('role', 'admin');
    }
    if (config.method === 'post' && localStorage.getItem('role')) {
      if (!config.data) {
        config.data = {};
      }
      config.data.role = localStorage.getItem('role');
    }
    const accessToken = localStorage.getItem('access-token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    
    const refreshToken = localStorage.getItem('refresh-token');

    // Only handle 401 errors and avoid infinite loops
    if (error.response?.status === 401 && 
        !originalRequest._retry && 
        refreshToken &&
        !originalRequest.url.includes('/token')) {
      
      if (isRefreshing) {
        return new Promise((resolve) => {
          failedRequests.push({ resolve });
        }).then((newToken) => {
          localStorage.setItem('access-token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axiosInstance.post('/token', { refreshToken });
        const newAccessToken = response.accessToken;
        localStorage.setItem('access-token', newAccessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        
        processFailedRequests(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('access-token');
        localStorage.removeItem('refresh-token');
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    else if (error.response?.status === 403 && 
      !originalRequest._retry) {
        console.log(originalRequest);
        
    }
    // If not a 401 error or refresh failed, reject normally
    return Promise.reject(error);
  }
);

export default axiosInstance;