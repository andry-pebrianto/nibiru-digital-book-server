import { Request, Response } from "express";
import Joi from "joi";
import handleError from "../exception/handleError";

const runValidation = (
  req: Request,
  res: Response,
  schema: Joi.ObjectSchema
): Response | "VALID" => {
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        code: 400,
        status: "failed",
        message: "Validation Failed",
        error: error.details[0].message,
      });
    }

    return "VALID";
  } catch (error) {
    return handleError(res, error);
  }
};

export default runValidation;
