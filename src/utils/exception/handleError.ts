import { Response } from "express";
import ClientError from "./custom/ClientError";
import { handleLog } from "../winston/logger";

const handleError = (res: Response, error: unknown): Response => {
  const user = res.locals?.auth?.id || "No User";

  if (error instanceof ClientError) {
    console.log(error.message);
    if (error.statusCode !== 401) {
      handleLog(error.message, user);
    }

    return res.status(error.statusCode).json({
      code: error.statusCode,
      status: "failed",
      message: error.statusMessage,
      error: error.message,
    });
  }

  if (error instanceof Error) {
    console.log(error.message);
    handleLog(error.message, user);

    return res.status(500).json({
      code: 500,
      status: "failed",
      message: "Internal Server Error",
      error: error.message,
    });
  }

  handleLog("An unknown error occurred", user);
  return res.status(500).json({
    code: 500,
    status: "failed",
    message: "Internal Server Error",
    error: "An unknown error occurred",
  });
};

export default handleError;
