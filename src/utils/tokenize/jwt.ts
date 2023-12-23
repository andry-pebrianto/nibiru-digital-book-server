import jwt from "jsonwebtoken";
import Env from "../variables/Env";

export const generateRefreshToken = async (payload: { id: string }) => {
  const token = jwt.sign(payload, Env.REFRESH_TOKEN_KEY, {
    expiresIn: 604800,
  });

  return token;
};

export const generateAccessToken = async (payload: { id: string }) => {
  const token = jwt.sign(payload, Env.ACCESS_TOKEN_KEY, {
    expiresIn: 120,
  });

  return token;
};
