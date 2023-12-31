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
  getDetailTransaction(req: Request, res: Response) {
    TransactionServices.getDetailTransaction(req, res);
  }
  transactionNotification(req: Request, res: Response) {
    TransactionServices.transactionNotification(req, res);
  }
})();
