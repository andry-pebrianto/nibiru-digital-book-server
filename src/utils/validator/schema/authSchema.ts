import Joi from "joi";

export const googleAuthSchema = Joi.object({
  tokenId: Joi.string().required(),
});
