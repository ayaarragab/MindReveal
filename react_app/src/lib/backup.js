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
          
          // Use axiosInstance instead of axios to maintain baseURL and interceptors
          if (localStorage.getItem('role')) {
            await axiosInstance.post('/token', { refreshToken, role: localStorage.getItem('role') });
          } else
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
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
  
      // If not a 401 error or refresh failed, reject normally
      return Promise.reject(error);
    }
  );