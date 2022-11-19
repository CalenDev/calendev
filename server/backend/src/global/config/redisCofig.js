import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const { REDIS_SERVER_HOST, REDIS_SERVER_PORT, REDIS_SERVER_PASSWORD } =
  process.env;

const redisClient = redis.createClient({
  socket: {
    host: REDIS_SERVER_HOST,
    port: REDIS_SERVER_PORT,
    db: 0,
  },
  password: REDIS_SERVER_PASSWORD,
});

redisClient.on('connect', () => {
  console.info('Redis Connected!');
});

redisClient.on('error', (err) => {
  console.log(`Error ${err}`);
});

export default {
  connect: async () => {
    await redisClient.connect();
  },
  redisClient,
};
