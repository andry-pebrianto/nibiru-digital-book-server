import { Router } from "express";
import { jwtAuth } from "../../middlewares/jwtAuth";
import CustomerControllers from "../../controllers/customers/CustomerControllers";

const CustomerRoutes = Router();
CustomerRoutes.get("/profile", jwtAuth, CustomerControllers.findOneByJwt);

export default CustomerRoutes;
