// models/task.model.js
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './user.model.js';

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: DataTypes.TEXT,
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  assignedDate: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  dueDate: DataTypes.DATEONLY,
  status: {
    type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
    defaultValue: 'pending',
  },
});

//  Assigned to Intern
Task.belongsTo(User, { foreignKey: 'assignedTo', as: 'intern' });
User.hasMany(Task, { foreignKey: 'assignedTo', as: 'assignedTasks' });

//  Assigned by Admin
Task.belongsTo(User, { foreignKey: 'assignedBy', as: 'admin' });
User.hasMany(Task, { foreignKey: 'assignedBy', as: 'createdTasks' });

export default Task;
