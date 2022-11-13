import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });
const instance = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: process.env.LOCAL_DATABASE_USER, // 실제 서비스에서는 root 계정을 사용하지 않는 것이 좋습니다.
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: process.env.LOCAL_DATABASE_NAME,
  },
});

export default instance;
