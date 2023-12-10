import ClientError from "./ClientError";

class NotFoundError extends ClientError {
  constructor(message: string, statusMessage: string) {
    super(message, statusMessage, 404);
  }
}

export default NotFoundError;
