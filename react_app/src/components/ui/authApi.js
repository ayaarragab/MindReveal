import axiosInstance from '../../lib/axiosInterceptor';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const authApi = {
  login: async (credentials) => {
    try {
      return await axiosInstance.post('/login', credentials);
    } catch (error) {
      throw new ApiError(error.message, error.status);
    }
  },
  
  register: async (userData) => {
    try {
      return await axiosInstance.post('/register', userData);
    } catch (error) {
      throw new ApiError(error.message, error.status);
    }
  },

  logout: () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    if (localStorage.getItem('role')) {
      localStorage.removeItem('role');
    }
  }
};