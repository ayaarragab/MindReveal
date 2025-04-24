import { create } from 'zustand';
import { api } from '@/lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.auth.login(credentials);
      localStorage.setItem('access-token', response.accessToken);
      localStorage.setItem('refresh-token', response.refreshToken);
      
      set({ user: response.user, isAuthenticated: true, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.auth.register(userData);
      localStorage.setItem('access-token', response.accessToken);
      localStorage.setItem('refresh-token', response.refreshToken);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
      return response;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  getToken: async (refreshToken) => {
    try {
      const response = await api.auth.getNewAccessToken();
      localStorage.setItem('access-token', response.accessToken);
      localStorage.setItem('refresh-token', response.refreshToken);
      set({ user: response.user, isAuthenticated: true, isLoading: false });
      return response;

    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
      
    }    
  }
}));
