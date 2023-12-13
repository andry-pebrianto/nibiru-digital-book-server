import ClientError from "./ClientError";

class ForbiddenError extends ClientError {
  constructor(message: string, statusMessage: string) {
    super(message, statusMessage, 403);
  }
}

export default ForbiddenError;
