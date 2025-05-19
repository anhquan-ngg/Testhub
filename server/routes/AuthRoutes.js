import {Router} from 'express';
import { signup, login, logout, getUserInfo, updateUserInfo } from '../controllers/AuthController.js';

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/user-info', getUserInfo);

// UPDATE USER INFO
authRoutes.put('/update-user-info', updateUserInfo);

export default authRoutes;