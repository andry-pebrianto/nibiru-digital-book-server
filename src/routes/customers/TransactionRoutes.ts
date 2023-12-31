import { Router } from "express";
import TransactionControllers from "../../controllers/customers/TransactionControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { onlyCustomer, transactionOwner } from "../../middlewares/authorization";

const TransactionRoutes = Router();
TransactionRoutes.post("/", jwtAuth, onlyCustomer, TransactionControllers.createTransaction);
TransactionRoutes.get("/:transactionId", jwtAuth, onlyCustomer, transactionOwner, TransactionControllers.getDetailTransaction);
TransactionRoutes.post("/notification", TransactionControllers.transactionNotification);

export default TransactionRoutes;
