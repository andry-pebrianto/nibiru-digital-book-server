import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import UnauthorizedError from "../utils/exception/custom/UnauthorizedError";
import Env from "../utils/variables/Env";
import handleError from "../utils/exception/handleError";

export function jwtAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      throw new Error();
    }

    const token = authorizationHeader.split(" ")[1];
    const auth = jwt.verify(token, Env.JWT_SECRET);
    res.locals.auth = auth;
    next();
  } catch (error) {
    return handleError(
      res,
      new UnauthorizedError("JWT Token Invalid", "Access Unauthorized")
    );
  }
}
