import ClientError from "./ClientError";

class BadRequestError extends ClientError {
  constructor(message: string, statusMessage: string) {
    super(message, statusMessage, 400);
  }
}

export default BadRequestError;
