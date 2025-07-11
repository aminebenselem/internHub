import express from 'express';
import { checkIn, checkOut, getAttendance } from '../controllers/attendance.controller.js';

const attendanceRoutes = express.Router();

attendanceRoutes.post('/checkin', checkIn);
attendanceRoutes.put('/checkout/:id', checkOut);
attendanceRoutes.get('/:internId', getAttendance);

export default attendanceRoutes;
