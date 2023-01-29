import knex from 'knex';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config({ path: './.env' });
const instance = knex({
  client: 'mysql2',
  connection: {
    host: 'host',
    user: process.env.LOCAL_DATABASE_USER,
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
    // mysql2는 timezone : 'UST' 대신 시간차이 직접적는다.
    timezone: '+09:00',
    typeCast(field, next) {
      if (field.type === 'DATETIME') {
        return moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
      }
      return next();
    },
  },
});

export default instance;
