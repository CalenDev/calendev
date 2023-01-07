import knex from '../../../global/config/knexConfig.js';

async function getAllUsers() {
  const users = await knex('user').select(
    'userEmail',
    'userNickname',
    'userPassword',
    'userRoleCd',
    'createdAtDttm',
    'salt',
  );
  return users;
}

async function findOne(value, columnName) {
  const user = await knex('user')
    .select(
      'userEmail',
      'userNickname',
      'userPassword',
      'userRoleCd',
      'createdAtDttm',
      'salt',
    )
    .where(columnName, value);
  return user;
}

async function save(body) {
  const res = await knex('user').insert(body);
  return res;
}
async function findTargetUserByEmail(userEmail) {
  const targetUser = await knex('user')
    .select(
      'userEmail',
      'userNickname',
      'userPassword',
      'userRoleCd',
      'createdAtDttm',
      'salt',
    )
    .where('userEmail', userEmail);

  return targetUser;
}
async function updateColumn(key, value, columnName) {
  await knex('user').update(columnName, value);
  return {
    success: true,
  };
}
export default {
  getAllUsers,
  findTargetUserByEmail,
  findOne,
  save,
  updateColumn,
};
