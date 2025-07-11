import { getUsers, createUser, getUserByPk, deleteUser, updateUser } from '../services/user.service.js';

export const getAllUsers = async (req, res) => {
  const users = await getUsers();
  res.json(users);
};

export const addUser = async (req, res) => {
  const user = await createUser(req.body);
  res.status(201).json(user);
};

export const getUserById = async (req, res) => {
  const { id } = req.params; 
  const user = await getUserByPk(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

export const removeUser = async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteUser(id);
  if (deleted) {
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const editUser = async (req, res) => {
  const { id } = req.params;
  const [updated] = await updateUser(id, req.body);
  if (updated) {
    const updatedUser = await getUserByPk(id);
    res.json(updatedUser);
  } else {
    res.status(404).json({ message: 'User not found or nothing changed' });
  }
};
