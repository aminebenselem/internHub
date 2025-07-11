import Task from '../models/task.model.js';

export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTasks = async (req, res) => {
  const tasks = await Task.findAll({ include: ['assignee', 'assigner'] });
  res.json(tasks);
};

export const updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const task = await Task.findByPk(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  task.status = status;
  await task.save();
  res.json(task);
};