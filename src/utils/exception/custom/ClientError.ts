abstract class ClientError extends Error {
  statusMessage: string;
  statusCode: number;

  constructor(message: string, statusMessage: string, statusCode: number) {
    super(message);

    this.statusMessage = statusMessage;
    this.statusCode = statusCode;
  }
}

export default ClientError;
