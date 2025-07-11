import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './user.model.js';
import Task from './task.model.js';

const Progress = sequelize.define('Progress', {
  description: DataTypes.TEXT,
  percentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  githubLink: DataTypes.STRING,
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
});

Progress.belongsTo(Task, { foreignKey: 'taskId' });
Task.hasMany(Progress, { foreignKey: 'taskId' });

Progress.belongsTo(User, { foreignKey: 'internId', as: 'intern' });
User.hasMany(Progress, { foreignKey: 'internId', as: 'progressUpdates' });

export default Progress;
