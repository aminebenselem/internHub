import express from 'express';
import { getAllUsers, addUser ,getUserById ,removeUser,editUser, getInterns } from '../controllers/user.controller.js';
import { authorize } from '../middleware/auth.js';

const userRoutes = express.Router();

userRoutes.get('/users',authorize('admin'), getAllUsers);
userRoutes.get('/interns',authorize('admin','intern'), getInterns);
userRoutes.post('/users',authorize('admin'), addUser);
userRoutes.get('/users:id',authorize('admin'), getUserById);
userRoutes.patch('/users:id',authorize('admin'), editUser);
userRoutes.delete('/users:id',authorize('admin'), removeUser);

export default userRoutes;
