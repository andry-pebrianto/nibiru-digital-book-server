import Joi from "joi";

export const addGenreSchema = Joi.object({
  title: Joi.string().required().max(50),
});
