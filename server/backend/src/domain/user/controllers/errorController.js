/* eslint-disable no-param-reassign */
import AppError from '../../../global/utils/appError.js';

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
      code: err.errorCode,
    });
  } else {
    // Programming error or unknown error : 클라이언트에게 미표시
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
