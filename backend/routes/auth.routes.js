import express from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.js';
import { body } from 'express-validator';

const authRoutes = express.Router();

// 📌 Registration Route
authRoutes.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').notEmpty().withMessage('usernamename is required'),
    body('role').notEmpty().withMessage('Role is required')
  ],
  register
);

// 📌 Login Route
authRoutes.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

// 📌 Get current user (protected)
authRoutes.get('/me', auth, getCurrentUser);

export default authRoutes;
