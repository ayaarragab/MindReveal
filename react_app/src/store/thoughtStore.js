import { create } from 'zustand';
import { thoughtsApi } from '@/lib/thoughtsApi';

export const useThoughtStore = create((set, get) => ({
  thoughts: [],
  categories: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  fetchThoughts: async (page = 1) => { // retrieve thoughts worked
    set({ isLoading: true });
    try {
      const response = await thoughtsApi.getAll(page);
      
      set({
        thoughts: response.data.slice(0, 3),
        currentPage: page,
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  searchThoughts: async (query, page = 1) => {
    set({ isLoading: true });
    try {
      const response = await thoughtsApi.search(query, page);
      set({
        thoughts: response.data,
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
      const response = await thoughtsApi.create(thought);
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
      const response = await thoughtsApi.update(id, thought);
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
      await thoughtsApi.delete(id);
      set((state) => ({
        thoughts: state.thoughts.filter((t) => t.id !== id),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // fetchCategories: async () => {
  //   set({ isLoading: true });
  //   try {
  //     const response = await api.categories.getAll();
  //     set({ categories: response, isLoading: false });
  //   } catch (error) {
  //     set({ error: error.message, isLoading: false });
  //   }
  // },
}));
