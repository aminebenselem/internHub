import express from 'express';
import { createTask, getDashboardStats, getInternStats, getTasks, updateTaskStatus } from '../controllers/task.controller.js';
import { upload } from '../middleware/upload.js';

const taskRoutes = express.Router();

taskRoutes.post('/', upload.single('file'), createTask);
taskRoutes.get('/:id', getTasks);
taskRoutes.put('/:id/status', updateTaskStatus);
taskRoutes.get('/admin/stats', getDashboardStats);
taskRoutes.get('/intern/stats/:id', getInternStats);

export default taskRoutes;



