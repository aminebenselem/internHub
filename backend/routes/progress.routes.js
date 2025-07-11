import express from 'express';
import { addProgress, getProgressByIntern } from '../controllers/progress.controller.js';

const progressRoutes = express.Router();

progressRoutes.post('/', addProgress);
progressRoutes.get('/:internId', getProgressByIntern);

export default progressRoutes;