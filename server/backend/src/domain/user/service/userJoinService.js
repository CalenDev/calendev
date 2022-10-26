import User from './../models/user.js';

const findAll = async function () {
  const usrs = await User.getAllUsers();
  return usrs;
};
const findOne = async (req, res) => {
  res.send('nor');
};
export default { findAll, findOne };
