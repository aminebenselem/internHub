import Progress from '../models/progress.model.js';

export const addProgress = async (req, res) => {
  try {
    const progress = await Progress.create(req.body);
    res.status(201).json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProgressByIntern = async (req, res) => {
  const { internId } = req.params;
  const progress = await Progress.findAll({ where: { internId } });
  res.json(progress);
};
