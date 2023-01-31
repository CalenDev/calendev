import knex from 'knex';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config({ path: './.env' });

const {
  MYSQL_DATABASE_HOST,
  MYSQL_DATABASE_USER,
  MYSQL_DATABASE_PASSWORD,
  MYSQL_DATABASE_NAME,
  MYSQL_TIMEZONE_OPTION,
} = process.env;

const instance = knex({
  client: 'mysql2',
  connection: {
    host: MYSQL_DATABASE_HOST,
    user: MYSQL_DATABASE_USER,
    password: MYSQL_DATABASE_PASSWORD,
    database: MYSQL_DATABASE_NAME,
    // mysql2는 timezone : 'UST' 대신 시간차이 직접적는다.
    timezone: MYSQL_TIMEZONE_OPTION,
    typeCast(field, next) {
      if (field.type === 'DATETIME') {
        return moment(field.string()).format('YYYY-MM-DD HH:mm:ss');
      }
      return next();
    },
  },
});

export default instance;
