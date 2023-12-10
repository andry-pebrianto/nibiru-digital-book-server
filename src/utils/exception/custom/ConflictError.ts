import ClientError from "./ClientError";

class ConflictError extends ClientError {
  constructor(message: string, statusMessage: string) {
    super(message, statusMessage, 409);
  }
}

export default ConflictError;
