import { create } from 'zustand';

export const useUsersStore = create((set) => ({
    users: [],
    isLoading: false,
    isAuthenticated: false,
    error: null,

    fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await usersApi.getUsers();
            set({ users: response.data, isLoading: false, isAuthenticated: true });
            return response.data;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },
}));
