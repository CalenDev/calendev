/* eslint-disable no-param-reassign */
import AppError from '../../../global/utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
// const handleDuplicateFieldDB = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   console.log(value);
// };
// const handleDuplicateEntryDB = (err) => {
//   const message = `Duplicate Entry exists!`;
//   return new AppError(message, 401);
// };
const handleJsonWebTokenError = (err) => {
  const message = `JsonWebTokenError : ${err.detail}`;
  return new AppError(message, 400);
};
const handleNotBeforeError = (err) => {
  const message = `NotBeforeError: ${err.message} | ${err.date}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    code: err.errorCode,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: 클라이언트에게 표시
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      code: err.errorCode,
    });
  } else {
    // Programming error or unknown error : 클라이언트에게 미표시
    // 1) log error
    console.error('ERROR!! ❌', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
