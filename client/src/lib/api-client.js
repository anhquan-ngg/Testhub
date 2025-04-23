import axios from 'axios';
import {HOST} from '@/utils/constants.js'

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
});