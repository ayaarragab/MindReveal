
import { create } from 'zustand';
import { api } from '@/lib/api';

export const useThoughtStore = create((set, get) => ({
  thoughts: [],
  categories: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  fetchThoughts: async (page = 1) => {
    set({ isLoading: true });
    try {
      const response = await api.thoughts.getAll(page);
      set({
        thoughts: response.thoughts,
        currentPage: page,
        totalPages: response.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  searchThoughts: async (query, page = 1) => {
    set({ isLoading: true });
    try {
      const response = await api.thoughts.search(query, page);
      set({
        thoughts: response.thoughts,
        currentPage: page,
        totalPages: response.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createThought: async (thought) => {
    try {
      const response = await api.thoughts.create(thought);
      set((state) => ({
        thoughts: [response, ...state.thoughts],
      }));
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateThought: async (id, thought) => {
    try {
      const response = await api.thoughts.update(id, thought);
      set((state) => ({
        thoughts: state.thoughts.map((t) =>
          t.id === id ? response : t
        ),
      }));
      return response;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteThought: async (id) => {
    try {
      await api.thoughts.delete(id);
      set((state) => ({
        thoughts: state.thoughts.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const response = await api.categories.getAll();
      set({ categories: response, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
