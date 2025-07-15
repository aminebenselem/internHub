import express from 'express';
import sequelize from './database.js';
import dotenv from 'dotenv';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import progressRoutes from './routes/progress.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';

import './models/user.model.js';
import './models/task.model.js';
import './models/progress.model.js';
import './models/attendance.model.js'; 
import cors from 'cors';

import path from 'path';



dotenv.config();
const app = express();
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/attendance', attendanceRoutes);
// ✅ Sync DB AFTER all models are loaded
sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () =>
    console.log(`✅ Server running at http://localhost:${process.env.PORT}/api`)
  );
});
