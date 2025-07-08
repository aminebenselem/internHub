import express from 'express';
import { getAllUsers, addUser ,getUserById ,removeUser,editUser } from '../controllers/user.controller.js';

const userRoutes = express.Router();

userRoutes.get('/users', getAllUsers);
userRoutes.post('/users', addUser);
userRoutes.get('/users:id', getUserById);
userRoutes.ptach('/users:id', editUser);
userRoutes.delete('/users:id', removeUser);

export default userRoutes;
