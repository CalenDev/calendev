import knex from '../../../global/config/knexConfig.js';

async function getAllUsers() {
  return await knex('user').select('*');
}

async function findOne(value, columnName) {
  const user = await knex('user').select('*').where(columnName, value);
  return user;
}

async function save(body) {
  //TODO: mysql이 insert한 객체를 리턴하는 함수를 지원하지 않음. success하면 어떻게 리턴할지고민해야함.

  return await knex('user').insert(body);
}
async function findTargetUserByEmail(user_email) {
  const targetUser = await knex('user')
    .select('*')
    .where('userEmail', user_email);

  return targetUser;
}
export default { getAllUsers, findTargetUserByEmail, findOne, save };
