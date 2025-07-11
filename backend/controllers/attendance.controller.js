import Attendance from '../models/attendance.model.js';

export const checkIn = async (req, res) => {
  try {
    const { internId, date, checkInTime } = req.body;
    const attendance = await Attendance.create({ internId, date, checkInTime });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const checkOut = async (req, res) => {
  const { id } = req.params;
  const { checkOutTime } = req.body;
  const record = await Attendance.findByPk(id);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  record.checkOutTime = checkOutTime;
  await record.save();
  res.json(record);
};

export const getAttendance = async (req, res) => {
  const { internId } = req.params;
  const records = await Attendance.findAll({ where: { internId } });
  res.json(records);
};
