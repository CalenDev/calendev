import knex from '../../../global/config/knexConfig.js';

export default {
  getAllUsers: async () => {
    const users = await knex('user').select(
      'userEmail',
      'userNickname',
      'userPassword',
      'userRoleCd',
      'createdAtDttm',
      'salt',
    );
    return users;
  },
  findOne: async (value, columnName) => {
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
  },
  save: async (body) => {
    const res = await knex('user').insert(body);
    return res;
  },

  findTargetUserByEmail: async (userEmail) => {
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
  },

  updateOne: async (key, value, columnName) => {
    await knex('user').update(columnName, value);
    return {
      success: true,
    };
  },
  remove: async (userId) => {
    await knex('user').where('userId', userId).del();
  },
};
