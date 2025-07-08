import express from 'express';
import sequelize from './database.js';
import userRoutes from './routes/user.routes.js';
import dotenv from 'dotenv'
dotenv.config()
const app = express();

app.use(express.json());
app.use('/api', userRoutes);

// auto-sync tables
sequelize.sync({ alter: true }).then(() => {
 
  app.listen(3000, () => console.log(`Server running at http://localhost:${process.env.PORT}/api`));
});
