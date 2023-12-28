import Joi from "joi";

export const addBookSchema = Joi.object({
  title: Joi.string().required().max(100),
  author: Joi.string().required().max(100),
  synopsis: Joi.string().required(),
  photos: Joi.array()
    .items(Joi.string())
    .min(1) // min ada 1 item array
    .required(),
  price: Joi.number().required(),
  genre: Joi.string().required(),
  file_url: Joi.string().required(),
});
