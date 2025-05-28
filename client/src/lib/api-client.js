import axios from 'axios';
import { HOST } from '../utils/constants';

export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true, // Quan trọng: gửi cookies tự động
    timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.url);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor để handle auth errors
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired hoặc invalid
            console.log('Authentication failed, redirecting to login');
            // Clear user info from store
            const { clearUserInfo } = useAppStore.getState();
            clearUserInfo();
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
