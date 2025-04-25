import axiosInstance from './axiosInterceptor';


export const usersApi = {
    getUsers: async () => {
        return await axiosInstance.post('/users');
    }
}