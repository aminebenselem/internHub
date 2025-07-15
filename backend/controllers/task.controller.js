import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import { Op } from 'sequelize';
import { Role } from '../models/role.js';
import   Attendance  from '../models/attendance.model.js'; // adjust paths


import dayjs from 'dayjs';

export const getInternStats = async (req, res) => {
  const { id } = req.params; // Intern ID

  try {
    const now = dayjs();
    const startOfMonth = now.startOf('month').toDate();
    const today = now.toDate();
    const startOfWeek = now.startOf('week').toDate();

    // 1. Attendance Rate
    const attendanceRecords = await Attendance.findAll({
      where: {
        internId: id,
        date: {
          [Op.between]: [startOfMonth, today],
        },
      },
    });

    const presentDays = attendanceRecords.filter(a => a.status === 'present').length;
    const totalDaysPassed = now.date(); // Example: 23
    const attendanceRate = ((presentDays / totalDaysPassed) * 100).toFixed(1); // e.g. "95.6"

    // 2. Tasks Completed
    const allTasks = await Task.findAll({
      where: {
        assignedTo: id,
      },
    });

    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const completedTasksThisWeek = completedTasks.filter(t =>
      dayjs(t.updatedAt).isAfter(startOfWeek)
    );

  let totalHours = 0;

for (const record of attendanceRecords) {
  if (record.checkInTime && record.checkOutTime) {
    const dateStr = dayjs(record.date).format("YYYY-MM-DD");
    const checkIn = dayjs(`${dateStr}T${record.checkInTime}`);
    const checkOut = dayjs(`${dateStr}T${record.checkOutTime}`);

    const diff = checkOut.diff(checkIn, 'hour', true); // in fractional hours
    totalHours += diff;
  }
}

    // 4. Projects (based on tasks)
    const totalProjects = allTasks.length;
    const activeProjects = allTasks.filter(t => t.status !== 'completed').length;
    const completedProjects = totalProjects - activeProjects;

    return res.json({
      attendanceRate: `${attendanceRate}%`,
      presentDays,
      totalDays: totalDaysPassed,
      completedTasks: completedTasks.length,
      completedTasksThisWeek: completedTasksThisWeek.length,
      totalHours: Math.round(totalHours),
      totalProjects,
      activeProjects,
      completedProjects
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    // Total interns
    const totalInterns = await User.count({ where: { role: Role.INTERN } });

    // New interns from last month
    const internsGained = await User.count({
      where: {
        role: Role.INTERN,
        createdAt: {
          [Op.gte]: startOfLastMonth
        }
      }
    });

    // Present today
    const presentToday = await Attendance.count({
      where: {
        date: {
          [Op.between]: [startOfToday, endOfToday]
        },
        status: 'present'
      }
    });

    // Attendance percentage
    const attendancePercent = totalInterns > 0
      ? Math.round((presentToday / totalInterns) * 100)
      : 0;

    // Active tasks (not completed)
    const activeTasks = await Task.count({
      where: {
        status: {
          [Op.not]: 'completed'
        }
      }
    });

    // Completed projects (i.e., completed tasks)
    const completedProjects = await Task.count({
      where: {
        status: 'completed'
      }
    });

    res.json({
      totalInterns,
      internsGained,
      presentToday,
      attendancePercent,
      activeTasks,
      completedProjects
    });

  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      assignedDate,
      dueDate,
      status,
      assignedTo,
      assignedBy
    } = req.body;

const filePath = req.file ? req.file.filename : null;

    const task = await Task.create({
      title,
      description,
      priority,
      assignedDate,
      dueDate,
      status,
      assignedTo,
      assignedBy,
      file: filePath
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Task creation failed:', error);
    res.status(400).json({ error: error.message });
  }
};
export const getTasks = async (req, res) => {
  const { id } = req.params; // intern ID

  try {
    const tasks = await Task.findAll({
      where: { assignedTo: id }, // filter by intern ID
      attributes: { exclude: [] },
      include: [
        {
          model: User,
          as: 'intern',
          attributes: { exclude: ['password'] }
        },
        {
          model: User,
          as: 'admin',
          attributes: { exclude: ['password'] }
        }
      ]
    });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};