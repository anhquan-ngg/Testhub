import { Router } from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { getAllUsers, getRecentUsers, addUser, patchUser, deleteUser } from '../controllers/UserController.js';

const userRoutes = Router();

// GET ALL USERS
userRoutes.get('/list-users', verifyToken, getAllUsers);

// GET RECENT USERS
userRoutes.get('/recent-users', verifyToken, getRecentUsers);

// ADD USER
userRoutes.post('/add-user', verifyToken, addUser);

// PATCH USER
userRoutes.patch('/patch-user/:id', verifyToken, patchUser);

// DELETE USER
userRoutes.delete('/delete-user/:id', verifyToken, deleteUser);

export default userRoutes;
