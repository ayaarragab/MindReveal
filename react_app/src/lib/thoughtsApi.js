import axiosInstance from './axiosInterceptor';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export const thoughtsApi = {
  getAll: async (page = 1, limit = 4) => {
    try {
      return await axiosInstance.get('/thoughts', { params: { page, limit } });
    } catch (error) {
      throw new ApiError(error.message, error.status);
    }
  },
  
  search: async (query, page = 1, limit = 4) => {
    try {
      return await axiosInstance.get('/thoughts/search', { 
        params: { keyword: query, page, limit } 
      });
    } catch (error) {
      console.log("here");
      throw new ApiError(error.message, error.status);
    }
  },
  
  create: async (thought) => {
    try {
      return await axiosInstance.post('/thoughts', thought);
    } catch (error) {
      throw new ApiError(error.message, error.status);
    }
  },
  
  update: async (id, thought) => {
    try {
      return await axiosInstance.put(`/thoughts/${id}`, thought);
    } catch (error) {
      throw new ApiError(error.message, error.status);
    }
  },
  
  delete: async (id) => {
    try {
      return await axiosInstance.delete(`/thoughts/${id}`);
    } catch (error) {
      throw new ApiError(error.message, error.status);
    }
  }
};