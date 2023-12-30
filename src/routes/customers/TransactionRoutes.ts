import { Router } from "express";
import TransactionControllers from "../../controllers/customers/TransactionControllers";
import { jwtAuth } from "../../middlewares/jwtAuth";
import { onlyCustomer } from "../../middlewares/authorization";

const TransactionRoutes = Router();
TransactionRoutes.post("/", jwtAuth, onlyCustomer, TransactionControllers.createTransaction);

export default TransactionRoutes;
