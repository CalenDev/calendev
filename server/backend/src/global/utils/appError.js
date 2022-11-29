class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // operational error임을 명시

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
