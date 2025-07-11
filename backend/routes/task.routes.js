import express from 'express';
import { createTask, getTasks, updateTaskStatus } from '../controllers/task.controller.js';

const taskRoutes = express.Router();

taskRoutes.post('/', createTask);
taskRoutes.get('/', getTasks);
taskRoutes.put('/:id/status', updateTaskStatus);

export default taskRoutes;



