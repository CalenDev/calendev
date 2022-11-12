import http from 'http';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
const __dirname = path.resolve();
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { rmSync } from 'fs';

//init dotenv
import dotenv from 'dotenv';
dotenv.config();

const app = express();

import userRouter from './domain/user/routes/userRoutes.js';
import authRouter from './domain/user/routes/authRoutes.js';
import { resolveSoa } from 'dns';
import AppError from './global/utils/appError.js';
import globalErrorHandler from './domain/user/controllers/errorController.js';

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

import mongoose from './global/config/mongoConfig.js';
mongoose();

const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
app.on('error', onError);
app.on('listening', onListening);

app.get('/', (req, res) => {
  res.send('backend server on!');
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/users', userRouter);
app.use('/auth', authRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! ❌ Shutting Down...');
  server.close(() => {
    process.exit(1);
  });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   //현재 view가 없어서 error생김. react 연동하면 해결될듯.
//   next(createError(404));
// });

// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.send('error!');
// });
