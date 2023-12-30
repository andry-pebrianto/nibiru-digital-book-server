import { Request, Response } from "express";
import TransactionServices from "../../services/customers/TransactionServices";
import runValidation from "../../utils/validator/runValidation";
import { createTransactionSchema } from "../../utils/validator/schema/transactionSchema";

export default new (class BookControllers {
  createTransaction(req: Request, res: Response) {
    if (runValidation(req, res, createTransactionSchema) === "VALID") {
      TransactionServices.createTransaction(req, res);
    }
  }
})();
