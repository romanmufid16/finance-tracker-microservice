import { transactionSchema } from "../model/transactionModel.js"

export const validateTransaction = (req, res, next) => {
  const { error, value } = transactionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  req.body = value;
  next();
}