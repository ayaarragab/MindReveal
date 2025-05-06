import axiosInstance from './axiosInterceptor';
 
export const usersApi = {
    getUsers: async () => {
        if (localStorage.getItem('role')) {            
            return await axiosInstance.post('/users', {
                body: {
                    role: 'admin'
                }
            });
        }
    }
}