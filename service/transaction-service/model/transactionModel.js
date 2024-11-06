import Joi from "joi";

export const transactionSchema = Joi.object({
  userId: Joi.number().required(),
  amount: Joi.number().required(),
  type: Joi.string().valid('INCOME', 'EXPENSE').required(),
  category: Joi.string().required(),
  date: Joi.date().optional(),
});