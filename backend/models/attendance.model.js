import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './user.model.js';

const Attendance = sequelize.define('Attendance', {
  date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  checkInTime: DataTypes.TIME,
  checkOutTime: DataTypes.TIME,
  status: {
    type: DataTypes.ENUM('present', 'absent', 'on-leave'),
    defaultValue: 'present',
  },
});

Attendance.belongsTo(User, { foreignKey: 'internId', as: 'intern' });
User.hasMany(Attendance, { foreignKey: 'internId', as: 'attendanceRecords' });

export default Attendance;
