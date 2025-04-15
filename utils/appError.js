class AppError extends Error {
  // class inheritence
  constructor(message, statusCode) {
    super(message); // We are passing message to Error (parent) class

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'failed' : 'error';
    this.isOperational = true;

    // By calling Error.captureStackTrace(this, this.constructor);, we ensure that the stack trace does
    // not include the constructor function (AppError).
    // Instead, it starts from where the error actually occurred.
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
