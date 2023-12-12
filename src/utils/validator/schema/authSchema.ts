import Joi from "joi";

export const googleAuthSchema = Joi.object({
  tokenId: Joi.string().required(),
});

export const adminLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
