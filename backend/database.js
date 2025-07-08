import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config()


const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
});

export default sequelize;
