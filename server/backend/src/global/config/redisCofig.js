import redis from 'redis';
import dotenv from 'dotenv';
import AppError from '../utils/appError.js';

dotenv.config({ path: './.env' });

const { REDIS_SERVER_HOST, REDIS_SERVER_PORT, REDIS_SERVER_PASSWORD } =
  process.env;

const redisClient = redis.createClient({
  url: `redis://${REDIS_SERVER_HOST}:${REDIS_SERVER_PORT}`,
  password: REDIS_SERVER_PASSWORD,
  legacyMode: true,
});

redisClient.on('connect', () => {
  console.info('Redis Connected!');
});

redisClient.on('error', (err) => {
  console.log(`Error ${err}`);
  throw new AppError('Redis Server Down!!', 500, '500AD');
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
