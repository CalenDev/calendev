import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const { REDIS_SERVER_HOST, REDIS_SERVER_PORT, REDIS_SERVER_PASSWORD } =
  process.env;

const redisClient = redis.createClient({ legacyMode: true });

redisClient.on('connect', () => {
  console.info('Redis Connected!');
});

redisClient.on('error', (err) => {
  console.log(`Error ${err}`);
});

// 프로미스를 사용하기위한 레디스 Cli
const redisCli = redisClient.v4;

export default {
  connect: async () => {
    await redisClient.connect();
  },
  redisClient,
  redisCli,
};
