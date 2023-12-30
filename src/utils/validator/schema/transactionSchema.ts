import Joi from "joi";

export const createTransactionSchema = Joi.object({
  bookId: Joi.string().required(),
});
