//*Dedicated error class for service errors

import { StatusCodes, ReasonPhrases } from "http-status-codes";

class ServiceError extends Error {
  constructor(
    message = "Service Error",
    explaination = ReasonPhrases.INTERNAL_SERVER_ERROR,
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    super(message);
    this.explaination = explaination,
    this.statusCode = statusCode;
  }
}

export default ServiceError;
