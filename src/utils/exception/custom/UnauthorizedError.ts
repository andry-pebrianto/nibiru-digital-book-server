import ClientError from "./ClientError";

class UnauthorizedError extends ClientError {
  constructor(message: string, statusMessage: string) {
    super(message, statusMessage, 401);
  }
}

export default UnauthorizedError;
