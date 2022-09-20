'use strict';
const knex = require('../config/knex');

async function getAllUsers() {
  return await knex('user').select('user_email');
}

async function findTargetUserByEmail(user_email) {
  console.log(user_email);
  const targetUser = await knex('user')
    .select('*')
    .where('user_email', user_email);

  return targetUser;
}
module.exports = { getAllUsers, findTargetUserByEmail };
