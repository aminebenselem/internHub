import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const User = sequelize.define('User', {
  username: DataTypes.STRING,
  password: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
});

export default User;
