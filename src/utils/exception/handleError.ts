import { Response } from "express";
import ClientError from "./custom/ClientError";

const handleError = (res: Response, error: unknown): Response => {
  if (error instanceof ClientError) {
    console.log(error.message);

    return res.status(error.statusCode).json({
      code: error.statusCode,
      status: "failed",
      message: error.statusMessage,
      error: error.message,
    });
  }

  if (error instanceof Error) {
    console.log(error.message);

    return res.status(500).json({
      code: 500,
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }

  return res.status(500).json({
    code: 500,
    status: "failed",
    message: "Internal Server Error",
    error: "An unknown error occurred",
  });
};

export default handleError;
