import knex from '../../../global/config/knexConfig.js';

async function getAllUsers() {
  return await knex('user').select('user_email');
}

async function findOne(column_name, value) {
  const user = await knex('user').select('*').where(column_name, value);
  return user;
}

async function save(body) {
  //TODO: mysql이 insert한 객체를 리턴하는 함수를 지원하지 않음. success하면 어떻게 리턴할지고민해야함.

  return await knex('user').insert(body);
}
async function findTargetUserByEmail(user_email) {
  console.log(user_email);
  const targetUser = await knex('user')
    .select('*')
    .where('user_email', user_email);

  return targetUser;
}
module.exports = { getAllUsers, findTargetUserByEmail, findOne, save };
