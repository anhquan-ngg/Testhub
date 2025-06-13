import axios from 'axios';
import { HOST } from '../utils/constants';
import { useAppStore } from '../store/index';

export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true, // Quan trọng: gửi cookies tự động
    timeout: 10000,
});

