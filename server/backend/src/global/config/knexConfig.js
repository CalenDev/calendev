import knex from 'knex';
import dotenv from 'dotenv';
import moment from 'moment';

dotenv.config({ path: './.env' });
const instance = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: process.env.LOCAL_DATABASE_USER, // 실제 서비스에서는 root 계정을 사용하지 않는 것이 좋습니다.
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
