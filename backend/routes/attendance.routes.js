import express from 'express';
import { checkIn, checkOut, getAttendance,checkTodayStatus } from '../controllers/attendance.controller.js';

const attendanceRoutes = express.Router();

attendanceRoutes.post('/checkin', checkIn);
attendanceRoutes.put('/checkout', checkOut);
attendanceRoutes.get('/:internId', getAttendance);
attendanceRoutes.post('/status', checkTodayStatus);

export default attendanceRoutes;
