import User from '../models/user.model.js';

export const createUser = async (data) => await User.create(data);

export const getUsers = async () => await User.findAll();

export const getUserByPk = async (id) => await User.findByPk(id);

export const deleteUser = async (id) => {
  const deleted = await User.destroy({ where: { id } });
  return deleted; 
};

export const updateUser = async (id, data) => {
  return await User.update(data, { where: { id } });
};
