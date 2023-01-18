/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import dotenv from 'dotenv';
import userRouter from './domain/user/routes/userRoutes.js';
import authRouter from './domain/user/routes/authRoutes.js';
import postRouter from './domain/post/routes/postRoutes.js';
import AppError from './global/utils/appError.js';
import globalErrorHandler from './domain/user/controllers/errorController.js';
import mongoose from './global/config/mongoConfig.js';
import redis from './global/config/redisCofig.js';

const dirname = path.resolve();

dotenv.config();

const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! ❌ Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(dirname, 'public')));
app.use(allowCrossDomain);

// init database server
redis.connect();
try {
  mongoose();
} catch (error) {
  throw new AppError('Internal Server Error', 500, 'E500AC');
}

app.use(
  cors({ credentials: true, origin: `http://${process.env.CLIENT_URL}` }),
);
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/posts', postRouter);

app.all('*', (req, res, next) =>
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server!`,
      404,
      'E404AA',
    ),
  ),
);

app.use(globalErrorHandler);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! ❌ Shutting Down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});
