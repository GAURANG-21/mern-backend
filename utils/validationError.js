class ValidationError extends Error {
  constructor(message, explaination, statusCode) {
    super(message);
    this.explaination = explaination,
    this.statusCode = statusCode;
  }
}

export default ValidationError;
