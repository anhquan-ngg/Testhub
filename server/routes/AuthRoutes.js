import {Router} from 'express';
import { signup, login, logout, getUserInfo, updateUserInfo } from '../controllers/AuthController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js'; 

const authRoutes = Router();

authRoutes.post('/signup', signup);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);
authRoutes.get('/user-info', verifyToken, getUserInfo);
// UPDATE USER INFO
authRoutes.put('/update-user-info', verifyToken, updateUserInfo);


export default authRoutes;