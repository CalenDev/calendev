import knex from '../../../global/config/knexConfig.js';

async function getAllUsers() {
  const users = await knex('user').select('*');
  return users;
}

async function findOne(value, columnName) {
  const user = await knex('user').select('*').where(columnName, value);
  return user;
}

async function save(body) {
  const res = await knex('user').insert(body);
  return res;
}
async function findTargetUserByEmail(userEmail) {
  const targetUser = await knex('user')
    .select('*')
    .where('userEmail', userEmail);

  return targetUser;
}

export default {
  getAllUsers,
  findTargetUserByEmail,
  findOne,
  save,
};
