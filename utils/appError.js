//*This is the generalized error class

class AppError extends Error {
  constructor(message, explaination, statusCode) {
    super(message);
    this.explaination = explaination;
    this.statusCode = statusCode;
  }
}

export default AppError;
