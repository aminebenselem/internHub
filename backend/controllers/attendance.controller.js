import Attendance from '../models/attendance.model.js';

export const checkIn = async (req, res) => {
  try {
      const { internId } = req.body;
     const now = new Date();

    const date = now.toISOString().split('T')[0];
    const checkInTime = now.toTimeString().split(' ')[0];

    // ✅ Prevent duplicate check-in for the same day
    const existing = await Attendance.findOne({ where: { internId, date } });
    if (existing) {
      return res.status(400).json({ message: 'Already checked in today.' });
    }

    const attendance = await Attendance.create({ internId, date, checkInTime });
    res.status(201).json(attendance);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const checkOut = async (req, res) => {
  try {
    const { internId } = req.body;
        const now = new Date();

    const date = now.toISOString().split('T')[0];

    const record = await Attendance.findOne({ where: { internId, date } });
    if (!record) return res.status(404).json({ error: 'Record not found' });

    if (record.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out today.' });
    }

    const checkOutTime = now.toTimeString().split(' ')[0];

    record.checkOutTime = checkOutTime;
    await record.save();

    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
export const checkTodayStatus = async (req, res) => {
  try {
    const { internId } = req.body;
    const today = new Date().toISOString().split('T')[0];

    const record = await Attendance.findOne({
      where: { internId, date: today }
    });

    if (!record) return res.json({ checkedIn: false });

    return res.json({
      checkedIn: true,
      checkedOut: !!record.checkOutTime,
      record
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAttendance = async (req, res) => {
  const { internId } = req.params;
  const records = await Attendance.findAll({ where: { internId } });
  res.json(records);
};
