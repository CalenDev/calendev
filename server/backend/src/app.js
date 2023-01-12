/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
import http from 'http';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';
import { rmSync } from 'fs';
import dotenv from 'dotenv';
import { resolveSoa } from 'dns';
import userRouter from './domain/user/routes/userRoutes.js';
import authRouter from './domain/user/routes/authRoutes.js';
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

mongoose();
redis.connect();

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(dirname, 'public')));
app.use(allowCrossDomain);

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
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

app.get('/', (req, res) => {
  res.send('backend server on!');
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);

app.all('*', (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)),
);

app.use(globalErrorHandler);

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! ❌ Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
